/**
 * @author lbc
 */
define(['lib/class', 'lib/utils', 'lib/texture', 'lib/event', 'lib/loader', 'app/scene/index', 'lib/shape/vector2', 'lib/shape/rectangle'], function(Class, utils, Texture, Evt, Loader, scenes, Vector2, Rect) {
    //定义动画函数
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
                window.setTimeout(callback, element);
            };
        })();
    }
    var defaultOpts = {
        //画布背景
        clearColor: '#ffffff',
        //帧率
        fps: 60,
        //自动运行游戏
        autoRun: true,
        //舞台适配策略
        stageScaleMode: 'contain',
        autoOrientation: true,
        autoUpdate: true,
        debug: false
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
                    if (utils.device === 'mobile' && this._opts.autoOrientation && stageSizeRate > 1 && windowSize.width < windowSize.height) {
                        canvas.style.transform = canvas.style.webkitTransform = 'rotate(90deg)';
                        this.canvasRotate = true;
                        if (windowSizeRate < 1 / stageSizeRate) {
                            canvas.style.height = windowSize.width + 'px';
                            canvas.style.width = windowSize.width * stageSizeRate + 'px';
                            this.canvasScale = {
                                w: canvas.height / windowSize.width,
                                h: canvas.height / windowSize.width
                            };
                        } else {
                            canvas.style.width = windowSize.height + 'px';
                            canvas.style.height = windowSize.height / stageSizeRate + 'px';
                            this.canvasScale = {
                                w: canvas.width / windowSize.height,
                                h: canvas.width / windowSize.height
                            };
                        }
                    } else {
                        canvas.style.transform = canvas.style.webkitTransform = 'rotate(0deg)';
                        this.canvasRotate = false;
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
                    }
                    break;
                case 'cover':
                    if (utils.device === 'mobile' && this._opts.autoOrientation && stageSizeRate > 1) {
                        canvas.style.transform = canvas.style.webkitTransform = 'rotate(90deg)';
                        this.canvasRotate = true;
                        if (windowSizeRate < 1 / stageSizeRate) {
                            canvas.style.width = windowSize.height + 'px';
                            canvas.style.height = windowSize.height / stageSizeRate + 'px';
                            this.canvasScale = {
                                w: canvas.width / windowSize.height,
                                h: canvas.width / windowSize.height
                            };
                        } else {
                            canvas.style.height = windowSize.width + 'px';
                            canvas.style.width = windowSize.width * stageSizeRate + 'px';
                            this.canvasScale = {
                                w: canvas.height / windowSize.width,
                                h: canvas.height / windowSize.width
                            };
                        }
                    } else {
                        canvas.style.transform = canvas.style.webkitTransform = 'rotate(0deg)';
                        this.canvasRotate = false;
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
                    }
                    break;
                case 'fill':
                    if (utils.device === 'mobile' && this._opts.autoOrientation && stageSizeRate > 1) {
                        canvas.style.transform = canvas.style.webkitTransform = 'rotate(90deg)';
                        this.canvasRotate = true;
                        canvas.style.width = windowSize.height + 'px';
                        canvas.style.height = windowSize.width + 'px';
                        this.canvasScale = {
                            w: canvas.width / windowSize.height,
                            h: canvas.height / windowSize.width
                        };
                    } else {
                        canvas.style.transform = canvas.style.webkitTransform = 'rotate(0deg)';
                        this.canvasRotate = false;
                        canvas.style.width = windowSize.width + 'px';
                        canvas.style.height = windowSize.height + 'px';
                        this.canvasScale = {
                            w: canvas.width / windowSize.width,
                            h: canvas.height / windowSize.height
                        };
                    }

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
            canvas.style.position = 'fixed';
            canvas.style.left = '50%';
            canvas.style.top = '50%';
            canvas.style.marginTop = -window.parseInt(canvas.style.height) / 2 + 'px';
            canvas.style.marginLeft = -window.parseInt(canvas.style.width) / 2 + 'px';
        },
        setTexturePath: function(path) {
            Texture.IMGPATH = path;
            return this;
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
            game._canvasBuffer = utils.$new('canvas');
            game._canvasBuffer.width = canvas.width;
            game._canvasBuffer.height = canvas.height;
            game._contextBuffer = game._canvasBuffer.getContext('2d');
            if (scene) {
                game.load(scene);
            }
            var eventListener = new Evt(game.getCanvas());
            for (var type in Evt.type) {
                game.listenTo(eventListener, type, function(e) {
                    var x = e.x,
                        y = e.y;
                    var point = new Vector2();
                    if (!game.canvasRotate) {
                        if (utils.device === 'mobile') {
                            e.x = (x - canvas.offsetLeft) * game.canvasScale.w;
                            e.y = (y - canvas.offsetTop) * game.canvasScale.h;
                        } else {
                            e.x = x * game.canvasScale.w;
                            e.y = y * game.canvasScale.h;
                        }
                        point.set(e.x, e.y);
                    } else {
                        var canvasW = window.parseInt(canvas.style.width);
                        var canvasH = window.parseInt(canvas.style.height);
                        e.x = (y - (canvas.offsetTop * 2 + canvasH - canvasW) / 2) * game.canvasScale.w;
                        e.y = (canvas.offsetLeft - x + (canvasW + canvasH) / 2) * game.canvasScale.h;
                        point.set(e.x, e.y);
                    }
                    if (game._currentScene) {
                        var entities = game._currentScene.getEntities();
                        for (var l = entities.length; l; l--) {
                            var entity = entities[l - 1];
                            if (entity.visiable && entity.shape && entity.shape.relativeTo(entity.position).contains(point)) {
                                e.target = entity;
                                break;
                            }
                        }
                        game._currentScene.trigger(e.type, e);
                    }
                });
            }
            window.onresize = function() {
                game._setCanvasSize();
                game._setCanvasPosition();
            };
            window.addEventListener('orientationchange', function(e) {
                game._setCanvasSize();
                game._setCanvasPosition();
            }, false);
            if (game._opts.debug) {
                var info = utils.$new('div');
                info.style.width = 50;
                info.style.height = 50;
                info.style.position = 'absolute';
                info.style.background = '#000';
                info.style.color = '#fff';
                info.style.zIndex = 1000;
                utils.$('body')[0].appendChild(info);
                game.frameCount = 0;
                setInterval(function() {
                    info.innerHTML = 'FPS:' + game.frameCount;
                    game.frameCount = 0;
                }, 1000);
            }
            return game;
        },
        loadingStep: function(progress) {

        },
        setLoadingStep: function(fn) {
            if (utils.isFunction(fn)) {
                this.loadingStep = fn;
            }
            return this;
        },
        _loadScene: function(scene) {
            var game = this;
            game._currentScene = scene;
            game._currentScene.setStageSize(game.getStageSize().width, game.getStageSize().height);
            game._currentScene.on('switchScene', function(scene) {
                var newScene = scenes[scene];
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
        },
        //场景跳转控制器
        load: function(Scene) {
            var game = this;
            if (game._currentScene) {
                game._currentScene.release();
                game._currentScene = null;
            }
            this.loadingStep(0);
            var resources = Scene.getResources();
            if (Object.keys(resources).length) {
                var loader = new Loader();
                loader.addResources(resources);
                loader.on('progressUpdate', function(progress) {
                    game.loadingStep(progress);
                });
                loader.on('progressComplete', function() {
                    game._loadScene(new Scene());
                });
                loader.load();
            } else {
                game._loadScene(new Scene());
            }
            return this;
        },
        //运行游戏循环
        run: function() {
            // window.scrollTo(0, 0);
            if (this._running && this._currentScene) {
                var t1 = Date.now();
                this._currentScene.update(this._opts.fps);
                this._contextBuffer.fillStyle = this.clearColor;
                var dirtyZone = this._currentScene.dirtyZone;
                if (!this._currentScene.firstRender && dirtyZone) {
                    this._contextBuffer.clearRect(dirtyZone.left, dirtyZone.top, dirtyZone.width, dirtyZone.height);
                    this._currentScene.draw(this._contextBuffer);
                    this._context.drawImage(this._canvasBuffer, dirtyZone.left, dirtyZone.top, dirtyZone.width, dirtyZone.height, dirtyZone.left, dirtyZone.top, dirtyZone.width, dirtyZone.height);
                } else {
                    this._contextBuffer.clearRect(0, 0, this._stageWidth, this._stageHeight);
                    this._currentScene.draw(this._contextBuffer);
                    this._context.drawImage(this._canvasBuffer, 0, 0, this._canvas.width, this._canvas.height, 0, 0, this._canvas.width, this._canvas.height);
                }
                this._currentScene.dirtyZone = null;
                this._currentScene.firstRender = false;
                var t2 = Date.now();
                var dt = t2 - t1;
                window.requestAnimationFrame(this.run.bind(this), 1000 / this._opts.fps - dt);
                if (this._opts.debug) {
                    this.frameCount++;
                }
            } else {
                this._running = false;
            }
            return this;
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
            return this;
        },
        //场景暂停，暂停的同时记得把所有计时器都暂停，否则计时器暂停期间依然在计时。
        stop: function() {
            this._running = false;
            this._currentScene.getEntities().forEach(function(e) {
                if (e.currentAnimation) {
                    e.currentAnimation.stop();
                }
            });
            return this;
        }
    });
    return CiciGame;
});