/**
 * @author lbc
 */
YI.package('game.sprite').module('bone').import('engine.sprite').define(function () {
    Bone = Sprite.extend({
        //骨头纹理
        texture:new Texture('bone.png', 1, 4),

        targetX:0,

        targetY:0,

        init:function (x, y, z, targetX, targetY) {

            this.super(x, y, z);
            //扔的目标位置
            this.targetX = targetX;

            this.targetY = targetY;
            //扔骨头的动画
            this.addAnimation('throw', [0, 1, 2, 3], 100);
            //扔的时间控制
            var t = 1;
            //扔的开始位置
            var startX = this.position.x + this.shape.pivot.x;
            var startY = this.position.y + this.shape.pivot.y;
            //扔的速度
            this.speed.x = (this.targetX - startX) / t;
            this.speed.y = -1.5 * this.speed.x;
            //扔的加速度
            this.acceleration.y = 2 * (this.targetY - startY - this.speed.y * t) / (t * t);
            this.setCurrentAnim('throw');

        },
        update:function () {

            this.super();
            //如果扔中狗狗了，则移除骨头，狗狗掉头走
            _.each(YI.curScene.dogs,function (e) {

                if (this.collideWith(e) && this.z == e.z && e.currentAnimation == e.animations.run) {

                    this.kill();

                    e.setCurrentAnim('back');

                    clearInterval(e.beat);

                    e.beat = -1;

                    e.speed.set(240, 0);

                }

            },this);

            //扔不中则移除骨头
            if (this.position.y > 600) {

                this.kill();

            }

        }
    });
});

