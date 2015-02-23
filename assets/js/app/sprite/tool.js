/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
    var Tools = Sprite.extend({
        //道具数量，-1表示无限
        count: 0,
        cd: 0,
        type: 0
    });
    Tools.TYPE = {
        None: 0,
        Stone: 1,
        Bone: 2,
        Stick: 3
    };
    module.exports = Tools;
});