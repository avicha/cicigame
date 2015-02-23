/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
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
            this.super(fps);
            if (this.position.y > 600) {
                this.kill();
            }
        }
    });
    module.exports = Stone;
});
// YI.package('game.sprite').module('stone').import('engine.sprite').define(function() {
//     Stone = Sprite.extend({
//         texture: new Texture('stone.png', 1, 4),
//         targetX: 0,
//         targetY: 0,
//         init: function(x, y, z, targetX, targetY) {
//             this.super(x, y, z);

//             //扔骨头的动画
//             this.addAnimation('throw', [0, 1, 2, 3], 100);
//             //扔的时间控制
//             var t = 1;
//             //扔的开始位置
//             var startX = this.position.x + this.shape.pivot.x;
//             var startY = this.position.y + this.shape.pivot.y;
//             //扔的速度
//             this.speed.x = (this.targetX - startX) / t;
//             this.speed.y = -1.5 * this.speed.x;
//             //扔的加速度
//             this.acceleration.y = 2 * (this.targetY - startY - this.speed.y * t) / (t * t);
//             this.setCurrentAnim('throw');
//         },
//         update: function() {
//             this.super();
//             _.each(YI.curScene.dogs, function(e) {
//                 if (this.collideWith(e) && this.z == e.z && e.currentAnimation == e.animations.run) {
//                     this.kill();
//                     e.setCurrentAnim('stop', 2, function() {
//                         e.setCurrentAnim('run');
//                         e.speed.x = -120;
//                     });
//                     e.hurt(100 / e.bear);
//                     if (e.health <= 0) {
//                         e.setCurrentAnim('sleep');
//                         YI.curScene.sumScore += e.score;
//                         YI.curScene.score.setNum(YI.curScene.sumScore.toString());
//                         clearInterval(e.beat);
//                         e.beat = -1;
//                     }
//                     e.speed.set(120, 0);
//                 }
//             }, this);
//             if (this.position.y > 600) {
//                 this.kill();
//             }
//         }
//     });
// });