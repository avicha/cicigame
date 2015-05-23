/**
 * @author lbc
 */
define(['lib/sprite'], function(Sprite) {
    var Stick = Sprite.extend({
        init: function(x, y, z, texture) {
            this.super(x, y, z);
            this.setTexture(texture);
            this.addAnimation('throw', [0, 1, 2, 1, 0], 100);
            this.setCurrentAnim('throw', 1);
        },
        update: function(fps) {
            this.super(fps);
            if (this.currentAnimation.ended) {
                this.kill();
            }
        }
    });
    return Stick;
});