/**
 * @author lbc
 */
define(['lib/shape/shape', 'lib/shape/vector2'], function(Shape, Vector2) {
    var Circle = Shape.extend({
        center: new Vector2(0, 0),
        radius: 1,
        //类型圆形
        type: 'Circle',
        //初始化参数
        init: function(x, y, radius, arc1, arc2) {
            //圆心
            this.center = new Vector2(x, y);
            //半径
            this.radius = radius;
            //弧度开始
            if (_.isUndefined(arc1)) {
                this.arcBegin = 0;
            } else {
                this.arcBegin = arc1 % (2 * Math.PI);
            }
            //弧度结束
            if (_.isUndefined(arc2)) {
                this.arcEnd = 2 * Math.PI;
            } else {
                this.arcEnd = arc2 % (2 * Math.PI);
            }
            //图形中心是圆心
            this.pivot = this.center;
        },
        //相对于某一点的圆
        relativeTo: function(point) {
            return new Circle(this.center.x + point.x, this.center.y + point.y, this.radius, this.arcBegin, this.arcEnd);
        },
        intersectsWith: function(shape) {
            switch (shape.type) {
                //圆跟点碰撞，点到圆心距离小于半径
                case 'Vector2':
                    return this.distanceTo(shape) <= this.radius;
                    //圆跟圆碰撞，圆心距离少于两者半径之和
                case 'Circle':
                    return this.center.distanceTo(shape.center) <= this.radius + shape.radius;
                    //圆跟线碰撞
                case 'Line':
                    //圆跟矩形碰撞
                case 'Rectangle':
                    //圆跟多边形碰撞
                case 'Polygon':
            }
        },
        contains: function(shape) {
            switch (shape.type) {
                //圆包含点
                case 'Vector2':
                    return this.distanceTo(shape) <= this.radius;
                    //圆包含圆，圆心距离小于半径之差
                case 'Circle':
                    return this.center.distanceTo(shape.center) <= this.radius - shape.radius;
                    //圆包含线
                case 'Line':
                    //圆包含矩形
                case 'Rectangle':
                    //圆包含多边形
                case 'Polygon':
            }
        }
    });
    return Circle;
});