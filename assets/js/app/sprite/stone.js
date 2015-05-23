/**
 * @author lbc
 */
define(['lib/sprite'], function(Sprite) {
    var Stone = Sprite.extend({
        targetX: 0,
        targetY: 0,
        init: function(x, y, z, texture) {
            this.super(x, y, z);
            this.setTexture(texture);
            //扔骨头的动画
            this.addAnimation('throw', [0, 1, 2, 3], 100);
            this.setCurrentAnim('throw');
        },
        setTarget: function(targetX, targetY) {
            //扔的目标位置
            this.targetX = targetX;
            this.targetY = targetY;
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
        },
        update: function(fps) {
            var self = this;
            this.super(fps);
            this.scene.dogs.forEach(function(dog) {
                if (self.collideWith(dog) && self.z === dog.z && dog.currentAnimation == dog.animations.run) {
                    self.kill();
                    dog.setCurrentAnim('stop', 2, function() {
                        dog.setCurrentAnim('run');
                        dog.speed.x = -120;
                    });
                    dog.hurt(100 / dog.bear);
                    if (dog.health <= 0) {
                        dog.setCurrentAnim('sleep');
                        self.scene.sumScore += dog.score;
                        self.scene.score.setNum(self.scene.sumScore.toString());
                        if (dog.beat) {
                            clearInterval(dog.beat);
                            dog.beat = 0;
                        }
                    }
                    dog.speed.set(120, 0);
                }
            });
            if (this.position.y > 600) {
                this.kill();
            }
        }
    });
    return Stone;
});