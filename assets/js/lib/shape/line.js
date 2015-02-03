/**
 * @author lbc
 */
YI.package('engine.shape').module('line').import('engine.shape.shape', 'engine.shape.vector2').define(function() {
    Line = YI.Line = YI.Shape.extend({
        start: new Vector2(0, 0),
        end: new Vector2(1, 0),
        k: 0,
        //类型线
        type: 'Line',
        init: function(point1, point2) {
            //起始点
            this.start = point1;
            //结束点
            this.end = point2;
            //斜率
            this.k = (point2.y - point1.y) / (point2.x - point1.x);
        },
        intersectsWith: function(shape) {
            //线跟点碰撞
            if (shape.type == 'Vector2') {


            }
            //线跟圆碰撞
            if (shape.type == 'Circle') {


            }
            //线跟线碰撞
            if (shape.type == 'Line') {


            }
            //线跟矩形碰撞
            if (shape.type == 'Rectangle') {


            }
            //线跟多边形碰撞
            if (shape.type == 'Polygon') {


            }
        },
        contains: function(shape) {
            //线包含点
            if (shape.type == 'Vector2') {


            }
            //线包含线
            if (shape.type == 'Line') {


            }
            return false;
        }
    });
});