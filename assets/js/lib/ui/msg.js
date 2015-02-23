/**
 * @author lbc
 */
define(function(require, exports, module) {
    var utils = require('lib/utils');
    var DrawableObject = require('lib/drawableobject');
    var Msg = DrawableObject.extend({
        //文字内容
        text: '',
        //文字对齐方向
        align: null,
        valign: null,
        //每个文字占据宽度
        wordWidth: 50,
        //最大宽度
        maxWidth: 0,
        //是否空心填充，默认实心填充
        isStroke: false,
        //填充样式
        fillStyle: '#000000',
        //空心样式
        strokeStyle: '#000000',
        //字体
        font: '30px Arial',
        init: function(x, y, z, text, opts) {
            this.align = Msg.ALIGN.LEFT;
            this.valign = Msg.VALIGN.ALPHABETIC;
            this.super(x, y, z);
            this.text = text;
            if (opts && utils.isObject(opts)) {
                for (var key in opts) {
                    this[key] = opts[key];
                }
            }
            this.maxWidth = this.wordWidth * this.text.length;
        },
        setText: function(str) {
            this.text = str;
            this.maxWidth = this.wordWidth * this.text.length;
            return this;
        },
        draw: function(context) {
            if (this.visiable) {
                context.textAlign = this.align;
                context.textBaseline = this.valign;
                context.font = this.font;
                if (this.isStroke) {
                    context.strokeStyle = this.strokeStyle;
                    context.strokeText(this.text, this.x, this.y, this.maxWidth);
                } else {
                    context.fillStyle = this.fillStyle;
                    context.fillText(this.text, this.x, this.y, this.maxWidth);
                }
            }
        }
    });
    //对齐方式常量
    YI.Msg.ALIGN = {
        LEFT: 'left',
        CENTER: 'center',
        RIGHT: 'right'
    };
    YI.Msg.VALIGN = {
        ALPHABETIC: 'alphabetic', //按字母基线对齐，默认
        BOTTOM: 'bottom',
        TOP: 'top',
        MIDDLE: 'middle'
    };
    module.exports = Msg;
});