/**
 * @author lbc
 */
YI.package('game.scene').module('menu').import('engine.scene').define(function () {
    Menu = YI.Scene.extend({

        init:function () {
            this.range = new Rect(0, 0, YI.width, YI.height);
            this.menuBg = this.addGameObject(new Background(0, 0, Layer.Background, Background.Textures.menuBg));
            this.enter = this.addGameObject(new Button(252, 153, Layer.Controllayer, Button.Textures.enterButton));
        },
        handleEvent:function () {

            var o = Event.getChooseObject();

            if (Event.currentEvent == Event.type.touchMove && o == this.enter) {
                this.enter.setCurrentAnim('mousein');
            }
            else {
                this.enter.setCurrentAnim('mouseout');
            }

            if (Event.currentEvent == Event.type.tap) {

                if (o == this.enter) {

                    YI.jumpToScene(YI.Scene.Main_1);
                }

            }
            this.super();
        }
    });
});