/**
 * @author lbc
 */
YI.package('engine.shape').module('vector2').import('engine.shape.shape').define(function () {
    Vector2 = YI.Vector2 = YI.Shape.extend({
        x:0,
        y:0,
        pivot:{x:0, y:0},
        type:'Vector2',
        init:function (x, y) {
            this.x = x || 0;
            this.y = y || 0;
            this.pivot.x = this.x;
            this.pivot.y = this.y;
        },
        set:function () {
            if (arguments[0] instanceof Vector2) {
                this.x = arguments[0].x;
                this.y = arguments[0].y;
            } else {
                if (arguments.length == 2) {
                    this.x = arguments[0];
                    this.y = arguments[1];
                }
            }
            return this;
        },
        relativeTo:function (point) {
            return this.add(point);
        },
        add:function () {
            if (arguments[0] instanceof Vector2) {
                return new Vector2(this.x + arguments[0].x, this.y + arguments[0].y);
            } else {
                if (arguments.length == 2) {
                    return new Vector2(this.x + arguments[0], this.y + arguments[1]);
                }
            }
            return this;
        },
        addSelf:function () {
            if (arguments[0] instanceof Vector2) {
                this.x += arguments[0].x;
                this.y += arguments[0].y;
            } else {
                if (arguments.length == 2) {
                    this.x += arguments[0];
                    this.y += arguments[1];
                }
            }
            return this;
        },
        sub:function () {
            if (arguments[0] instanceof Vector2) {
                return new Vector2(this.x - arguments[0].x, this.y - arguments[0].y);
            } else {
                if (arguments.length == 2) {
                    return new Vector2(this.x - arguments[0], this.y - arguments[1]);
                }
            }
            return this;
        },
        subSelf:function () {
            if (arguments[0] instanceof Vector2) {
                this.x -= arguments[0].x;
                this.y -= arguments[0].y;
            } else {
                if (arguments.length == 2) {
                    this.x -= arguments[0];
                    this.y -= arguments[1];
                }
            }
            return this;
        },
        //乘以一个倍数
        multiply:function (s) {
            return new Vector2(this.x * s, this.y * s);
        },
        multiplySelf:function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        },
        //除以一个倍数
        divide:function (s) {
            if (s) {
                return new Vector2(this.x / s, this.y / s);
            } else {
                return new Vector2(0, 0);
            }
            return this;
        },
        divideSelf:function (s) {
            if (s) {
                this.x /= s;
                this.y /= s;
            } else {
                this.set(0, 0);
            }
            return this;
        },
        //和另一个向量积
        dot:function (v) {
            return this.x * v.x + this.y * v.y;
        },
        //向量长度的平方
        lengthSq:function () {
            return this.x * this.x + this.y * this.y;
        },
        //向量长度
        length:function () {
            return Math.sqrt(this.lengthSq());
        },
        //向量标准化
        normalize:function () {
            return this.divideSelf(this.length());
        },
        //设置向量长度
        setLength:function (l) {
            return this.normalize().multiplySelf(l);
        },
        //判断两个向量是否相等
        equals:function (v) {
            return ((v.x === this.x ) && (v.y === this.y ) );
        },
        //距离的平方
        distanceToSquared:function (v) {
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        },
        distanceTo:function (v) {
            return Math.sqrt(this.distanceToSquared(v));
        },
        intersectsWith:function (shape) {
//点跟点碰撞
            if (shape.type == 'Vector2') {
                return this.equals(shape);
            }
            //除了点之外的图形跟点碰撞
            else {
                return shape.intersectsWith(this);
            }
        },
        contains:function (shape) {
            if (shape.type == 'Vector2') {
                return this.equals(shape);
            }
            return false;
        }
    });
});
