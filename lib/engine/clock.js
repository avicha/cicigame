/**
 * @author lbc
 */
YI.package('engine').module('clock').define(function () {
    Clock = YI.Clock = YI.Class.extend({
        //开始时间
        startTime:0,
        //上一刻时间
        oldTime:0,
        //一共逝去时间
        elapsedTime:0,
        //时钟是否在运行
        running:false,
        init:function (autostart) {
            if (autostart) {
                this.start();
            }
        },
        //开始计时
        start:function () {
            this.startTime = Date.now();
            this.oldTime = this.startTime;
            this.running = true;
        },
        //重新开始计时
        restart:function () {
            this.elapsedTime = 0;
            this.start();
        },
        //停止计时
        stop:function () {
            this.running = false;
        },
        //更新下一个时刻
        step:function () {
            var delta = 0;
            var current = Date.now();
            if (this.running) {
                delta = current - this.oldTime;
                this.oldTime = current;
                this.elapsedTime += delta;
            }
            return delta;
        },
        //获取逝去时间
        getElapsedTime:function () {
            return this.elapsedTime;
        }
    });
});

