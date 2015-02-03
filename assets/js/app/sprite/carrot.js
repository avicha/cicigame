/**
 * @author lbc
 */
YI.package('game.sprite').module('carrot').import('engine.sprite').define(function() {
    Carrot = Sprite.extend({
        //是否被咬
        isBeated: false,
        //萝卜车纹理
        texture: new Texture('carrot.png', 1, 6),
        //能够承受被咬的次数
        bear: 10,
        init: function(x, y, z, configs) {
            this.super(x, y, z, configs);
            //添加跑的动画
            this.addAnimation('run', [0, 1, 2], 100);
            //添加被咬时警告的动画
            this.addAnimation('warm', [3, 4, 5, 4], 100);
            this.setCurrentAnim('run');
        },
        update: function() {
            this.super();
            this.isBeated = false;
            //改变血条的宽度
            YI.curScene.blood.icon.tileWidth = 240 * this.health / 100;
            //如果生命值少于0了，则清除所有狗狗的计时，同时显示失败画面
            if (this.health <= 0) {
                YI.curScene.fail = YI.curScene.addGameObject(new Background(128, 0, 6, Background.Textures.fail));
            }
            //判断是否被狗狗咬着
            YI.curScene.dogs.forEach(function(e) {
                if (e.beat >= 0) {
                    this.isBeated = true;
                }
            }, this);
            //如果被咬着但当前动画不是警告则设置为警告
            if (this.isBeated && this.currentAnimation != this.animations.warm) {
                this.setCurrentAnim('warm');
            }
            //如果没有被咬着但当前动画不是跑动则设置为跑动
            if (!this.isBeated && this.currentAnimation != this.animations.run) {
                this.setCurrentAnim('run');
            }
        },
        //扔石头
        throwStone: function(targetX, targetY, z) {
            YI.curScene.addGameObject(new Stone(this.position.x + this.texture.tileWidth, this.position.y, z, targetX, targetY));
        },
        //扔骨头
        throwBone: function(targetX, targetY, z) {
            YI.curScene.addGameObject(new Bone(this.position.x + this.texture.tileWidth, this.position.y, z, targetX, targetY));
        },
        //扔木棍
        throwStick: function(o, z) {
            YI.curScene.addGameObject(new Stick(this.position.x + this.texture.tileWidth, this.position.y, z, o));
        }
    });
});