/**
 * @author lbc
 */
YI.package('engine.shape').module('rectangle').import('engine.shape.shape').define(function() {
    //矩形类，用于范围检测等。
    Rect = YI.Rect = YI.Shape.extend({
        //上下左右边界和响应的宽高
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        type: 'Rectangle',
        init: function(left, top, width, height) {
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
            this.right = left + width;
            this.bottom = top + height;
            this.pivot = {
                x: left + width / 2,
                y: top + height / 2
            };
        },
        //重新调整矩形的大小
        resize: function() {
            this.width = this.right - this.left;
            this.height = this.bottom - this.top;
            this.pivot.set(this.left + this.width / 2, this.top + this.height / 2);
        },
        //设置图片的上下左右
        set: function(left, top, right, bottom) {

            this.left = left;
            this.top = top;
            this.right = right;
            this.bottom = bottom;
            this.resize();
        },
        //长方形增大v的大小
        inflate: function(v) {
            this.left -= v;
            this.top -= v;
            this.right += v;
            this.bottom += v;
            this.resize();

        },
        //返回相对于某一点的矩形
        relativeTo: function(point) {
            return new Rect(this.left + point.x, this.top + point.y, this.width, this.height);
        },
        //判断两个长方形是否相交
        intersectsWith: function(shape) {
            //矩形跟点碰撞
            if (shape.type == 'Vector2') {
                return shape.x >= this.left && shape.x <= this.right && shape.y >= this.top && shape.y <= this.bottom;
            }
            //矩形跟矩形碰撞
            if (shape.type == 'Rectangle') {
                return shape.right >= this.left && shape.left <= this.right && shape.top <= this.bottom && shape.bottom >= this.top;
            }
            //矩形跟圆碰撞
            if (shape.type == 'Circle') {


            }
            //矩形跟线碰撞
            if (shape.type == 'Line') {


            }
            //矩形跟多边形碰撞
            if (shape.type == 'Polygon') {
                return shape.intersectsWith(this);

            }
        },
        //判断矩形是否内含另一个矩形
        contains: function(shape) {
            //矩形包含点
            if (shape.type == 'Vector2') {
                return shape.x >= this.left && shape.x <= this.right && shape.y >= this.top && shape.y <= this.bottom;
            }

            //矩形包含矩形
            if (shape.type == 'Rectangle') {
                return this.left <= shape.left && this.right >= shape.right && this.top <= shape.top && this.bottom >= shape.bottom;
            }
            //矩形包含圆
            if (shape.type == 'Circle') {


            }
            //矩形包含线
            if (shape.type == 'Line') {


            }
            //矩形包含多边形
            if (shape.type == 'Polygon') {
                shape.vertexs.forEach(function(v) {
                    if (!this.contains(v)) {
                        return false;
                    }
                });
                return true;
            }
        },
        draw: function() {
            YI.context.fillStyle = '#00ff00';
            YI.context.fillRect(this.left, this.top, this.width, this.height);
        }
    });
});