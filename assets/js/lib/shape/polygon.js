/**
 * @author lbc
 */
define(['lib/shape/shape'], function(Shape) {
    var Polygon = Shape.extend({
        //顶点集
        vertexs: [],
        //边集
        edges: [],
        //类型
        type: 'Polygon',
        //初始化顶点和边
        init: function(points) {
            var x = 0,
                y = 0;
            //点为一个二维数组
            for (var i = 0; i < points.length; i++) {
                var point1 = new Vector2(points[i][0], points[i][1]);
                x += point1.x;
                y += point1.y;
                var point2 = new Vector2(points[(i + 1) % points.length][0], points[(i + 1) % points.length][1]);
                //插入顶点数据
                this.vertexs.push(point1);
                //插入边数据
                this.edges.push(new Line(point1, point2));
            }
            //质心
            this.pivot = new Vector2(x / this.vertexs.length, y / this.vertexs.length);
        },
        //多边形相对于某一点的多边形
        relativeTo: function(point) {
            var points = [];
            this.vertexs.forEach(function(v) {
                points.push([v.x + point.x, v.y + point.y]);
            });
            return new Polygon(points);
        },
        intersectsWith: function(shape) {
            switch (shape.type) {
                //多边形跟点碰撞
                case 'Vector2':
                    var delta = 0;
                    for (var i = 0; i < this.vertexs.length; i++) {
                        var point1 = this.vertexs[i];
                        var point2 = this.vertexs[(i + 1) % this.vertexs.length];
                        delta += Shape.Angle(point1, shape, point2);
                    }
                    if (Math.abs(delta - 2 * Math.PI) < 0.01) {
                        return true;
                    }
                    return false;
                    //多边形跟矩形或者多边形碰撞
                case 'Rectangle':
                    return this.intersectsWith(new Polygon([
                        [shape.x, shape.y],
                        [shape.x + shape.width, shape.y],
                        [shape.x + shape.width, shape.y + shape.height],
                        [shape.x, shape.y + shape.height]
                    ]));
                case 'Polygon':
                    this.vertexs.forEach(function(v) {
                        if (shape.intersectsWith(v)) {
                            return true;
                        }
                    });
                    shape.vertexs.forEach(function(v) {
                        if (shape.intersectsWith(v)) {
                            return true;
                        }
                    });
                    return false;
                    //多边形跟圆碰撞
                case 'Circle':
                    //多边形跟线碰撞
                case 'Line':
            }
        },
        contains: function(shape) {
            switch (shape.type) {
                //多边形包含点
                case 'Vector2':
                    return this.intersectsWith(shape);
                    //多边形包含矩形
                case 'Rectangle':
                    return this.contains(new Polygon([
                        [shape.x, shape.y],
                        [shape.x + shape.width, shape.y],
                        [shape.x + shape.width, shape.y + shape.height],
                        [shape.x, shape.y + shape.height]
                    ]));
                    //多边形包含矩形或者多边形
                case 'Polygon':
                    shape.vertexs.forEach(function(v) {
                        if (!this.contains(v)) {
                            return false;
                        }
                    });
                    return true;
                    //多边形包含圆
                case 'Circle':
                    //多边形包含线
                case 'Line':
            }
        }
    });
    return Polygon;
});