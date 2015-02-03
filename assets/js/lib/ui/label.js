/**
 * @author lbc
 */
YI.package('engine.ui').module('label').import('engine.drawableobject', 'engine.texture').define(function() {
    Label = YI.Label = YI.DrawableObject.extend({
        //标签图案
        icon: null,
        init: function(x, y, z, icon) {
            this.super(x, y, z);
            this.icon = icon;
        },
        draw: function() {
            this.icon.drawTile(this.position.x, this.position.y);
        }
    });
    Label.Textures = {
        headBg: new Texture('headBg.png'),
        head: new Texture('head.png'),
        toolBg: new Texture('toolBg.png'),
        bloodBg: new Texture('bloodBg.png'),
        blood: new Texture('blood.png'),
        scoreBg: new Texture('scoreBg.png')
    };
});