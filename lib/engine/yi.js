/**
 * @author lbc
 */
//定义动画函数
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
            window.setTimeout(callback, element);
        };
    })();
}
//绑定函数的this作用域
//Function.prototype.bind = function (bind) {
//    var self = this;
//    return function () {
//        var args = Array.prototype.slice.call(arguments);
//        return self.apply(bind || null, args);
//    };
//};
$ = function(selector) {
    return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
};
$new = function(name) {
    return document.createElement(name);
};
//判断对象是否未赋值,注意这里判断时对象一定要先定义了，只是还没有赋值才能够使用该函数，
//如果没有定义调用该函数会报错，这时可以直接使用typeof(o)==='undefined'来判断。
//但不同的是如果对象o已经定义，但o没有p属性，这时if(o.p)不会出错，值为undefined
//isUndefined = function (o) {
//    if (typeof(o) === 'undefined') {
//        return true;
//    }
//    return false;
//}
//判断一个对象是不是函数对象
//isFunction = function (f) {
//    if (typeof f === 'function') return true;
//    return false;
//}
//浅复制
//extend = function (target, source, override) {
//    for (var x in source) {
//        if (isUndefined(override) || override) {
//            target[x] = source[x];
//        }
//    }
//    return target;
//};
_.extend(Object.prototype, {
    ////获取对象的键值
    //    keys:function () {
    //        var k = [];
    //        for (var x in this) {
    //            if (!isFunction(this[x]) && this.hasOwnProperty(x))
    //                k.push(x);
    //        }
    //        return k;
    //    },
    //    values:function () {
    //        var v = [];
    //        this.keys().forEach(function (k) {
    //            v.push(this[k]);
    //        }, this);
    //        return v;
    //    },
    //    forEach:function (f, context) {
    //        this.values().forEach(f, context || this);
    //    },
    //    //获取json对象的键值个数
    //    length:function () {
    //        return this.keys().length;
    //    },
    clone: function() {
        if (!this || this instanceof HTMLElement || this instanceof Function) {
            return this;
        }
        var objClone;
        if (this.constructor == Object) {
            objClone = {};
        } else {
            if (this instanceof Array) {
                objClone = [];
            } else {
                objClone = new this.constructor(this.valueOf());
            }
        }
        for (var key in this) {
            if (objClone[key] != this[key]) {
                if (this[key] && typeof(this[key]) === 'object') {
                    objClone[key] = this[key].clone();
                } else {
                    objClone[key] = this[key];
                }
            }
        }
        return objClone;
    }
});
loadScript = function(path) {
    var script = $new('script');
    script.src = path;
    $('head')[0].appendChild(script);
    script.onerror = function(err) {
        warn(err.message);
    };
};
//载入js文件
loadModule = function(module) {
    loadScript(config.packages_path + module.replace(/\./g, '/') + '.js');
};
//移除数组的对象o，注意，定义了Array的prototype属性，从此遍历数组时就会多一个remove属性，所以需要进行一个类型检测
Array.prototype.remove = function(o) {
    for (var i = this.length; i--;) {
        if (this[i] === o) {
            this.splice(i, 1);
        }
    }
    return this;
};
//调试
log = function(msg) {
    console.log(msg);
};
warn = function(msg) {
    console.warn(msg);
};
//定义包
Package = function(pac) {
    this.name = pac;
    this.path = config.packages_path + pac.replace(/\./g, '/') + '/';
    this.modules = {};
    return this;
};
//定义包的创建模块方块
Package.prototype = {
    module: function(m) {
        if (this.modules[m]) {
            return this.modules[m];
        } else {
            //初始化模块，未加载，属于哪个包，需要哪些模块，模块主体
            this.modules[m] = {
                isLoaded: false,
                owner: this.name,
                requires: [],
                body: null
            };
            //记录这个模块已经开始加载了，这样子不会重复加载模块
            YI.modules[this.name + '_' + m] = true;
            //处理每一个需要的模块
            this.modules[m].import = function() {
                var ms = arguments;
                for (var i = 0; i < ms.length; i++) {
                    var e = ms[i];
                    var index = e.lastIndexOf('.');
                    var p = e.substring(0, index);
                    var m = e.substring(index + 1);
                    //如果还没有记录则开始加载模块
                    if (_.isUndefined(YI.modules[p + '_' + m])) {
                        loadModule(e);
                        YI.modules[p + '_' + m] = true;
                    }
                    this.requires.push(e);
                }
                return this;
            };
            //当某个模块加载完成后，唤醒每个依赖的模块更新状态，
            this.modules[m].awake = function() {
                _.each(YI.packages, function(p) {
                    _.each(p.modules, function(m) {
                        m.check();
                    });
                });
                return this;
            };
            //定义模块主体
            this.modules[m].define = function(body) {
                this.body = body;
                this.check();
                return this;
            };
            //检查是否准备好了，准备好则运行模块主体，并通知其他模块我已经准备好了
            this.modules[m].check = function() {
                if (!this.isLoaded) {
                    var loaded = true;
                    for (var i = 0; i < this.requires.length; i++) {
                        var e = this.requires[i];
                        if (!YI.isModuleLoad(e)) {
                            loaded = false;
                        }
                    }
                    if (loaded) {
                        this.body();
                        this.isLoaded = true;
                        this.awake();
                    }
                }
                return this;
            };
            return this.modules[m];
        }
    }
};
window.YI = {
    //游戏资源
    resourceCache: {},
    //画布背景
    clearColor: '#ffffff',
    //游戏包管理
    packages: {},
    //模块管理
    modules: {},
    //画布
    canvas: null,
    //画布context
    context: null,
    //帧率
    fps: 60,
    //是否居中
    isCenter: false,
    //游戏画面的宽度
    width: 0,
    //游戏画面的高度
    height: 0,
    //画布的偏移x
    offsetX: 0,
    //画布的偏移y
    offsetY: 0,
    //屏幕大小
    screenSize: {
        width: window.screen.availWidth,
        height: window.screen.availHeight
    },
    //浏览器视图大小
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    //用户操作系统
    ua: '',
    //画面缩放大小
    scale: 1,
    //游戏是否在运行
    running: false,
    //游戏加载完准备好没有
    ready: false,
    //游戏当前场景
    curScene: null,
    //游戏时钟
    clock: null,
    //游戏加载进度条
    loader: null,
    //计算实际达到帧率
    frameCount: 0,
    init: function(width, height, center, scale, scene, loader) {
        //初始化画布和画布尺寸
        this.canvas = $('#canvas');
        this.context = this.canvas.getContext('2d');
        this.width = width;
        this.canvas.width = width;
        this.height = height;
        this.canvas.height = height;
        //画布缩放
        if (scale && scale != 1) {
            this.scale = scale;
            this.canvas.style.width = width * scale + "px";
            this.canvas.style.height = height * scale + "px";
        }
        //如果居中则居中画板
        if (center) {
            this.isCenter = true;
        }
        //进度条加载场景
        if (scene) {
            this.loader = loader || new Loader();
            this.loader.load(scene);
        }
        this.checkUA();
        Event.initEvent();
    },
    //指定一个包，没有则创建
    package: function(pac) {
        if (this.packages[pac]) {
            return this.packages[pac];
        } else {
            this.packages[pac] = new Package(pac);
            return this.packages[pac];
        }
    },
    //判断一个模块是否加载完成
    isModuleLoad: function(m) {
        var index = m.lastIndexOf('.');
        var p = m.substring(0, index);
        m = m.substring(index + 1);
        if (this.packages[p] && this.packages[p].modules[m] && this.packages[p].modules[m].isLoaded) {
            return true;
        }
        return false;
    },
    //场景跳转控制器
    jumpToScene: function(scene) {
        if (this.curScene) {
            this.curScene.release();
            this.curScene = null;
        }
        switch (scene) {
            case Scene.Menu:
                this.curScene = new Menu();
                break;
            case Scene.Main_1:
                this.curScene = new Main_1();
                break;
            default:
                this.curScene = new Menu();
                break;
        }
    },
    //运行游戏循环
    run: function() {
        if (this.running && this.curScene) {
            var t1 = Date.now();
            this.curScene.update();
            this.curScene.clear();
            this.curScene.draw();
            var t2 = Date.now();
            var dt = t2 - t1;
            window.requestAnimationFrame(this.run.bind(this), 1000 / YI.fps - dt);
            // setTimeout(this.run.bind(this), Math.max(0, 1000 / YI.fps - dt));
            this.frameCount++;
        }
    },
    //游戏开始
    start: function() {
        this.running = true;
        _.each(this.curScene.entities, function(e) {
            if (e.currentAnimation) {
                e.currentAnimation.resume();
            }
        });
        window.requestAnimationFrame(this.run.bind(this), 1000 / YI.fps);
        // setTimeout(this.run.bind(this), 1000 / YI.fps);
    },
    //场景暂停，暂停的同时记得把所有计时器都暂停，否则计时器暂停期间依然在计时。
    stop: function() {
        this.running = false;
        _.each(this.curScene.entities, function(e) {
            if (e.currentAnimation) {
                e.currentAnimation.stop();
            }
        });
    },
    //居中画布
    centerScreen: function() {
        window.scrollTo(0, 0);
        if (this.scale != 1) {
            this.canvas.style.width = this.width * this.scale + "px";
            this.canvas.style.height = this.height * this.scale + "px";
        }
        this.offsetX = Math.max(0, (this.viewport.width - window.parseFloat(this.canvas.style.width)) / 2);
        this.offsetY = Math.max(0, (this.viewport.height - window.parseFloat(this.canvas.style.height)) / 2);
        this.canvas.style.left = this.offsetX + "px";
        this.canvas.style.top = this.offsetY + "px";
    },
    //根据正则表达式判断用户操作系统
    checkUA: function() {
        if (/windows\snt/gi.test(navigator.userAgent) && !/mobile/g.test(navigator.userAgent)) {
            YI.ua = 'windows nt';
        }
        if (/windows\snt/gi.test(navigator.userAgent) && /mobile/g.test(navigator.userAgent)) {
            YI.ua = 'windows phone';
        }
        if (/iphone/gi.test(navigator.userAgent) && /mobile/g.test(navigator.userAgent)) {
            YI.ua = 'iphone';
        }
        if (/android/gi.test(navigator.userAgent) && /mobile/g.test(navigator.userAgent)) {
            YI.ua = 'android';
        }
    }
};
//定义游戏的类系统
YI.package('default').module('class').define(function() {
    YI.Class = function() {};
    YI.Class.extend = function(prop) {
        var parent = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            if (_.isFunction(prop[name]) && _.isFunction(parent[name])) {
                prototype[name] = (function(name, fn) {
                    return function() {
                        var temp = this.super || null;
                        this.super = parent[name];
                        var ret = fn.apply(this, arguments);
                        if (temp) {
                            this.super = temp;
                        }
                        return ret;
                    };
                })(name, prop[name]);
            } else {
                prototype[name] = prop[name];
            }
        }
        function c() {
            if (!initializing) {
                for (var p in this) {
                    if (this[p] && _.isObject(this[p])) {
                        this[p] = this[p].clone();
                    }
                }
                if (this.init) {
                    this.init.apply(this, arguments);
                }
            }
            return this;
        }
        c.prototype = prototype;
        c.prototype.constructor = c;
        c.extend = arguments.callee;
        return c;
    };
});
//加载所有需要的js文件，并加载完成后开始游戏
(function main() {
    logo = new Image();
    schedule = new Image();
    logo.onload = function() {
        schedule.onload = function() {
            YI.package('default').module('main').import('engine.loader', 'engine.scene', 'engine.event').define(function() {
                log('Main Loaded');
                YI.package('default').module('scene').import('game.scene.menu', 'game.scene.main_1').define(function() {
                    log('Scene Loaded');
                    YI.package('default').module('sprite').import('game.sprite.bone', 'game.sprite.carrot', 'game.sprite.dog', 'game.sprite.dog1', 'game.sprite.dog2', 'game.sprite.dog3', 'game.sprite.stick', 'game.sprite.stone', 'game.sprite.tool').define(function() {
                        log('Sprite Loaded');
                        YI.init(1280, 720, true, 1, YI.Scene.Menu, new YI.Loader());
                    });
                });
            });
        };
        schedule.src = './res/image/schedule.png';
    };
    logo.src = './res/image/logo.png';
})();