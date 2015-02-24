/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
    var Dog = Sprite.extend({
        //是否正在咬萝卜车，这是时钟
        beat: 0,
        //这种狗狗晕后的得分
        score: 0,
        //狗狗能够承受的攻击
        bear: 10,
        init: function(x, y, z, opts) {
            this.super(x, y, z, opts);
            //添加跑动动画
            this.addAnimation('run', [0, 1, 2, 3], 100);
            //添加停住动画
            this.addAnimation('stop', [4, 5], 100);
            //添加晕倒动画
            this.addAnimation('sleep', [6, 7], 100);
            //添加后退动画
            this.addAnimation('back', [8, 9, 10, 11], 100);
            this.setCurrentAnim('run');
        },
        update: function(fps) {
            this.super(fps);
            //如果狗狗正在跑动
            if (this.currentAnimation == this.animations.run) {
                //如果咬到萝卜车了，则停止，每秒咬一下萝卜车
                if (this.collideWith(this.scene.carrot)) {
                    if (!this.beat) {
                        this.beat = window.setInterval(this.beatTheCarrot.bind(this), 1000);
                    }
                    this.speed.x = 0;
                }
            }
            //如果晕倒了或者后退了，则移出屏幕则当消失了
            if (this.currentAnimation == this.animations.sleep || this.currentAnimation == this.animations.back) {
                if (this.position.x > this.scene.getStageSize().width) {
                    this.kill();
                    this.scene.dogs.remove(this);
                }
            }
        },
        beatTheCarrot: function() {
            //扣除萝卜1点血量
            if (this.scene.carrot && this.scene.carrot.health > 0) {
                this.scene.carrot.hurt(100 / this.scene.carrot.bear);
            } else {
                clearInterval(this.beat);
                this.beat = 0;
            }
        }
    });
    module.exports = Dog;
});