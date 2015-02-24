/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
    var Carrot = Sprite.extend({
        //是否被咬
        isBeated: false,
        //能够承受被咬的次数
        bear: 10,
        init: function(x, y, z, opts) {
            this.super(x, y, z, opts);
            //添加跑的动画
            this.addAnimation('run', [0, 1, 2], 100);
            //添加被咬时警告的动画
            this.addAnimation('warm', [3, 4, 5, 4], 100);
            this.setCurrentAnim('run');
        },
        update: function(fps) {
            this.super(fps);
            this.isBeated = false;
            //改变血条的宽度
            this.scene.blood.icon.tileWidth = 240 * this.health / 100;
            if (this.health <= 0) {
                this.scene.trigger('fail');
            }
            this.scene.dogs.forEach(function(dog) {
                if (dog.beat) {
                    this.isBeated = true;
                }
            });
            //如果被咬着但当前动画不是警告则设置为警告
            if (this.isBeated && this.currentAnimation != this.animations.warm) {
                this.setCurrentAnim('warm');
            }
            //如果没有被咬着但当前动画不是跑动则设置为跑动
            if (!this.isBeated && this.currentAnimation != this.animations.run) {
                this.setCurrentAnim('run');
            }
        }
    });
    module.exports = Carrot;
});