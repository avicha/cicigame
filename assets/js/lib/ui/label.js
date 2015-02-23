/**
 * @author lbc
 */
define(function(require, exports, module) {
    var DrawableObject = require('lib/drawableobject');
    var Label = DrawableObject.extend({
        //标签图案
        icon: null,
        init: function(x, y, z, icon) {
            this.super(x, y, z);
            this.icon = icon;
        },
        draw: function(context) {
            this.icon.drawTile(context, this.position.x, this.position.y);
        }
    });
    module.exports = Label;
});