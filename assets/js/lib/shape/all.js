define(function(require, exports, module) {
    module.exports = {
        Circle: require('lib/shape/circle'),
        Line: require('lib/shape/line'),
        Polygon: require('lib/shape/polygon'),
        Rectangle: require('lib/shape/rectangle'),
        Vector2: require('lib/shape/vector2')
    };
});
// YI.package('engine.shape').module('all').import('engine.shape.circle', 'engine.shape.line', 'engine.shape.polygon', 'engine.shape.rectangle', 'engine.shape.vector2').define(function() {});