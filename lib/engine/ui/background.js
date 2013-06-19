/**
 * @author lbc
 */
YI.package('engine.ui').module('background').import('engine.sprite').define(function () {
    Background = YI.Background = YI.Sprite.extend({
        init:function (x, y, z, texture, config) {
            this.super(x, y, z);
//背景图片
            this.setTexture(texture);
//背景移动速度
            this.speed = (config && config.speed) || new Vector2(0, 0);
//是否重复背景
            this.repeat = !!(config && config.repeat);
//距离
            this.distance = (config && config.distance) || 1;
//近大远小，造成视差
            if (this.distance != 1) {
                this.speed.divideSelf(this.distance);
            }
//初始化temp背景
            if (this.repeat) {
                if (this.speed.x > 0) {
                    this.temp = new Background(-this.texture.width, 0, this.z, this.texture, {speed:this.speed});
                }
                if (this.speed.x < 0) {
                    this.temp = new Background(this.texture.width, 0, this.z, this.texture, {speed:this.speed});
                }
                if (this.speed.y > 0) {
                    this.temp = new Background(0, -this.texture.height, this.z, this.texture, {speed:this.speed});
                }
                if (this.speed.y < 0) {
                    this.temp = new Background(0, this.texture.height, this.z, this.texture, {speed:this.speed});
                }
            }

        },
        update:function () {
            this.super();
            if (this.repeat) {
//更新位置，当一张图片移出屏幕时，马上从另一端补上
                this.temp.update();
                if (this.speed.x > 0 && this.position.x > YI.width) {
                    this.position.x = this.temp.position.x - this.texture.width;
                }
                if (this.speed.x < 0 && this.position.x < -this.texture.width) {
                    this.position.x = this.temp.position.x + this.temp.texture.width;
                }
                if (this.speed.y > 0 && this.position.y > YI.height) {
                    this.position.y = this.temp.position.y - this.texture.height;
                }
                if (this.speed.y < 0 && this.position.y < -this.texture.height) {
                    this.position.y = this.temp.position.y + this.temp.texture.height;
                }
                if (this.temp.speed.x > 0 && this.temp.position.x > YI.width) {
                    this.temp.position.x = this.position.x - this.temp.texture.width;
                }
                if (this.temp.speed.x < 0 && this.temp.position.x < -this.temp.texture.width) {
                    this.temp.position.x = this.position.x + this.texture.width;
                }
                if (this.temp.speed.y > 0 && this.temp.position.y > YI.height) {
                    this.temp.position.y = this.position.y - this.temp.texture.height;
                }
                if (this.temp.speed.y < 0 && this.temp.position.y < -this.temp.texture.height) {
                    this.temp.position.y = this.position.y + this.texture.height;
                }
            }
        },
        draw:function () {
            this.texture.drawTile(this.position.x, this.position.y);
            if (this.repeat) {
                this.temp.draw();
            }
        }
    });
    Background.Textures = {
        menuBg:new Texture('menuBg.png'),
        bg1:new Texture('map01.png'),
        bg2:new Texture('map02.png'),
        fail:new Texture('fail.png'),
        success:new Texture('success.png')
    }
});
