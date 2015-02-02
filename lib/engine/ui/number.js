/**
 * @author lbc
 */
YI.package('engine.ui').module('number').import('engine.drawableobject', 'engine.texture').define(function() {
    Num = YI.Num = YI.DrawableObject.extend({
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
        init: function(x, y, z, value, texture, configs) {
            this.super(x, y, z, configs);
            this.setTexture(texture);
            this.value = value;
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
            this.content = $new('canvas');
            this.content.width = str.length * this.texture.tileWidth;
            this.content.height = this.texture.tileHeight;
            var ctx = this.content.getContext('2d');
            for (i = 0, l = str.length; i < l; i++) {
                this.texture.drawTile(i * this.texture.tileWidth, 0, arr[i], ctx);
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
            this.init(this.position.x, this.position.y, this.z, num, this.texture);
        },
        //描绘
        draw: function() {
            if (this.visiable) {
                YI.context.drawImage(this.content, this.position.x - this.offsetX, this.position.y - this.offsetY);
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
    //用到的图片
    Num.Textures = {
        small: new Texture('numberSmall.png', 1, 11),
        normal: new Texture('numberNormal.png', 1, 11),
        big: new Texture('numberBig.png', 1, 11)
    };
});