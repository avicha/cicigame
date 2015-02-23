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
            this._opts = utils.clone(defaultOpts);
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
        getContext: function() {
            return this._context;
        },
        setStageSize: function(w, h) {
            if (w && h) {
                this._stageWidth = w;
                this._stageHeight = h;
            }
            return this;
        },
        getStageSize: function() {
            return {
                width: this._stageWidth,
                height: this._stageHeight
            };
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
                        canvas.style.height = windowSize.height + 'px';
                        canvas.style.width = windowSize.height * stageSizeRate + 'px';
                        this.canvasScale = {
                            w: canvas.height / windowSize.height,
                            h: canvas.height / windowSize.height
                        };
                    } else {
                        canvas.style.width = windowSize.width + 'px';
                        canvas.style.height = windowSize.width / stageSizeRate + 'px';
                        this.canvasScale = {
                            w: canvas.width / windowSize.width,
                            h: canvas.width / windowSize.width
                        };
                    }

                    break;
                case 'cover':
                    if (windowSizeRate > stageSizeRate) {
                        canvas.style.width = windowSize.width + 'px';
                        canvas.style.height = windowSize.width / stageSizeRate + 'px';
                        this.canvasScale = {
                            w: canvas.width / windowSize.width,
                            h: canvas.width / windowSize.width
                        };
                    } else {
                        canvas.style.height = windowSize.height + 'px';
                        canvas.style.width = windowSize.height * stageSizeRate + 'px';
                        this.canvasScale = {
                            w: canvas.height / windowSize.height,
                            h: canvas.height / windowSize.height
                        };
                    }
                    break;
                case 'fill':
                    canvas.style.width = windowSize.width + 'px';
                    canvas.style.height = windowSize.height + 'px';
                    this.canvasScale = {
                        w: canvas.width / windowSize.width,
                        h: canvas.height / windowSize.height
                    };
                    break;
                case 'noscale':
                    this.canvasScale = {
                        w: 1,
                        h: 1
                    };
                    break;
                default:
                    break;
            }

        },
        _setCanvasPosition: function() {
            var canvas = this.getCanvas();
            utils.$('body')[0].style.margin = 0;
            canvas.style.position = 'absolute';
            canvas.style.left = '50%';
            canvas.style.top = '50%';
            canvas.style.marginTop = -window.parseInt(canvas.style.height) / 2 + 'px';
            canvas.style.marginLeft = -window.parseInt(canvas.style.width) / 2 + 'px';
        },
        launch: function(scene) {
            var game = this;
            var Evt = require('lib/event');
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
            }
            var eventListener = new Evt(game.getCanvas());
            for (var type in Evt.type) {
                game.listenTo(eventListener, type, function(e) {
                    var point = e.mouses[e.mouses.length - 1];
                    point.set(point.x * game.canvasScale.w, point.y * game.canvasScale.h);
                    if (game._currentScene) {
                        var r = [];
                        game._currentScene.getEntities().forEach(function(entity) {
                            if (entity.visiable && entity.shape && entity.shape.relativeTo(entity.position).contains(point)) {
                                r.push(entity);
                            }
                        });
                        r.sort(function(a, b) {
                            return b.z - a.z;
                        });
                        e.target = r[0];
                        game._currentScene.trigger(e.currentEvent, e);
                    }
                });
            }
            return game;
        },
        loadingStep: function(progress) {

        },
        setLoadingStep: function(fn) {
            if (utils.isFunction(fn)) {
                this.loadingStep = fn;
            }
        },
        //场景跳转控制器
        load: function(Scene) {
            var game = this;
            if (game._currentScene) {
                game._currentScene.release();
                game._currentScene = null;
            }
            this.loadingStep(0);
            if (Scene.resources) {
                var loader = new(require('lib/loader'))();
                loader.addResources(Scene.resources);
                loader.on('progressUpdate', function(progress) {
                    game.loadingStep(progress);
                });
                loader.on('progressComplete', function() {
                    game._currentScene = new Scene();
                    game._currentScene.setStageSize(game.getStageSize().width, game.getStageSize().height);
                    game._currentScene.on('switchScene', function(scene) {
                        var newScene = require('app/scene/index')[scene];
                        if (newScene) {
                            game.load(newScene);
                        }
                    });
                    game._currentScene.on('stopScene', function() {
                        game.stop();
                    });
                    game._currentScene.on('startScene', function() {
                        game.start();
                    });
                    if (game._opts.autoRun) {
                        game.start();
                    }
                });
                loader.load();
            } else {
                game._currentScene = new Scene();
                game._currentScene.setStageSize(game.getStageSize().width, game.getStageSize().height);
                game._currentScene.on('switchScene', function(scene) {
                    game.load(scene);
                });
                if (game._opts.autoRun) {
                    game.start();
                }
            }
        },
        //运行游戏循环
        run: function() {
            if (this._running && this._currentScene) {
                var t1 = Date.now();
                this._currentScene.update(this._opts.fps);
                this._context.fillStyle = this.clearColor;
                this._context.clearRect(0, 0, this._stageWidth, this._stageHeight);
                this._currentScene.draw(this._context);
                var t2 = Date.now();
                var dt = t2 - t1;
                window.requestAnimationFrame(this.run.bind(this), 1000 / this._opts.fps - dt);
                this.frameCount++;
            } else {
                this._running = false;
            }
        },
        //游戏开始
        start: function() {
            if (!this._running) {
                this._running = true;
                this._currentScene.getEntities().forEach(function(e) {
                    if (e.currentAnimation) {
                        e.currentAnimation.resume();
                    }
                });
                window.requestAnimationFrame(this.run.bind(this), 1000 / this._opts.fps);
            }
        },
        //场景暂停，暂停的同时记得把所有计时器都暂停，否则计时器暂停期间依然在计时。
        stop: function() {
            this._running = false;
            this._currentScene.getEntities().forEach(function(e) {
                if (e.currentAnimation) {
                    e.currentAnimation.stop();
                }
            });
        }
    });
    module.exports = CiciGame;
});