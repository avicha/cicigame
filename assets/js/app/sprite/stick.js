/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
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
    module.exports = Stick;
});