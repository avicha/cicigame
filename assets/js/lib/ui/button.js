/**
 * @author lbc
 */
define(['lib/sprite'], function(Sprite) {
    var Button = Sprite.extend({
        init: function(x, y, z, texture) {
            this.super(x, y, z);
            this.setTexture(texture);
            //鼠标上到上边时图案
            this.addAnimation('mouseout', [0], 100);
            //鼠标移出时的图案
            this.addAnimation('mousein', [1], 100);
            this.setCurrentAnim('mouseout');
        }
    });
    return Button;
});