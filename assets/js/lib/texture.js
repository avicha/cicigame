//纹理类
define(['lib/class', 'lib/utils', 'lib/shape/rectangle'], function(Class, utils, Rect) {
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
            this.canvas = utils.$new('canvas');
            this.context = this.canvas.getContext('2d');
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
            this.canvas.width = this.width = this.image.width;
            this.canvas.height = this.height = this.image.height;
            this.context.drawImage(this.image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
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
                if (g.dirtyZone) {
                    var left = Math.max(targetX, g.dirtyZone.left);
                    var right = Math.min(targetX + width, g.dirtyZone.right);
                    var top = Math.max(targetY, g.dirtyZone.top);
                    var bottom = Math.min(targetY + height, g.dirtyZone.bottom);
                    var drawZone = new Rect(left, top, right - left, bottom - top);
                    if (drawZone.width > 0 && drawZone.height > 0) {
                        sourceX += drawZone.left - targetX;
                        sourceY += drawZone.top - targetY;
                        targetX = drawZone.left;
                        targetY = drawZone.top;
                        width = drawZone.width;
                        height = drawZone.height;
                        g.drawImage(this.canvas, sourceX, sourceY, width, height, targetX, targetY, width, height);
                    }
                } else {
                    g.drawImage(this.canvas, sourceX, sourceY, width, height, targetX, targetY, width, height);
                }
            }
        },
        //描绘图片某个格点到某个位置
        drawTile: function(g, targetX, targetY, tile) {
            tile = tile || 0;
            var sx = (tile % this.columns) * this.tileWidth;
            var sy = window.parseInt(tile / this.columns) * this.tileHeight;
            this.draw(g, targetX, targetY, sx, sy, this.tileWidth, this.tileHeight);
        }
    });
    Texture.IMGPATH = '';
    return Texture;
});