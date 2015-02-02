/**
 * @author lbc
 */
YI.package('engine').module('animation').import('engine.clock', 'engine.texture').define(function() {
    //动画类，既可以作为精灵的动画，也可以单独使用播放一段动画
    Animation = YI.Animation = YI.Class.extend({
        //动画纹理
        texture: null,
        //动画序列
        frames: [0],
        //动画每帧间隔
        delay: 1000 / YI.fps,
        //是否循环播放
        isLoop: true,
        //动画需要播放次数，默认0为无限次
        loopCount: 0,
        //动画当前第几帧
        curFrame: 0,
        //动画计时器
        timer: null,
        //动画当前播放的格位
        tile: 0,
        //是否在播放
        playing: false,
        //是否已经播放完毕
        ended: false,
        //播放完毕回调函数
        callback: null,
        //构造函数
        init: function(texture, frames, delay) {
            this.texture = texture;
            this.frames = frames || [0];
            this.delay = delay || 1000 / YI.fps;
            this.timer = new Clock(false);
            this.curFrame = 0;
            this.tile = this.frames[0];
        },
        //播放
        play: function(loopCount, callback) {
            if (loopCount) {
                this.loopCount = loopCount;
            } else {
                this.loopCount = 0;
            }
            if (!this.loopCount) {
                this.isLoop = true;
            } else {
                this.isLoop = false;
            }
            this.playing = true;
            this.ended = false;
            if (callback) {
                this.callback = callback;
            }
            this.timer.start();
        },
        //暂停播放
        stop: function() {
            this.playing = false;
            this.timer.stop();
        },
        //继续开始
        resume: function() {
            this.playing = true;
            this.timer.start();
        },
        //跳转到第f帧
        gotoFrame: function(f) {
            this.timer.elapsedTime += (f - this.curFrame) * this.delay;
            this.update();
        },
        //下一帧
        next: function() {
            this.curFrame++;
            this.tile = this.frames[this.curFrame];
            this.timer.elapsedTime += this.delay;
        },
        //重置动画
        rewind: function(loopCount, callback) {
            this.timer.restart();
            this.curFrame = 0;
            this.tile = this.frames[0];
            if (loopCount) {
                this.loopCount = loopCount;
            } else {
                this.loopCount = 0;
            }
            if (!this.loopCount) {
                this.isLoop = true;
            } else {
                this.isLoop = false;
            }
            this.ended = false;
            if (callback) {
                this.callback = callback;
            }
            this.playing = true;
        },
        //更新下一帧
        update: function() {
            if (this.playing && !this.ended) {
                this.timer.step();
                //该播放第几帧
                var frameTotal = Math.floor(this.timer.getElapsedTime() / this.delay);
                //播放次数
                var count = Math.floor(frameTotal / this.frames.length);
                //如果无限次播放或者未达到播放循环次数，则播放下一帧，否则停留在最后一帧
                if (this.isLoop || count < this.loopCount) {
                    this.curFrame = frameTotal % this.frames.length;
                } else {
                    this.curFrame = this.frames.length - 1;
                    this.playing = false;
                    this.ended = true;
                    //执行回调函数
                    if (this.callback) {
                        this.callback();
                    }
                }
                //设置播放的格位
                this.tile = this.frames[this.curFrame];
            }
        },
        draw: function(targetX, targetY) {
            this.texture.drawTile(targetX, targetY, this.tile);
        }
    });

});