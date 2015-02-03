/**
 * @author lbc
 */
YI.package('engine.ui').module('msg').import('engine.drawableobject').define(function() {
    Msg = YI.Msg = YI.DrawableObject.extend({
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
        init: function(x, y, z, text, config) {
            this.align = Msg.ALIGN.LEFT;
            this.valign = Msg.VALIGN.ALPHABETIC;
            this.super(x, y, z);
            this.text = text;
            _.extend(this, config);
            this.maxWidth = this.wordWidth * this.text.length;
        },
        setText: function(str) {
            this.text = str;
            this.maxWidth = this.wordWidth * this.text.length;
        },
        draw: function() {
            if (this.visiable) {
                YI.context.textAlign = this.align;
                YI.context.textBaseline = this.valign;
                YI.context.font = this.font;
                if (this.isStroke) {
                    YI.context.strokeStyle = this.strokeStyle;
                    YI.context.strokeText(this.text, this.x, this.y, this.maxWidth);
                } else {
                    YI.context.fillStyle = this.fillStyle;
                    YI.context.fillText(this.text, this.x, this.y, this.maxWidth);
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
});