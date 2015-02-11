define(function(require, exports, module) {
    var utils = require('lib/utils');
    var Class = function() {};
    Class.extend = function(prop) {
        var parent = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            if (utils.isFunction(prop[name]) && utils.isFunction(parent[name])) {
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
                    if (this[p] && utils.isObject(this[p])) {
                        this[p] = utils.clone(this[p]);
                    }
                }
                if (this.init) {
                    this.init.apply(this, arguments);
                }
            }
            return this;
        }
        c.prototype = prototype;
        c.prototype._events = {};
        c.prototype.on = function(evt, fn) {
            if (this._events[evt]) {
                this._events[evt].push(fn);
            } else {
                this._events[evt] = [fn];
            }
        };
        c.prototype.trigger = function(evt) {
            var self = this;
            var args = Array.prototype.slice.call(arguments);
            if (self._events[evt]) {
                self._events[evt].forEach(function(fn) {
                    fn.apply(self, args);
                });
            }
        };
        c.prototype.listenTo = function(target, evt, fn) {
            var self = this;
            target.on(evt, function() {
                fn.apply(self, arguments);
            });
        };
        c.prototype.constructor = c;
        c.extend = arguments.callee;
        return c;
    };
    module.exports = Class;
});