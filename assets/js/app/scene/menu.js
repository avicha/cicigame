/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Scene = require('lib/scene');
    var Texture = require('lib/texture');
    var Background = require('lib/ui/background');
    var Button = require('lib/ui/button');
    var MenuScene = Scene.extend({
        resources: {
            menuBg: new Texture('menuBg.png'),
            enterButton: new Texture('enterButton.png', 1, 2)
        },
        init: function() {
            var self = this;
            this.menuBg = this.addGameObject(new Background(0, 0, 0, this.resources.menuBg));
            this.enterButton = this.addGameObject(new Button(252, 153, 1, this.resources.enterButton));
            this.on('touchMove', function(target) {
                if (target === self.enterButton) {
                    self.enterButton.setCurrentAnim('mousein');
                } else {
                    self.enterButton.setCurrentAnim('mouseout');
                }
            });
            this.on('tap', function(target) {
                if (target === this.enterButton) {

                }
            });
        }
    });
    module.exports = MenuScene;
});
// YI.package('game.scene').module('menu').import('engine.scene').define(function() {
//     Menu = YI.Scene.extend({
//         init: function() {
//             this.range = new Rect(0, 0, YI.width, YI.height);
//             this.menuBg = this.addGameObject(new Background(0, 0, Layer.Background, Background.Textures.menuBg));
//             this.enter = this.addGameObject(new Button(252, 153, Layer.Controllayer, Button.Textures.enterButton));
//         },
//         handleEvent: function() {
//             var o = Event.getChooseObject();
//             if (Event.currentEvent == Event.type.touchMove && o == this.enter) {
//                 this.enter.setCurrentAnim('mousein');
//             } else {
//                 this.enter.setCurrentAnim('mouseout');
//             }
//             if (Event.currentEvent == Event.type.tap) {
//                 if (o == this.enter) {
//                     YI.jumpToScene(YI.Scene.Main_1);
//                 }
//             }
//             this.super();
//         }
//     });
// });