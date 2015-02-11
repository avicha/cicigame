/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
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
    module.exports = Button;
});
// YI.package('engine.ui').module('button').import('engine.sprite').define(function() {
//     Button = YI.Button = YI.Sprite.extend({
//         init: function(x, y, z, texture) {
//             this.super(x, y, z);
//             this.setTexture(texture);
//             //鼠标上到上边时图案
//             this.addAnimation('mouseout', [0], 100);
//             //鼠标移出时的图案
//             this.addAnimation('mousein', [1], 100);
//             this.setCurrentAnim('mouseout');
//         }
//     });
//     Button.Textures = {
//         enterButton: new Texture('enterButton.png', 1, 2),
//         menuButton: new Texture('menuButton.png', 1, 1),
//         stopButton: new Texture('stopButton.png', 1, 1)
//     };
// });