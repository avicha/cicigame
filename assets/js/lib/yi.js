/**
 * @author lbc
 */
define(function(require, exports, module) {
    //定义动画函数
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
                window.setTimeout(callback, element);
            };
        })();
    }
    var Class = require('lib/class');
    var utils = require('lib/utils');
    var defaultOpts = {
        //画布背景
        clearColor: '#ffffff',
        //帧率
        fps: 60,
        autoRun: true,
        stageScaleMode: 'contain'
    };
    var CiciGame = Class.extend({
        _running: false,
        init: function(opts) {
            this._opts = defaultOpts.clone();
            if (utils.isObject(opts)) {
                for (var key in opts) {
                    this._opts[key] = opts[key];
                }
            }
            return this;
        },
        config: function(opts) {
            if (utils.isObject(opts)) {
                for (var key in opts) {
                    this._opts[key] = opts[key];
                }
            }
            return this;
        },
        setCanvas: function(canvas) {
            if (canvas && canvas instanceof HTMLElement) {
                this._canvas = canvas;
            }
            return this;
        },
        getCanvas: function() {
            return this._canvas;
        },
        setStageSize: function(w, h) {
            if (w && h) {
                this._stageWidth = w;
                this._stageHeight = h;
            }
            return this;
        },
        getWindowSize: function() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        _setCanvasSize: function() {
            var canvas = this.getCanvas();
            var windowSize = this.getWindowSize();
            var windowSizeRate = windowSize.width / windowSize.height;
            var stageSizeRate = this._stageWidth / this._stageHeight;
            switch (this._opts.stageScaleMode) {
                case 'contain':
                    if (windowSizeRate > stageSizeRate) {
                        canvas.style.height = windowSize.height;
                        canvas.style.width = windowSize.height * stageSizeRate;
                    }
                    break;
                case 'cover':
                    break;
                case 'fill':
                    canvas.style.width = windowSize.width;
                    canvas.style.height = windowSize.height;
                    break;
                case 'noscale':
                    break;
                default:
                    break;
            }
        },
        _setCanvasPosition: function() {

        },
        launch: function(scene) {
            var game = this;
            if (!game.getCanvas()) {
                throw new Error("请设置游戏画板");
            }
            if (!game._stageWidth || !game._stageHeight) {
                throw new Error("请设置游戏画板大小");
            }
            var canvas = game.getCanvas();
            canvas.width = game._stageWidth;
            canvas.height = game._stageHeight;
            game._context = canvas.getContext('2d');
            game._setCanvasSize();
            game._setCanvasPosition();
            if (scene) {
                game.load(scene);
                if (scene.resources) {
                    var loader = new require('lib/loader')();
                    loader.addResources(scene.resources);
                    loader.load();
                    scene.listenTo(loader, 'progressUpdate', function(progress) {
                        scene.trigger('progressUpdate', progress);
                    });
                    scene.listenTo(loader, 'progressComplete', function() {
                        if (game._opts.autoRun) {
                            game.start();
                        }
                        scene.trigger('progressComplete');
                    });
                } else {
                    if (game._opts.autoRun) {
                        game.start();
                    }
                    scene.trigger('progressComplete');
                }
            }
            return game;
        },
        //场景跳转控制器
        load: function(scene) {
            if (this._currentScene) {
                this._currentScene.release();
                this._currentScene = null;
            }
            this._currentScene = scene;
        },
        //运行游戏循环
        run: function() {
            if (this._running && this._currentScene) {
                var t1 = Date.now();
                this._currentScene.update();
                this._currentScene.clear();
                this._currentScene.draw();
                var t2 = Date.now();
                var dt = t2 - t1;
                window.requestAnimationFrame(this.run.bind(this), 1000 / this._opts.fps - dt);
                this.frameCount++;
            }
        },
        //游戏开始
        start: function() {
            this._running = true;
            this._currentScene.getEntities().forEach(function(e) {
                if (e.currentAnimation) {
                    e.currentAnimation.resume();
                }
            });
            window.requestAnimationFrame(this.run.bind(this), 1000 / this._opts.fps);
        },
        //场景暂停，暂停的同时记得把所有计时器都暂停，否则计时器暂停期间依然在计时。
        stop: function() {
            this._running = false;
            this.curScene.getEntities.forEach(function(e) {
                if (e.currentAnimation) {
                    e.currentAnimation.stop();
                }
            });
        }
    });
    module.exports = CiciGame;
});