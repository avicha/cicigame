define(function(require, exports, module) {
    var utils = {
        $: function(selector) {
            return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
        },
        $new: function(name) {
            return document.createElement(name);
        },
        isObject: function(obj) {
            return obj === Object(obj);
        }
    };
    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function(name) {
        utils['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });
    Object.prototype.clone = function() {
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
                console.log(this.constructor, this.valueOf());
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
    module.exports = utils;
});