/**
 * @author lbc
 */
define(['lib/class', 'lib/shape/vector2', 'lib/utils'], function(Class, Vector2, utils) {
    var defaultConfig = {
        longTapDelay: 750,
        swipeRightAngle: 30,
        swipeLeftAngle: 30,
        swipeDownAngle: 30,
        swipeUpAngle: 30,
        swipeMinX: 30,
        swipeMinY: 30,
        tapMaxX: 10,
        tapMaxY: 10,
        preventScrollRight: true,
        preventScrollLeft: true,
        preventScrollUp: false,
        preventScrollDown: false,
        moveDetect: false
    };
    var getMoveDirection = function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
    };
    var getSwipeDirection = function(dx, dy, angle) {
        if (dx > 0 && Math.abs(angle) < defaultConfig.swipeRightAngle) {
            return 'Right';
        }
        if (dx < 0 && Math.abs(angle) < defaultConfig.swipeLeftAngle) {
            return 'Left';
        }
        if (dy > 0 && Math.abs(angle) > (90 - defaultConfig.swipeDownAngle)) {
            return 'Down';
        }
        if (dy < 0 && Math.abs(angle) > (90 - defaultConfig.swipeUpAngle)) {
            return 'Up';
        }
    };
    var getAngle = function(n) {
        return Math.atan(n) * 180 / Math.PI;
    };
    var cancelLongTap = function() {
        if (_longTapTimeout) {
            clearTimeout(_longTapTimeout);
            _longTapTimeout = null;
        }
    };
    var setPointInfo = function(info) {
        info.x2 = info.x;
        info.y2 = info.y;
        info.dx = info.x2 - info.x1;
        info.dy = info.y2 - info.y1;
        info.angle = getAngle(info.dy / info.dx);
        info.direction = getSwipeDirection(info.dx, info.dy, info.angle);
        info.moveDirection = getMoveDirection(info._lastX, info._lastY, info.x2, info.y2);
        info._distanceX += Math.abs(info.x2 - info._lastX);
        info._distanceY += Math.abs(info.y2 - info._lastY);
        info._lastX = info.x2;
        info._lastY = info.y2;
    };
    var Evt = Class.extend({
        info: {},
        init: function(dom) {
            var self = this;
            this.startMouse = this.endMouse = null;
            this.type = Evt.type.none;
            if (/mobile/i.test(window.navigator.userAgent)) {
                dom.addEventListener('touchstart', function(e) {
                    self.onTouchStart.apply(self, arguments);
                }, false);
                dom.addEventListener('touchmove', function(e) {
                    self.onTouchMove.apply(self, arguments);
                }, false);
                dom.addEventListener('touchend', function(e) {
                    self.onTouchEnd.apply(self, arguments);
                }, false);
                dom.addEventListener('touchcancel', function(e) {
                    self.onTouchEnd.apply(self, arguments);
                }, false);
                window.addEventListener('orientationchange', function(e) {
                    self.onOrientationChange.apply(self, arguments);
                }, false);
            } else {
                dom.addEventListener('mousedown',
                    function(e) {
                        self.onMouseDown.apply(self, arguments);
                    }, false);
                //鼠标移动事件
                dom.addEventListener('mousemove',
                    function(e) {
                        self.onMouseMove.apply(self, arguments);
                    }, false);
                //鼠标松开事件
                dom.addEventListener('mouseup',
                    function(e) {
                        self.onMouseUp.apply(self, arguments);
                    }, false);
                //取消右键默认事件
                dom.addEventListener('contextmenu', function(e) {
                    e.returnValue = false;
                }, false);
                //单击事件
                dom.onclick = function(e) {
                    self.onClick.apply(self, arguments);
                };
                //双击事件
                dom.ondblclick = function(e) {
                    self.onDoubleClick.apply(self, arguments);
                };
            }
        },
        cancelLongTap: function() {
            if (this._longTapTimeout) {
                clearTimeout(this._longTapTimeout);
                this._longTapTimeout = null;
            }
        },
        longTap: function() {
            this.cancelLongTap();
            this._triggerEvent.call(this, Evt.type.longPress);
            this.info = {};
        },
        _triggerEvent: function(evt) {
            this.info.type = evt;
            this.trigger(evt, utils.clone(this.info));
        },
        onTouchStart: function(e) {
            var self = this;
            if (e.touches && e.touches.length === 1 && this.info.x2) {
                this.info.x2 = undefined;
                this.info.y2 = undefined;
                this.info._lastX = undefined;
                this.info._lastY = undefined;
            }
            var now = Date.now();
            var delta = now - (this.info._last || now);
            var point = e.touches[0];
            this.info.x1 = this.info.x = this.info._lastX = point.clientX;
            this.info.y1 = this.info.y = this.info._lastY = point.clientY;
            if (delta > 0 && delta <= 250) {
                this.info.isDoubleTap = true;
            }
            this.info._last = now;
            this.info._distanceX = this.info._distanceY = 0;
            this._longTapTimeout = setTimeout(function() {
                self.longTap.apply(self, arguments);
            }, defaultConfig.longTapDelay);
            this._triggerEvent.call(this, Evt.type.touchStart);
        },
        onTouchMove: function(e) {
            this.cancelLongTap();
            var point = e.touches[0];
            this.info.x = point.clientX;
            this.info.y = point.clientY;
            if (e.touches.length > 1) {
                this.info.mutiTouch = true;
            } else {
                this.info.mutiTouch = false;
            }
            setPointInfo(this.info);
            if (defaultConfig.moveDetect) {
                this._triggerEvent.call(this, Evt.type.move);
                this._triggerEvent.call(this, Evt.type['move' + this.info.moveDirection]);
            }
            if (defaultConfig['preventScroll' + this.info.direction]) {
                e.preventDefault();
            }
            this._triggerEvent.call(this, Evt.type.touchMove);
        },
        onTouchEnd: function(e) {
            var self = this;
            this.cancelLongTap();
            if (e.changedTouches && e.changedTouches.length) {
                var point = e.changedTouches[0];
                this.info.x = point.clientX;
                this.info.y = point.clientY;
                setPointInfo(this.info);
            }
            this._triggerEvent.call(this, Evt.type.touchEnd);
            if (((this.info.direction === 'Left' || this.info.direction === 'Right') && Math.abs(this.info.dx) > defaultConfig.swipeMinX) || ((this.info.direction === 'Up' || this.info.direction === 'Down') && Math.abs(this.info.dy) > defaultConfig.swipeMinY)) {
                this._swipeTimeout = setTimeout(function() {
                    self._triggerEvent.call(self, Evt.type.swipe);
                    self._triggerEvent.call(self, Evt.type['swipe' + self.info.direction]);
                    self.info = {};
                }, 0);
            } else {
                if (this.info._distanceX < defaultConfig.tapMaxX && this.info._distanceY < defaultConfig.tapMaxY) {
                    this._tapTimeout = setTimeout(function() {
                        self._triggerEvent.call(self, Evt.type.tap);
                        if (self.info.isDoubleTap) {
                            self._triggerEvent.call(self, Evt.type.doubleTap);
                            this.info = {};
                        }
                    }, 0);
                } else {
                    this.info = {};
                }
            }
        },
        onMouseDown: function(e) {
            var self = this;
            this.info.x1 = this.info.x = this.info._lastX = e.offsetX;
            this.info.y1 = this.info.y = this.info._lastY = e.offsetY;
            this.info._distanceX = this.info._distanceY = 0;
            this._longTapTimeout = setTimeout(function() {
                self.longTap.apply(self, arguments);
            }, defaultConfig.longTapDelay);
            this._triggerEvent.call(this, Evt.type.touchStart);
        },
        onMouseMove: function(e) {
            this.cancelLongTap();
            this.info.x = e.offsetX;
            this.info.y = e.offsetY;
            setPointInfo(this.info);
            if (defaultConfig.moveDetect) {
                this._triggerEvent.call(this, Evt.type.move);
                this._triggerEvent.call(this, Evt.type['move' + this.info.moveDirection]);
            }
            this._triggerEvent.call(this, Evt.type.touchMove);
        },
        onMouseUp: function(e) {
            var self = this;
            this.cancelLongTap();
            this.info.x = e.offsetX;
            this.info.y = e.offsetY;
            setPointInfo(this.info);
            this._triggerEvent.call(this, Evt.type.touchEnd);
            if (((this.info.direction === 'Left' || this.info.direction === 'Right') && Math.abs(this.info.dx) > defaultConfig.swipeMinX) || ((this.info.direction === 'Up' || this.info.direction === 'Down') && Math.abs(this.info.dy) > defaultConfig.swipeMinY)) {
                this._triggerEvent.call(this, Evt.type.swipe);
                this._triggerEvent.call(this, Evt.type['swipe' + this.info.direction]);
                this.info = {};
            }
        },
        onClick: function(e) {
            this.info.x = e.offsetX;
            this.info.y = e.offsetY;
            setPointInfo(this.info);
            this._triggerEvent.call(this, Evt.type.tap);
            this.info = {};
        },
        onDoubleClick: function(e) {
            this.info.x = e.offsetX;
            this.info.y = e.offsetY;
            setPointInfo(this.info);
            this._triggerEvent.call(this, Evt.type.doubleTap);
            this.info = {};
        }
    });
    Evt.type = {
        none: 'none',
        touchStart: 'touchStart',
        touchMove: 'touchMove',
        tap: 'tap',
        //双击事件可能检测不到或者错误，所以尽量避免双击事件
        doubleTap: 'doubleTap',
        //长按很少用到，暂时不作处理。
        longPress: 'longPress',
        //滑动事件可以调整参数，例如滑动范围
        swipe: 'swipe',
        swipeLeft: 'swipeLeft',
        swipeRight: 'swipeRight',
        swipeUp: 'swipeUp',
        swipeDown: 'swipeDown',
        move: 'move',
        moveLeft: 'moveLeft',
        moveRight: 'moveRight',
        moveUp: 'moveUp',
        moveDown: 'moveDown',
        touchEnd: 'touchEnd'
    };
    return Evt;
});