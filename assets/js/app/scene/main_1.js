/**
 * @author lbc
 */
YI.package('game.scene').module('main_1').import('engine.scene').define(function() {
    Main_1 = YI.Scene.extend({
        //初始化画面
        init: function() {
            this.range = new Rect(0, 0, YI.width, YI.height);
            //背景
            this.bg1 = this.addGameObject(new Background(0, 0, Layer.Background, Background.Textures.bg1, {
                speed: new Vector2(120, 0),
                repeat: true,
                distance: 2
            }));
            this.bg2 = this.addGameObject(new Background(0, 0, Layer.Foreground, Background.Textures.bg2, {
                speed: new Vector2(120, 0),
                repeat: true,
                distance: 1
            }));
            //头像背景
            this.headBg = this.addGameObject(new Label(20, 20, 3, Label.Textures.headBg));
            //头像
            this.head = this.addGameObject(new Label(22, 10, 4, Label.Textures.head));
            //道具背景
            this.toolBg = [];
            for (var i = 0; i < 5; i++) {
                this.toolBg[i] = this.addGameObject(new Label(120 + 70 * i, 20, 3, Label.Textures.toolBg));
            }
            //石头
            this.stoneTool = this.addGameObject(new Tools(120, 30, 4, {
                type: Tools.TYPE.Stone,
                texture: Tools.Textures.stone,
                count: 100,
                cd: 1000
            }));
            //石头数目
            this.stoneNum = this.addGameObject(new Num(190, 100, 5, '*' + this.stoneTool.count.toString(), Num.Textures.small, {
                align: Num.ALIGN.RIGHT,
                valign: Num.VALIGN.BOTTOM
            }));
            //木棍
            this.stickTool = this.addGameObject(new Tools(190, 30, 4, {
                type: Tools.TYPE.Stick,
                texture: Tools.Textures.stick,
                count: 3,
                cd: 1000
            }));
            //木棍数目
            this.stickNum = this.addGameObject(new Num(260, 100, 5, '*' + this.stickTool.count.toString(), Num.Textures.small, {
                align: Num.ALIGN.RIGHT,
                valign: Num.VALIGN.BOTTOM
            }));
            //骨头
            this.boneTool = this.addGameObject(new Tools(260, 30, 4, {
                type: Tools.TYPE.Bone,
                texture: Tools.Textures.bone,
                count: 3,
                cd: 1000
            }));
            //骨头数目
            this.boneNum = this.addGameObject(new Num(330, 100, 5, '*' + this.boneTool.count.toString(), Num.Textures.small, {
                align: Num.ALIGN.RIGHT,
                valign: Num.VALIGN.BOTTOM
            }));
            //血条背景
            this.bloodBg = this.addGameObject(new Label(500, 30, 3, Label.Textures.bloodBg));
            //血条
            this.blood = this.addGameObject(new Label(510, 45, 4, Label.Textures.blood));
            //菜单按钮
            this.menuButton = this.addGameObject(new Button(0, 620, 3, Button.Textures.menuButton));
            //暂停按钮
            this.stopButton = this.addGameObject(new Button(100, 620, 3, Button.Textures.stopButton));
            //萝卜车
            this.carrot = this.addGameObject(new Carrot(-50, 400, 3));
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
            this.scoreBg = this.addGameObject(new Label(900, 610, 3, Label.Textures.scoreBg));
            //分数
            this.score = this.addGameObject(new Num(1050, 620, 4, this.sumScore.toString(), Num.Textures.big));
            //成功过关画面
            this.success = null;
            //过关失败画面
            this.fail = null;
        },
        update: function() {
            if (this.success || this.fail) {
                YI.stop();
                return;
            }
            this.super();
            this.currentLength += this.bg2.speed.x / YI.fps;
            if (this.currentLength >= this.targetLength) {
                this.success = this.addGameObject(new Background(128, 0, 6, Background.Textures.success));
            }
            //处理出现狗狗
            var r = Math.random();
            var dog;
            if (r < 0.3 / YI.fps) {
                if (r < 0.1 / YI.fps) {
                    dog = this.addGameObject(new Dog1(YI.width, 500, this.dogs.length + 5));
                    this.dogs.push(dog);
                } else {
                    if (r < 0.2 / YI.fps) {
                        dog = this.addGameObject(new Dog2(YI.width, 500, this.dogs.length + 5));
                        this.dogs.push(dog);
                    } else {
                        dog = this.addGameObject(new Dog3(YI.width, 450, this.dogs.length + 5));
                        this.dogs.push(dog);
                    }
                }
            }
        },
        handleEvent: function() {
            var o = Event.getChooseObject();
            if (Event.currentEvent == Event.type.tap) {
                if (this.fail || this.success) {
                    YI.jumpToScene(YI.Scene.Menu);
                    YI.start();
                    return;
                }
                //如果点击了道具
                if (o instanceof Tools) {
                    this.currentTool = o.type;
                }
                //如果点击了菜单
                if (o == this.menuButton) {
                    YI.jumpToScene(YI.Scene.Menu);
                }
                //如果点击了暂停
                if (o == this.stopButton) {
                    if (YI.running) {
                        YI.stop();
                    } else {
                        YI.start();
                    }
                }
                //如果点击了狗狗，同时狗狗正在奔跑
                if (o instanceof Dog && o.currentAnimation == o.animations.run) {
                    //如果当前使用石头，同时石头还有数量，则从萝卜车里面扔出石头到点击的位置
                    if (this.currentTool == Tools.TYPE.Stone) {
                        if (this.stoneTool.count) {
                            this.carrot.throwStone(Event.Mouses[Event.mouseNum - 1].x, Event.Mouses[Event.mouseNum - 1].y, o.z);
                            this.stoneTool.count--;
                            this.stoneNum.setNum('*' + this.stoneTool.count.toString());
                        }
                    }
                    //如果当前使用骨头，同时石头还有数量，则从萝卜车里面扔出骨头到点击的位置
                    if (this.currentTool == Tools.TYPE.Bone) {
                        if (this.boneTool.count) {
                            this.carrot.throwBone(Event.Mouses[Event.mouseNum - 1].x, Event.Mouses[Event.mouseNum - 1].y, o.z);
                            this.boneTool.count--;
                            this.boneNum.setNum('*' + this.boneTool.count.toString());
                        }
                    }
                    //如果当前使用木棍，同时木棍还有数量，则从萝卜车里面挥赶木棍到点击的狗狗
                    if (this.currentTool == Tools.TYPE.Stick) {
                        if (this.stickTool.count) {
                            this.carrot.throwStick(o, o.z);
                            this.stickTool.count--;
                            this.stickNum.setNum('*' + this.stickTool.count.toString());
                        }
                    }
                }
            }
            this.super();
        }
    });
});