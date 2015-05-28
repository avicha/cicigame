/**
 * @author lbc
 */
//场景类
define(['lib/class'], function(Class) {
    var Scene = Class.extend({
        //背景音乐
        bgSound: null,
        //需要加载的资源
        resources: {

        },
        //场景实体
        _entities: [],
        dirtyZone: null,
        //场景命名实体
        _namedEntities: {},
        setStageSize: function(w, h) {
            this._stageWidth = w;
            this._stageHeight = h;
            return this;
        },
        getStageSize: function() {
            return {
                width: this._stageWidth,
                height: this._stageHeight
            };
        },
        getResources: function() {
            return this.resources;
        },
        //更新场景
        update: function(fps) {
            var self = this;
            //更新每一个物体
            this._entities.forEach(function(e) {
                if (!e.killed && e.update) {
                    e.update(fps);
                }
            });
            //移除死亡的物体
            this._entities.forEach(function(e) {
                if (e.killed) {
                    self.removeGameObject(e);
                }
            });
        },
        //描绘场景
        draw: function(context) {
            this._entities.forEach(function(e) {
                if (e.draw) {
                    //描绘之前，操作画布
                    if (e.alpha != 1) {
                        context.globalAlpha = e.alpha;
                    }
                    context.save();
                    if (e.angle) {
                        context.rotate(e.angle);
                    }
                    if (e.scale.x != 1 || e.scale.y != 1) {
                        context.scale(e.scale.x, e.scale.y);
                    }
                    e.draw(context);
                    //描绘之后恢复画布
                    context.restore();
                    if (e.alpha != 1) {
                        context.globalAlpha = 1;
                    }
                }
            });
            //播放背景音乐
            if (this.bgSound) {
                this.bgSound.play();
            }
        },
        //释放场景
        release: function() {
            if (this.bgSound) {
                this.bgSound.stop();
            }
            this._entities.forEach(function(e) {
                e.kill();
            });
        },
        sort: function() {
            this._entities.sort(function(a, b) {
                return a.z - b.z;
            });
        },
        //添加游戏实体
        addGameObject: function(object) {
            object.scene = this;
            this._entities.push(object);
            if (object.name && object.name != 'unknown') {
                this._namedEntities[object.name] = object;
            }
            this.sort();
            return object;
        },
        //移除游戏实体
        removeGameObject: function(object) {
            if (object.name && object.name != 'unknown') {
                delete this._namedEntities[object.name];
            }
            this._entities.remove(object);
            object = null;
        },
        getEntities: function() {
            return this._entities;
        }
    });
    return Scene;
});