/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Scene = require('lib/scene');
    var Texture = require('lib/texture');
    var Background = require('lib/ui/background');
    var Button = require('lib/ui/button');
    var MenuScene = Scene.extend({
        init: function() {
            var self = this;
            this.menuBg = this.addGameObject(new Background(0, 0, 0, MenuScene.resources.menuBg));
            this.enterButton = this.addGameObject(new Button(252, 153, 1, MenuScene.resources.enterButton));
            this.on('touchMove', function(e) {
                if (e.target === self.enterButton) {
                    self.enterButton.setCurrentAnim('mousein');
                } else {
                    self.enterButton.setCurrentAnim('mouseout');
                }
            });
            this.on('tap', function(e) {
                if (e.target === this.enterButton) {
                    self.trigger('switchScene', 'Scene_1');
                }
            });
        }
    });
    MenuScene.resources = {
        menuBg: new Texture('menuBg.png'),
        enterButton: new Texture('enterButton.png', 1, 2)
    };
    module.exports = MenuScene;
});