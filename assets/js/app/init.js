define(function(require, exports, module) {
    var CiciGame = require('lib/yi');
    var MenuScene = require('app/scene/menu');
    var utils = require('lib/utils');
    var game = new CiciGame();
    game.setCanvas(utils.$('#canvas'));
    game.setStageSize(1280, 720);
    var menuScene = new MenuScene();
    menuScene.on('progressUpdate', function(progress) {
        console.log(progress);
    });
    game.launch(menuScene);
    module.exports = game;
});