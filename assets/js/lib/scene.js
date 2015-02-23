/**
 * @author lbc
 */
//场景类
define(function(require, exports, module) {
    var Class = require('lib/class');
    var Scene = Class.extend({
        //背景音乐
        bgSound: null,
        //需要加载的资源
        resources: {

        },
        //场景实体
        _entities: [],
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
    module.exports = Scene;
});
// YI.package('engine').module('scene').import('engine.sprite', 'engine.sound', 'engine.shape.all', 'engine.ui.all').define(function() {
//     Scene = YI.Scene = YI.Class.extend({
//         //背景音乐
//         bgSound: null,
//         //场景实体
//         entities: [],
//         //场景命名实体
//         namedEntities: {},
//         //场景显示范围
//         range: null,
//         //用于box2d物理游戏的世界
//         world: null,
//         //更新场景
//         update: function() {
//             if (this.world) {
//                 this.world.Step(1 / YI.fps, 10, 10);
//                 this.world.ClearForces();
//             }
//             //更新每一个物体
//             _.each(this.entities, function(e) {
//                 if (!e.killed && e.update) {
//                     e.update();
//                 }
//             });
//             //移除死亡的物体
//             _.each(this.entities, function(e) {
//                 if (e.killed) {
//                     this.removeGameObject(e);
//                 }
//             }, this);
//         },
//         //清除屏幕
//         clear: function() {
//             YI.context.fillStyle = YI.clearColor;
//             YI.context.clearRect(0, 0, YI.width, YI.height);
//         },
//         //描绘场景
//         draw: function() {
//             //根据z层次逐层描绘每个游戏实体
//             //            var currentZ = 0;
//             //            var n = 0;
//             //            while (n < this.sumEntities) {
//             //                this.entities.forEach(function (e) {
//             //                    if (e.z == currentZ) {
//             //                        e.draw();
//             //                        n++;
//             //                    }
//             //                });
//             //                currentZ++;
//             //            }
//             _.each(this.entities, function(e) {
//                 if (e.draw) {
//                     e.draw();
//                 }
//             });
//             //播放背景音乐
//             if (this.bgSound) {
//                 this.bgSound.play();
//             }
//         },
//         //释放场景
//         release: function() {
//             if (this.bgSound) {
//                 this.bgSound.stop();
//             }
//             _.each(this.entities, function(e) {
//                 e.kill();
//             });
//         },
//         sort: function() {
//             this.entities.sort(function(a, b) {
//                 return a.z - b.z;
//             });
//         },
//         //添加游戏实体
//         addGameObject: function(object) {
//             this.entities.push(object);
//             if (object.name && object.name != 'unknown') {
//                 this.namedEntities[object.name] = object;
//             }
//             this.sort();
//             return object;
//         },
//         //移除游戏实体
//         removeGameObject: function(object) {
//             if (object.name && object.name != 'unknown') {
//                 delete this.namedEntities[object.name];
//             }
//             this.entities.remove(object);
//             object = null;
//         },
//         //通过点击的点坐标获取游戏实体，得到的数组按z层次从上到下返回
//         getEntitiesByPoint: function(point) {
//             var r = [];
//             _.each(this.entities, function(e) {
//                 if (e.visiable && e.shape && e.shape.relativeTo(e.position).contains(point)) {
//                     r.push(e);
//                 }
//             });
//             r.sort(function(a, b) {
//                 return b.z - a.z;
//             });
//             return r;
//         },
//         //处理鼠标事件或者触摸事件
//         handleEvent: function() {
//             //            switch (Event.currentEvent) {
//             //                case Event.type.none:
//             //                    log('event :none');
//             //                    break;
//             //                case Event.type.touchStart:
//             //                    log('event :touchStart');
//             //                    break;
//             //                case Event.type.touchMove:
//             //                    log('event :touchMove');
//             //                    break;
//             //                case Event.type.tap:
//             //                    log('event :tap');
//             //                    break;
//             //                case Event.type.doubleTap:
//             //                    log('event :doubleTap');
//             //                    break;
//             //                case Event.type.longPress:
//             //                    log('event :longPress');
//             //                    break;
//             //                case Event.type.leftSwipe:
//             //                    log('event :leftSwipe');
//             //                    break;
//             //                case Event.type.rightSwipe:
//             //                    log('event :rightSwipe');
//             //                    break;
//             //                case Event.type.upSwipe:
//             //                    log('event :upSwipe');
//             //                    break;
//             //                case Event.type.downSwipe:
//             //                    log('event :downSwipe');
//             //                    break;
//             //                case Event.type.touchEnd:
//             //                    log('event :touchEnd');
//             //                    break;
//             //            }
//             Event.currentEvent = Event.type.none;
//         },
//         setWorld: function(world) {
//             this.world = world;
//         }
//     });
//     //场景编号常量
//     Scene.Menu = 1;
//     Scene.Intro = 2;
//     Scene.Main_1 = 3;
// });