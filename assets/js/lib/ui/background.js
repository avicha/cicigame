/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Sprite = require('lib/sprite');
    var Vector2 = require('lib/shape/vector2');
    var Background = Sprite.extend({
        init: function(x, y, z, texture, config) {
            this.super(x, y, z);
            //背景图片
            this.setTexture(texture);
            //背景移动速度
            this.speed = (config && config.speed) || new Vector2(0, 0);
            //是否重复背景
            this.repeat = !!(config && config.repeat);
            //距离
            this.distance = (config && config.distance) || 1;
            this.stageWidth = (config && config.stageWidth) || this.texture.tileWidth;
            this.stageHeight = (config && config.stageHeight) || this.texture.tileHeight;
            //近大远小，造成视差
            if (this.distance != 1) {
                this.speed.divideSelf(this.distance);
            }
            //初始化temp背景
            if (this.repeat) {
                if (this.speed.x > 0) {
                    this.temp = new Background(-this.texture.width, 0, this.z, this.texture, {
                        speed: this.speed,
                        stageWidth: this.stageWidth,
                        stageHeight: this.stageHeight
                    });
                }
                if (this.speed.x < 0) {
                    this.temp = new Background(this.texture.width, 0, this.z, this.texture, {
                        speed: this.speed,
                        stageWidth: this.stageWidth,
                        stageHeight: this.stageHeight
                    });
                }
                if (this.speed.y > 0) {
                    this.temp = new Background(0, -this.texture.height, this.z, this.texture, {
                        speed: this.speed,
                        stageWidth: this.stageWidth,
                        stageHeight: this.stageHeight
                    });
                }
                if (this.speed.y < 0) {
                    this.temp = new Background(0, this.texture.height, this.z, this.texture, {
                        speed: this.speed,
                        stageWidth: this.stageWidth,
                        stageHeight: this.stageHeight
                    });
                }
            }
        },
        update: function(fps) {
            this.super(fps);
            if (this.repeat) {
                //更新位置，当一张图片移出屏幕时，马上从另一端补上
                this.temp.update(fps);
                if (this.speed.x > 0 && this.position.x > this.stageWidth) {
                    this.position.x = this.temp.position.x - this.texture.width;
                }
                if (this.speed.x < 0 && this.position.x < -this.texture.width) {
                    this.position.x = this.temp.position.x + this.temp.texture.width;
                }
                if (this.speed.y > 0 && this.position.y > this.stageHeight) {
                    this.position.y = this.temp.position.y - this.texture.height;
                }
                if (this.speed.y < 0 && this.position.y < -this.texture.height) {
                    this.position.y = this.temp.position.y + this.temp.texture.height;
                }
                if (this.temp.speed.x > 0 && this.temp.position.x > this.stageWidth) {
                    this.temp.position.x = this.position.x - this.temp.texture.width;
                }
                if (this.temp.speed.x < 0 && this.temp.position.x < -this.temp.texture.width) {
                    this.temp.position.x = this.position.x + this.texture.width;
                }
                if (this.temp.speed.y > 0 && this.temp.position.y > this.stageHeight) {
                    this.temp.position.y = this.position.y - this.temp.texture.height;
                }
                if (this.temp.speed.y < 0 && this.temp.position.y < -this.temp.texture.height) {
                    this.temp.position.y = this.position.y + this.texture.height;
                }
            }
        },
        draw: function(context) {
            this.texture.drawTile(context, this.position.x, this.position.y);
            if (this.repeat) {
                this.temp.draw(context);
            }
        }
    });
    module.exports = Background;
});