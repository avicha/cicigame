//纹理类
define(function(require, exports, module) {
    var Class = require('lib/class');
    var Texture = Class.extend({
        //图片路径
        path: '',
        //纹理的图片对象
        image: null,
        //图片宽度
        width: 0,
        //图片高度
        height: 0,
        //图片行数
        rows: 1,
        //图片列数
        columns: 1,
        //图片格宽
        tileWidth: 0,
        //图片格高
        tileHeight: 0,
        //是否加载完成
        loaded: false,
        //初始化
        init: function(path, rows, columns) {
            this.path = Texture.IMGPATH + path;
            this.rows = rows || 1;
            this.columns = columns || 1;
            return this;
        },
        //加载图片
        load: function(callback) {
            var self = this;
            if (!this.loaded) {
                this.image = new Image();
                this.image.onload = function() {
                    self.onload.call(self, callback);
                };
                this.image.src = this.path + '?' + Date.now();
            } else {
                window.setTimeout(function() {
                    self.onload.call(self, callback);
                }, 0);
            }
            return this;
        },
        //重新加载图片
        reload: function() {
            this.loaded = false;
            this.image = new Image();
            this.image.onload = this.onload.bind(this);
            this.image.src = this.path + '?' + Date.now();
        },
        //加载完成回调函数
        onload: function(callback) {
            this.loaded = true;
            this.width = this.image.width;
            this.height = this.image.height;
            this.tileWidth = this.width / this.columns;
            this.tileHeight = this.height / this.rows;
            if (callback) {
                callback(null);
            }
        },
        //描绘图片到某个位置
        draw: function(g, targetX, targetY, sourceX, sourceY, width, height) {
            if (this.loaded) {
                width = Math.min(this.width - sourceX, width);
                height = Math.min(this.height - sourceY, height);
                g.drawImage(this.image, sourceX, sourceY, width, height, targetX, targetY, width, height);
            }
        },
        //描绘图片某个格点到某个位置
        drawTile: function(g, targetX, targetY, tile) {
            if (this.loaded) {
                tile = tile || 0;
                var sx = (tile % this.columns) * this.tileWidth;
                var sy = window.parseInt(tile / this.columns) * this.tileHeight;
                g.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, targetX, targetY, this.tileWidth, this.tileHeight);
            }
        }
    });
    Texture.IMGPATH = './assets/img/';
    module.exports = Texture;
});