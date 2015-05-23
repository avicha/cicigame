/**
 * @author lbc
 */
define(['lib/class', 'lib/shape/vector2'], function(Class, Vector2) {
    var Evt = Class.extend({
        init: function(dom) {
            var self = this;
            this.startMouse = this.endMouse = null;
            this.lastTouchStart = 0;
            this.currentEvent = Evt.type.none;
            this.mouses = [];
            this.Key = 0;
            if (/mobile/i.test(window.navigator.userAgent)) {
                dom.addEventListener('touchstart', onTouchStart, false);
                dom.addEventListener('touchmove', onTouchMove, false);
                dom.addEventListener('touchend', onTouchEnd, false);
                window.addEventListener('orientationchange', onOrientationChange, false);
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
        onMouseDown: function(e) {
            var self = this;
            this.currentEvent = Evt.type.touchStart;
            this.mouses.push(new Vector2(e.offsetX, e.offsetY));
            this.startMouse = {
                x: e.offsetX,
                y: e.offsetY
            };
            this.x = e.offsetX;
            this.y = e.offsetY;
            setTimeout(function() {
                if (self.currentEvent == Evt.type.touchStart && Date.now() - self.lastTouchStart > 900) {
                    self.currentEvent = Evt.type.longPress;
                    self.trigger(this.currentEvent, self);
                }
            }, 1000);
            this.lastTouchStart = Date.now();
            this.trigger(this.currentEvent, this);
        },
        onMouseMove: function(e) {
            this.currentEvent = Evt.type.touchMove;
            this.mouses.push(new Vector2(e.offsetX, e.offsetY));
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.trigger(this.currentEvent, this);
        },
        onMouseUp: function(e) {
            this.currentEvent = Evt.type.touchEnd;
            this.mouses.push(new Vector2(e.offsetX, e.offsetY));
            this.endMouse = {
                x: e.offsetX,
                y: e.offsetY
            };
            this.x = e.offsetX;
            this.y = e.offsetY;
            if (this.endMouse.x - this.startMouse.x >= 70 && Math.abs(this.endMouse.y - this.startMouse.y) <= 30) {
                this.currentEvent = Evt.type.rightSwipe;
            }
            if (this.startMouse.x - this.endMouse.x >= 70 && Math.abs(this.endMouse.y - this.startMouse.y) <= 30) {
                this.currentEvent = Evt.type.leftSwipe;
            }
            if (Math.abs(this.endMouse.x - this.startMouse.x) <= 30 && this.endMouse.y - this.startMouse.y >= 70) {
                this.currentEvent = Evt.type.downSwipe;
            }
            if (Math.abs(this.endMouse.x - this.startMouse.x) <= 30 && this.startMouse.y - this.endMouse.y >= 70) {
                this.currentEvent = Evt.type.upSwipe;
            }
            this.trigger(this.currentEvent, this);
            this.mouses = [];
        },
        onClick: function(e) {
            this.currentEvent = Evt.type.tap;
            this.mouses.push(new Vector2(e.offsetX, e.offsetY));
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.trigger(this.currentEvent, this);
            this.mouses = [];
        },
        onDoubleClick: function(e) {
            this.currentEvent = Evt.type.doubleTap;
            this.mouses.push(new Vector2(e.offsetX, e.offsetY));
            this.x = e.offsetX;
            this.y = e.offsetY;
            this.trigger(this.currentEvent, this);
            this.mouses = [];
        }
    });
    Evt.type = {
        none: 'none',
        touchStart: 'touchstart',
        touchMove: 'touchMove',
        tap: 'tap',
        //双击事件可能检测不到或者错误，所以尽量避免双击事件
        doubleTap: 'doubleTap',
        //长按很少用到，暂时不作处理。
        longPress: 'longPress',
        //滑动事件可以调整参数，例如滑动范围
        leftSwipe: 'leftSwipe',
        rightSwipe: 'rightSwipe',
        upSwipe: 'upSwipe',
        downSwipe: 'downSwipe',
        touchEnd: 'touchEnd'
    };
    return Evt;
});