/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Dog = require('app/sprite/dog');
    var Vector2 = require('lib/shape/vector2');
    var Dog1 = Dog.extend({
        speed: new Vector2(-120, 0),
        score: 20,
        bear: 2
    });
    module.exports = Dog1;
});