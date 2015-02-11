/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Class = require('lib/class');
    var Loader = Class.extend({
        loaded: 0,
        sum: 0,
        addResources: function(resources) {
            this._resources = resources;
            return this;
        },
        load: function() {
            var self = this;
            for (var key in this._resources) {
                self.sum++;
                resource = self._resources[key];
                resource.load(function(err) {
                    if (!err) {
                        self.loaded++;
                        self.trigger('progressUpdate', self.loaded, self.sum);
                        if (self.loaded === self.sum) {
                            self.trigger('progressComplete', self.loaded, self.sum);
                        }
                    } else {
                        self.trigger('progressError', resource, err);
                    }
                });
            }
        }
    });
    module.exports = Loader;
});
// YI.package('engine').module('loader').import('engine.texture', 'engine.sound').define(function() {
//     //载入条
//     Loader = YI.Loader = YI.Class.extend({
//         //已经加载的数目
//         loadedSize: 0,
//         //一共要加载的数目
//         sumSize: 0,
//         //加载状态
//         status: 0,
//         //加载完后要运行的场景
//         scene: 0,
//         //开始加载
//         load: function(scene) {
//             this.scene = scene;
//             var size = 0;
//             //开始加载每个资源
//             _.each(YI.resourceCache, function(e) {
//                 e.load();
//                 size++;
//             });
//             this.sumSize = size;
//         },
//         //每当资源加载完成时回调
//         update: function() {
//             this.loadedSize = 0;
//             _.each(YI.resourceCache, function(e) {
//                 if (e.loaded) {
//                     this.loadedSize++;
//                 }
//             }, this);
//             //console.log(this.loadedSize + ' ' + this.sumSize);
//             if (!this.sumSize) {
//                 this.status = 100;
//             } else {
//                 this.status = (this.loadedSize / this.sumSize * 100).toFixed(0);
//             }
//             YI.context.drawImage(logo, 0, 0);
//             YI.context.drawImage(schedule, 0, 0, schedule.width * this.status / 100, schedule.height, 490, 562, schedule.width * this.status / 100, schedule.height);
//             //如果加载完成则跳转到指定的场景，同时启动游戏循环
//             if (this.status == 100) {
//                 YI.ready = true;
//                 YI.jumpToScene(this.scene);
//                 YI.start();
//                 setInterval(function() {
//                     $('#msg').innerHTML = "FPS:" + YI.frameCount;
//                     YI.frameCount = 0;
//                 }, 1000);
//             }
//         }
//     });
// });