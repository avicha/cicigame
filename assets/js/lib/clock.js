/**
 * @author lbc
 */
define(['lib/class'], function(Class) {
    var Clock = Class.extend({
        //开始时间
        _startTime: 0,
        //上一刻时间
        _oldTime: 0,
        //一共逝去时间
        _elapsedTime: 0,
        //时钟是否在运行
        _running: false,
        init: function(autostart) {
            if (autostart) {
                this.start();
            }
        },
        //开始计时
        start: function() {
            this._startTime = Date.now();
            this._oldTime = this._startTime;
            this._running = true;
        },
        //重新开始计时
        restart: function() {
            this._elapsedTime = 0;
            this.start();
        },
        //停止计时
        stop: function() {
            this._running = false;
        },
        //更新下一个时刻
        step: function() {
            var delta = 0;
            var current = Date.now();
            if (this._running) {
                delta = current - this._oldTime;
                this._oldTime = current;
                this._elapsedTime += delta;
            }
            return delta;
        },
        //获取逝去时间
        getElapsedTime: function() {
            return this._elapsedTime;
        }
    });
    return Clock;
});