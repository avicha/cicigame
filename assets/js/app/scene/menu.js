/**
 * @author lbc
 */
define(['lib/scene', 'lib/texture', 'lib/ui/background', 'lib/ui/button'], function(Scene, Texture, Background, Button) {
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
    MenuScene.getResources = function() {
        this.resources = {
            menuBg: new Texture('menuBg.png'),
            enterButton: new Texture('enterButton.png', 1, 2)
        };
        return this.resources;
    };
    return MenuScene;
});