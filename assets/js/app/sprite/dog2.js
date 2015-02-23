/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Dog = require('app/sprite/dog');
    var Vector2 = require('lib/shape/vector2');
    var Dog2 = Dog.extend({
        speed: new Vector2(-120, 0),
        score: 35,
        bear: 3
    });
    module.exports = Dog2;
});