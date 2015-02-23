define(function(require, exports, module) {
    var CiciGame = require('lib/yi');
    var MenuScene = require('app/scene/menu');
    var utils = require('lib/utils');
    var game = new CiciGame();
    game.setCanvas(utils.$('#canvas'));
    game.setStageSize(1280, 720);
    var loadingBg = new Image();
    loadingBg.onload = function() {
        var schedule = new Image();
        schedule.onload = function() {
            game.setLoadingStep(function(progress) {
                console.log(progress);
                var context = game.getContext();
                context.clearRect(0, 0, this.getStageSize().width, this.getStageSize().height);
                context.drawImage(loadingBg, 0, 0);
                context.drawImage(schedule, 0, 0, schedule.width * progress, schedule.height, 490, 562, schedule.width * progress, schedule.height);
            });
            game.launch(MenuScene);
        };
        schedule.src = './assets/img/schedule.png';
    };
    loadingBg.src = './assets/img/loadingBg.png';
    module.exports = game;
});