/**
 * Created by JetBrains WebStorm.
 * User: lbc
 * Date: 12-4-2
 * Time: 下午10:47
 * To change this template use File | Settings | File Templates.
 */
define(['lib/utils', 'lib/class', 'lib/shape/vector2', 'lib/shape/rectangle'], function(utils, Class, Vector2, Rect) {
    var DrawableObject = Class.extend({
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
        init: function(x, y, z, opts) {
            this.position.set(x, y);
            this.z = z;
            if (opts && utils.isObject(opts)) {
                for (var key in opts) {
                    this[key] = opts[key];
                }
            }
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
            return this;
        },
        //设置碰撞形状
        setShape: function(shape) {
            this.shape = shape;
            return this;
        },
        //结束精灵生命周期
        kill: function() {
            this.killed = true;
            return this;
        }
    });
    return DrawableObject;
});