/**
 * @author lbc
 */
define(function(require, exports, module) {
    var utils = require('lib/utils');
    var DrawableObject = require('lib/drawableobject');
    var Num = DrawableObject.extend({
        //数字值
        value: '',
        //数字显示的缓存
        content: null,
        //水平对齐方式
        align: 0,
        //垂直对齐方式
        valign: 0,
        //相比位置的偏移位置
        offsetX: 0,
        offsetY: 0,
        init: function(x, y, z, opts) {
            this._opts = opts;
            this.super(x, y, z, opts);
            var str = this.value;
            var arr = [];
            //计算出帧序列
            for (var i = 0, l = str.length; i < l; i++) {
                if (str[i] == '*') {
                    arr[i] = 10;
                } else {
                    arr[i] = window.parseInt(str[i]);
                }
            }
            //填充到缓冲区画板
            this.content = utils.$new('canvas');
            this.content.width = str.length * this.texture.tileWidth;
            this.content.height = this.texture.tileHeight;
            var ctx = this.content.getContext('2d');
            for (i = 0, l = str.length; i < l; i++) {
                this.texture.drawTile(ctx, i * this.texture.tileWidth, 0, arr[i]);
            }
            //根据对齐方式设置偏移
            if (this.align == Num.ALIGN.CENTER) {
                this.offsetX = this.content.width / 2;
            }
            if (this.align == Num.ALIGN.RIGHT) {
                this.offsetX = this.content.width;
            }
            if (this.valign == Num.VALIGN.MIDDLE) {
                this.offsetY = this.content.height / 2;
            }
            if (this.valign == Num.VALIGN.BOTTOM) {
                this.offsetY = this.content.height;
            }
        },
        //设置数字
        setNum: function(num) {
            this._opts.value = num;
            this.init(this.position.x, this.position.y, this.z, this._opts);
        },
        //描绘
        draw: function(context) {
            if (this.visiable) {
                context.drawImage(this.content, this.position.x - this.offsetX, this.position.y - this.offsetY);
            }
        }
    });
    Num.ALIGN = {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2
    };
    Num.VALIGN = {
        TOP: 0,
        MIDDLE: 1,
        BOTTOM: 2
    };
    module.exports = Num;
});