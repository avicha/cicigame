/**
 * @author lbc
 */
define(['lib/scene', 'lib/shape/vector2', 'lib/texture', 'lib/ui/background', 'lib/ui/label', 'lib/ui/button', 'lib/ui/number', 'app/sprite/tool', 'app/sprite/carrot', 'app/sprite/dog', 'app/sprite/dog1', 'app/sprite/dog2', 'app/sprite/dog3', 'app/sprite/stone', 'app/sprite/bone', 'app/sprite/stick'], function(Scene, Vector2, Texture, Background, Label, Button, Num, Tools, Carrot, Dog, Dog1, Dog2, Dog3, Stone, Bone, Stick) {
    var Scene_1 = Scene.extend({
        init: function() {
            var self = this;
            this.running = true;
            //背景
            this.bg1 = this.addGameObject(new Background(0, 0, 0, Scene_1.resources.bg1, {
                speed: new Vector2(120, 0),
                repeat: true,
                distance: 2,
                stageWidth: this.getStageSize().width,
                stageHeight: this.getStageSize().height
            }));
            this.bg2 = this.addGameObject(new Background(0, 0, 1, Scene_1.resources.bg2, {
                speed: new Vector2(120, 0),
                repeat: true,
                distance: 1,
                stageWidth: this.getStageSize().width,
                stageHeight: this.getStageSize().height
            }));
            //头像背景
            this.headBg = this.addGameObject(new Label(20, 20, 3, Scene_1.resources.headBg));
            //头像
            this.head = this.addGameObject(new Label(22, 10, 4, Scene_1.resources.head));
            //道具背景
            this.toolBg = [];
            for (var i = 0; i < 5; i++) {
                this.toolBg[i] = this.addGameObject(new Label(120 + 70 * i, 20, 3, Scene_1.resources.toolBg));
            }
            //石头
            this.stoneTool = this.addGameObject(new Tools(120, 30, 4, {
                type: Tools.TYPE.Stone,
                texture: Scene_1.resources.stone,
                count: 100,
                cd: 1000
            }));
            //石头数目
            this.stoneNum = this.addGameObject(new Num(190, 100, 5, {
                value: '*' + this.stoneTool.count.toString(),
                texture: Scene_1.resources.smallNum,
                align: Num.ALIGN.RIGHT,
                valign: Num.VALIGN.BOTTOM
            }));
            //木棍
            this.stickTool = this.addGameObject(new Tools(190, 30, 4, {
                type: Tools.TYPE.Stick,
                texture: Scene_1.resources.stick,
                count: 30,
                cd: 1000
            }));
            //木棍数目
            this.stickNum = this.addGameObject(new Num(260, 100, 5, {
                value: '*' + this.stickTool.count.toString(),
                texture: Scene_1.resources.smallNum,
                align: Num.ALIGN.RIGHT,
                valign: Num.VALIGN.BOTTOM
            }));
            //骨头
            this.boneTool = this.addGameObject(new Tools(260, 30, 4, {
                type: Tools.TYPE.Bone,
                texture: Scene_1.resources.bone,
                count: 30,
                cd: 1000
            }));
            //骨头数目
            this.boneNum = this.addGameObject(new Num(330, 100, 5, {
                value: '*' + this.boneTool.count.toString(),
                texture: Scene_1.resources.smallNum,
                align: Num.ALIGN.RIGHT,
                valign: Num.VALIGN.BOTTOM
            }));
            //血条背景
            this.bloodBg = this.addGameObject(new Label(500, 30, 3, Scene_1.resources.bloodBg));
            //血条
            this.blood = this.addGameObject(new Label(510, 45, 4, Scene_1.resources.blood));
            //菜单按钮
            this.menuButton = this.addGameObject(new Button(0, 620, 3, Scene_1.resources.menuButton));
            //暂停按钮
            this.stopButton = this.addGameObject(new Button(100, 620, 3, Scene_1.resources.stopButton));
            //萝卜车
            this.carrot = this.addGameObject(new Carrot(-50, 400, 3, {
                texture: Scene_1.resources.carrot
            }));
            //狗狗
            this.dogs = [];
            //当前使用道具
            this.currentTool = Tools.TYPE.Stone;
            //当前已经走过长度
            this.currentLength = 0;
            //目标长度
            this.targetLength = 8000;
            //游戏分数
            this.sumScore = 0;
            //显示分数背景
            this.scoreBg = this.addGameObject(new Label(900, 610, 3, Scene_1.resources.scoreBg));
            //分数
            this.score = this.addGameObject(new Num(1050, 620, 4, {
                value: this.sumScore.toString(),
                texture: Scene_1.resources.bigNum
            }));
            //成功过关画面
            this.success = null;
            //过关失败画面
            this.fail = null;
            this.on('tap', function(e) {
                switch (e.target) {
                    case this.stopButton:
                        if (this.running) {
                            this.trigger('stopScene');
                            this.running = false;
                        } else {
                            this.trigger('startScene');
                            this.running = true;
                        }
                        break;
                    case this.menuButton:
                        this.trigger('switchScene', 'Menu');
                        break;
                    case this.success || this.fail:
                        this.trigger('switchScene', 'Menu');
                        break;
                    case this.stoneTool:
                        this.currentTool = Tools.TYPE.Stone;
                        break;
                    case this.stickTool:
                        this.currentTool = Tools.TYPE.Stick;
                        break;
                    case this.boneTool:
                        this.currentTool = Tools.TYPE.Bone;
                        break;
                    default:
                        var o = e.target;
                        if (o instanceof Dog && o.currentAnimation == o.animations.run) {
                            switch (this.currentTool) {
                                case Tools.TYPE.Stone:
                                    this.throwStone(e.x, e.y, o.z);
                                    break;
                                case Tools.TYPE.Stick:
                                    this.throwStick(o);
                                    break;
                                case Tools.TYPE.Bone:
                                    this.throwBone(e.x, e.y, o.z);
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                }
            });
            this.on('fail', function() {
                self.fail = self.addGameObject(new Background(128, 0, 6, Scene_1.resources.fail));
            });
        },
        update: function(fps) {
            var self = this;
            if (this.success || this.fail) {
                this.trigger('stopScene');
                return;
            }
            this.carrot.isBeated = false;
            //改变血条的宽度
            this.blood.icon.tileWidth = 240 * this.carrot.health / 100;
            if (this.carrot.health <= 0) {
                this.trigger('fail');
            }
            this.dogs.forEach(function(dog) {
                if (dog.beat) {
                    self.carrot.isBeated = true;
                }
            });
            this.currentLength += this.bg2.speed.x / fps;
            if (this.currentLength >= this.targetLength) {
                this.success = this.addGameObject(new Background(128, 0, 6, Scene_1.resources.success));
                return;
            }
            //处理出现狗狗
            var r = Math.random();
            var dog;
            if (r < 0.3 / fps) {
                if (r < 0.1 / fps) {
                    dog = this.addGameObject(new Dog1(this.getStageSize().width, 500, this.dogs.length + 5, {
                        texture: Scene_1.resources.dog1
                    }));
                } else {
                    if (r < 0.2 / fps) {
                        dog = this.addGameObject(new Dog2(this.getStageSize().width, 500, this.dogs.length + 5, {
                            texture: Scene_1.resources.dog2
                        }));
                    } else {
                        dog = this.addGameObject(new Dog3(this.getStageSize().width, 450, this.dogs.length + 5, {
                            texture: Scene_1.resources.dog3
                        }));
                    }
                }
                this.dogs.push(dog);
            }
            this.super(fps);
        },
        throwStone: function(x, y, z) {
            if (this.stoneTool.count) {
                var stone = new Stone(this.carrot.position.x + this.carrot.texture.tileWidth, this.carrot.position.y, z, Scene_1.resources.stoneSprite);
                stone.setTarget(x, y);
                this.addGameObject(stone);
                this.stoneTool.count--;
                this.stoneNum.setNum('*' + this.stoneTool.count.toString());
            }
        },
        throwStick: function(dog) {
            if (this.stickTool.count) {
                var stick = new Stick(this.carrot.position.x + this.carrot.texture.tileWidth, this.carrot.position.y, dog.z, Scene_1.resources.stickSprite, dog);
                dog.setCurrentAnim('stop', 2, function() {
                    dog.setCurrentAnim('run');
                    dog.speed.x = -120;
                });
                dog.hurt(100 / dog.bear);
                if (dog.health <= 0) {
                    dog.setCurrentAnim('sleep');
                    this.sumScore += dog.score;
                    this.score.setNum(this.sumScore.toString());
                    dog.speed.x = 120;
                } else {
                    dog.position.x += 150;
                }
                if (dog.beat) {
                    clearInterval(dog.beat);
                    dog.beat = 0;
                }
                this.addGameObject(stick);
                this.stickTool.count--;
                this.stickNum.setNum('*' + this.stickTool.count.toString());
            }
        },
        throwBone: function(x, y, z) {
            if (this.boneTool.count) {
                var bone = new Bone(this.carrot.position.x + this.carrot.texture.tileWidth, this.carrot.position.y, z, Scene_1.resources.boneSprite);
                bone.setTarget(x, y);
                this.addGameObject(bone);
                this.boneTool.count--;
                this.boneNum.setNum('*' + this.boneTool.count.toString());
            }
        }
    });
    Scene_1.getResources = function() {
        this.resources = {
            bg1: new Texture('map01.png'),
            bg2: new Texture('map02.png'),
            headBg: new Texture('headBg.png'),
            head: new Texture('head.png'),
            toolBg: new Texture('toolBg.png'),
            stone: new Texture('stone-tool.png'),
            smallNum: new Texture('numberSmall.png', 1, 11),
            stick: new Texture('stick-tool.png'),
            bone: new Texture('bone-tool.png'),
            bloodBg: new Texture('bloodBg.png'),
            blood: new Texture('blood.png'),
            menuButton: new Texture('menuButton.png'),
            stopButton: new Texture('stopButton.png'),
            scoreBg: new Texture('scoreBg.png'),
            bigNum: new Texture('numberBig.png', 1, 11),
            carrot: new Texture('carrot.png', 1, 6),
            success: new Texture('success.png'),
            fail: new Texture('fail.png'),
            dog1: new Texture('dog1.png', 1, 12),
            dog2: new Texture('dog2.png', 1, 12),
            dog3: new Texture('dog3.png', 1, 12),
            stoneSprite: new Texture('stone.png', 1, 4),
            stickSprite: new Texture('stick.png', 1, 3),
            boneSprite: new Texture('bone.png', 1, 4)
        };
        return this.resources;
    };
    return Scene_1;
});