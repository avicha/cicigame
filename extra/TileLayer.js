/**
 * @author lbc
 */
YI.package('Extra').module('TileLayer').import('Engine.Texture', 'Engine.DrawableOnject').define(function () {

    TileLayer = YI.DrawableObject.extend({

        //地图类型，为背景地图层或者障碍物路径层
        type:'MapLayer' || 'PathLayer',
        //地图数组
        map:null,
        //地图图片
        texture:null,
        //地图行数
        rows:1,
        //地图列数
        columns:1,
        //地图格宽
        cellWidth:YI.width,
        //地图格高
        cellHeight:YI.height,
        //地图大小
        width:YI.width,

        height:YI.height,
        //地图裁剪位置
        fromX:0,

        fromY:0,
        //描绘到画板的位置
        toX:0,

        toY:0,
        //地图层次
        z:0,
        //地图描绘大小
        drawWidth:YI.width,

        drawHeight:YI.height,
        //地图缓存
        buffer:null,
        //是否预加载地图
        preload:false,
        //是否可以移动地图
        canMove:true,
        //初始化地图
        init:function (texture, rows, columns, drawWidth, drawHeight, settings) {

            //地图源图片
            this.texture = texture;

            //地图行列
            this.rows = rows;

            this.columns = columns;

            //单元大小
            this.cellWidth = this.texture.tileWidth;

            this.cellHeight = this.texture.tileHeight;

            //地图长宽大小
            this.width = this.columns * this.cellWidth;

            this.height = this.rows * this.cellHeight;

            //包括对地图描绘范围和地图类型的设置
            extend(this, settings);

            this.drawWidth = this.fromX + drawWidth <= this.width ? drawWidth : this.width - this.fromX;

            this.drawHeight = this.fromY + drawHeight <= this.height ? drawHeight : this.height - this.fromY;

            if (this.preload) {

                this.load();

            }
        },
        //设置地图数据
        setMap:function (map) {

            this.map = map;

        },
        //预加载地图
        load:function () {

            if (!this.map) {

                throw '你还没有为此地图指定数据！';
            } else {
                if (this.texture.loaded) {

                    this.buffer = $new('canvas');

                    this.buffer.width = this.width;

                    this.buffer.height = this.height;

                    var buffer2D = this.buffer.getContext('2d');

                    for (var i = 0; i < this.map.length; i++) {

                        for (var j = 0; j < this.map[i].length; j++) {

                            if (this.map[i][j] > 0) {

                                this.texture.drawTile(j * this.cellWidth, i * this.cellHeight, this.map[i][j] - 1, buffer2D);

                            }

                        }

                    }
                    this.preload = true;
                }
            }

        },
        //移动地图
        move:function (dx, dy) {
            this.fromX += dx;
            this.fromY += dy;
            this.canMove = true;
            var layerRange = new Rect(0, 0, this.width, this.height);
            var drawRange = new Rect(this.fromX, this.fromY, this.drawWidth, this.drawHeight);
            if (!layerRange.contains(drawRange)) {
                this.fromX -= dx;
                this.fromY -= dy;
                this.canMove = false;
            }
        },
        //描绘地图
        draw:function () {

            if (!this.preload) {

                this.load();
            }
            if (this.preload) {

                YI.context.drawImage(this.buffer, this.fromX, this.fromY, this.drawWidth, this.drawHeight, this.toX, this.toY, this.drawWidth, this.drawHeight);
            }
            //console.log(this.fromX + ' ' + this.fromY + ' ' + this.toX + ' ' + this.toY + ' ' + this.drawWidth + ' ' + this.drawHeight);
        },
        //根据在画板上的坐标获取行列位置
        getPosition:function (x, y) {

            var p = {
                row:0,
                column:0
            };
            p.column = parseInt((this.fromX + x - this.toX) / this.cellWidth);
            p.row = parseInt((this.fromY + y - this.toY) / this.cellHeight);
            return p;
        }
    });
});

