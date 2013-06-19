/**
 * @author lbc
 */
YI.package('engine').module('sound').define(function () {
    //音频类
    Sound = YI.Sound = YI.Class.extend({
        //声音路径
        path:'',
        //声音音量
        volume:1,
        //声音格式
        format:null,
        //声音audio
        music:null,
        //是否载入
        loaded:false,
        //是否在播放
        playing:false,
        //是否循环播放
        loop:false,
        //是否可以播放这种格式
        enabled:true,

//初始化
        init:function (path) {
            this.path = config.res_path + 'audio/' + path;
            YI.resourceCache[this.path] = this;
            return this;
        },
        //加载音频
        load:function () {
            if (!this.loaded) {
                this.music = new Audio();
                //判断音频的类型
                for (var type in Sound.FORMAT) {
                    var format = Sound.FORMAT[type];
                    if (this.music.canPlayType(format.mime)) {
                        this.format = format;
                        break;
                    }
                }
                //如果浏览器不支持这种音频
                if (!this.format) {
                    this.enabled = false;
                    throw '浏览器不支持这种音频格式！'
                }
//绑定加载完成事件
                this.music.addEventListener('canplaythrough', this.onload.bind(this), false);
                this.music.src = this.path + "?" + Date.now();
            }
            return this;
        },
        onload:function () {
            this.loaded = true;
            YI.loader.update();
        },
        //播放
        play:function (isLoop) {
            this.loop = !!isLoop;
            this.music.loop = this.loop;
            //设置是否循环播放，如果已经加载完成，同时不失在播放则播放，否则等待加载完成
            if (this.loaded) {
                if (!this.playing) {
                    this.music.play();
                    this.playing = true;
                }
            } else {
                setTimeout(this.play.bind(this), 1000);
            }
        },
        //停止
        stop:function () {
            if (this.loaded && this.playing) {
                this.music.pause();
                this.music.currentTime = 0;
                this.playing = false;
            }
        },
        pause:function () {
            if (this.loaded && this.playing) {
                this.music.pause();
                this.playing = false;
            }
        },
        replay:function () {
            this.music.currentTime = 0;
            this.music.play();
            this.playing = true;
        },
        //调大音量
        turnUp:function (num) {
            if (this.volume < 1) {
                this.volume += num || 0.1;
                this.volume = Math.min(this.volume, 1);
                this.music.volume = this.volume;
            }
        },
        //减少音量
        turnDown:function (num) {
            if (this.volume > 0) {
                this.volume -= num || 0.1;
                this.volume = Math.max(this.volume, 0);
                this.music.volume = this.volume;
            }
        },
        mute:function () {
            this.volume = 0;
            this.music.volume = 0;
        },
        unMute:function (volume) {
            this.volume = volume || 1;
            this.music.volume = this.volume;
        }
    });

//音频格式常量
    Sound.FORMAT = {
        MP3:{
            ext:'mp3',
            mime:'audio/mpeg'
        },
        M4A:{
            ext:'m4a',
            mime:'audio/mp4; codecs=mp4a'
        },
        OGG:{
            ext:'ogg',
            mime:'audio/ogg; codecs=vorbis'
        },
        WEBM:{
            ext:'webm',
            mime:'audio/webm; codecs=vorbis'
        },
        CAF:{
            ext:'caf',
            mime:'audio/x-caf'
        }
    }
});
