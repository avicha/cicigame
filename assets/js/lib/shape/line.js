/**
 * @author lbc
 */
define(['lib/shape/shape', 'lib/shape/vector2'], function(Shape, Vector2) {
    var Line = Shape.extend({
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
            switch (shape.type) {
                //线跟点碰撞
                case 'Vector2':
                    //线跟圆碰撞
                case 'Circle':
                    //线跟线碰撞
                case 'Line':
                    //线跟矩形碰撞
                case 'Rectangle':
                    //线跟多边形碰撞
                case 'Polygon':
            }
        },
        contains: function(shape) {
            switch (shape.type) {
                //线包含点
                case 'Vector2':
                    //线包含线
                case 'Line':
            }
            return false;
        }
    });
    return Line;
});