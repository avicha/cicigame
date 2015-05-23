define(function() {
    var utils = {
        $: function(selector) {
            return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
        },
        $new: function(name) {
            return document.createElement(name);
        },
        isObject: function(obj) {
            return obj === Object(obj);
        },
        isFunction: function(fn) {
            return 'function' === typeof fn;
        }
    };
    ['Arguments', 'String', 'Number', 'Date', 'RegExp'].forEach(function(name) {
        utils['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });
    utils.clone = function(obj) {
        if (!obj || obj instanceof HTMLElement || obj instanceof Function) {
            return obj;
        }
        var objClone;
        if (obj.constructor == Object) {
            objClone = {};
        } else {
            if (obj instanceof Array) {
                objClone = [];
            } else {
                objClone = new obj.constructor(obj.valueOf());
            }
        }
        for (var key in obj) {
            if (objClone[key] != obj[key]) {
                if (obj[key] && typeof(obj[key]) === 'object') {
                    objClone[key] = utils.clone(obj[key]);
                } else {
                    objClone[key] = obj[key];
                }
            }
        }
        return objClone;
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
    Function.prototype.bind = function(bind) {
        var self = this;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return self.apply(bind || null, args);
        };
    };
    return utils;
});