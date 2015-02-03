/**
 * @author lbc
 */
YI.package('game.sprite').module('stick').import('engine.sprite').define(function() {
    Stick = Sprite.extend({
        texture: new Texture('stick.png', 1, 3),
        target: null,
        init: function(x, y, z, o) {
            this.super(x, y, z);
            this.target = o;
            this.addAnimation('throw', [0, 1, 2, 1, 0], 100);
            this.setCurrentAnim('throw', 1);
            o.setCurrentAnim('stop', 2, function() {
                o.setCurrentAnim('run');
                o.speed.x = -120;
            });
            this.target.hurt(100 / this.target.bear);
            if (this.target.health <= 0) {
                this.target.setCurrentAnim('sleep');
                YI.curScene.sumScore += this.target.score;
                YI.curScene.score.setNum(YI.curScene.sumScore.toString());
                this.target.speed.x = 120;
            } else {
                this.target.position.x += 150;
            }
            clearInterval(this.target.beat);
            this.target.beat = -1;
        },
        update: function() {
            this.super();
            if (this.currentAnimation.ended) {
                this.kill();
            }
        }
    });
});