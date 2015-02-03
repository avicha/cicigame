/**
 * Created by JetBrains WebStorm.
 * User: lbc
 * Date: 12-4-2
 * Time: 下午10:47
 * To change this template use File | Settings | File Templates.
 */
YI.package('engine').module('drawableobject').import('engine.shape.all').define(function() {
    DrawableObject = YI.DrawableObject = YI.Class.extend({
        //是否可见
        visiable: true,
        //位置
        position: new Vector2(0, 0),
        //层次
        z: 0,
        //是否死亡，是则移除
        killed: false,
        //透明度
        alpha: 1,
        //旋转角度
        angle: 0,
        //缩放比例
        scale: new Vector2(1, 1),
        //碰撞形状
        shape: null,
        //使用图片
        texture: null,
        //初始化位置
        init: function(x, y, z, configs) {
            this.position.set(x, y);
            this.z = z;
            _.extend(this, configs);
            if (!this.shape && this.texture) {
                this.setShape(new Rect(0, 0, this.texture.tileWidth, this.texture.tileHeight));
            }
        },
        //设置纹理，默认设置形状为纹理矩形
        setTexture: function(texture) {
            this.texture = texture;
            if (!this.shape && this.texture) {
                this.setShape(new Rect(0, 0, this.texture.tileWidth, this.texture.tileHeight));
            }
        },
        //设置碰撞形状
        setShape: function(shape) {
            this.shape = shape;
        },
        //结束精灵生命周期
        kill: function() {
            this.killed = true;
        },

        //描绘之前，操作画布
        beforeDraw: function() {
            if (this.alpha != 1) {
                YI.context.globalAlpha = this.alpha;
            }
            YI.context.save();
            if (this.angle) {
                YI.context.rotate(this.angle);
            }
            if (this.scale.x != 1 || this.scale.y != 1) {
                YI.context.scale(this.scale.x, this.scale.y);
            }
        },
        //描绘之后恢复画布
        afterDraw: function() {
            YI.context.restore();
            if (this.alpha != 1) {
                YI.context.globalAlpha = 1;
            }
        }
    });
    //每个层
    Layer = {
        Background: 0,
        Foreground: 1,
        Pathlayer: 2,
        Spritelayer: 3,
        Effectlayer: 4,
        Dialoglayer: 5,
        Controllayer: 6
    };
});