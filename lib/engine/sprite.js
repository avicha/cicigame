/**
 * @author lbc
 */
YI.package('engine').module('sprite').import('engine.texture', 'engine.drawableobject', 'engine.animation', 'engine.shape.rectangle', 'engine.shape.polygon', 'engine.shape.vector2', 'engine.shape.circle', 'engine.shape.line').define(function () {
    Sprite = YI.Sprite = YI.DrawableObject.extend({
        //精灵类型
        type:'unknown',
        //精灵名称
        name:'unknown',
        //血量
        health:100,
        //速度
        speed:new Vector2(0, 0),
        //加速度
        acceleration:new Vector2(0, 0),
        //动画集合
        animations:{},
        //当前播放动画
        currentAnimation:null,
        //如果涉及box2d，指向相应的body指针
        body:null,
        //是否还在屏幕上
        isOnScreen:function () {
            return YI.curScene.range.intersectsWith(this.shape.relativeTo(this.position));
        },
        //添加动作为action的动画，帧序列和时间间隔
        addAnimation:function (action, frames, delay) {
            if (!this.texture) {
                throw '你还没有为此精灵定义纹理呢！';
            }
            var a = new Animation(this.texture, frames, delay);
            this.animations[action] = a;
            return this;
        },
        //设置当前播放的动画，设置播放次数，播放完毕后回调函数
        setCurrentAnim:function (action, loopCount, callback) {
            if (!this.animations[action]) {
                throw '不存在名字为' + action + '的动画';
            } else {
                if (this.currentAnimation) {
                    this.currentAnimation = this.animations[action];
                    this.currentAnimation.rewind(loopCount, callback);
                } else {
                    this.currentAnimation = this.animations[action];
                    this.currentAnimation.play(loopCount, callback);
                }
            }
        },
        //收到伤害
        hurt:function (blood) {
            if (YI.running) {
                this.health -= blood;
                this.health = Math.max(this.health, 0);
            }
        },
        update:function () {
            //根据当前位置和加速度，速度更新精灵的位置，更新动画帧
            this.speed.addSelf(this.acceleration.multiply(1/YI.fps));
            this.position.addSelf(this.speed.multiply(1/YI.fps));
            if (this.currentAnimation) {
                this.currentAnimation.update();
            }
        },
        draw:function () {
            if (this.visiable && this.isOnScreen()) {
                this.beforeDraw();
                if (this.currentAnimation) {
                    this.currentAnimation.draw(this.position.x, this.position.y);
                } else {
                    this.texture.drawTile(this.position.x, this.position.y, 0);
                }
                this.afterDraw();
            }
        },
//碰撞根据两个精灵的形状检测碰撞
        collideWith:function (other) {
            return this.shape.relativeTo(this.position).intersectsWith(other.shape.relativeTo(other.position));
        }
    });
});

