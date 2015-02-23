/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Class = require('lib/class');
    var Shape = Class.extend({
        type: 'Shape',
        //中心点
        pivot: null,
        //图形相对于某一点的相对图形
        relativeTo: function() {
            throw 'Must be override by the subclass or does not have this method ';
        },
        //求距离
        distanceTo: function(shape) {
            var dx = this.pivot.x - shape.pivot.x;
            var dy = this.pivot.y - shape.pivot.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        //和另一个图形是否相交
        intersectsWith: function() {
            throw 'Must be override by the subclass or does not have this method ';
        },
        //是否包含另一个图形
        contains: function() {

            throw 'Must be override by the subclass or does not have this method ';
        },
        //描绘图形
        draw: function() {
            throw 'Must be override by the subclass or does not have this method ';
        }
    });
    Shape.Angle = function(pa, po, pb) {
        var v1 = pa.sub(po);
        var v2 = pb.sub(po);
        return Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
    }
    module.exports = Shape;
});