/**
 * @author lbc
 */
define(function(require, exports, module) {
    var Scene = require('lib/scene');
    var Vector2 = require('lib/shape/vector2');
    var Texture = require('lib/texture');
    var Background = require('lib/ui/background');
    var Label = require('lib/ui/label');
    var Button = require('lib/ui/button');
    var Tools = require('app/sprite/tool');
    var Num = require('lib/ui/number');
    var Carrot = require('app/sprite/carrot');
    var Dog = require('app/sprite/dog');
    var Dog1 = require('app/sprite/dog1');
    var Dog2 = require('app/sprite/dog2');
    var Dog3 = require('app/sprite/dog3');
    var Stone = require('app/sprite/stone');
    var Bone = require('app/sprite/bone');
    var Stick = require('app/sprite/stick');
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
                                    if (this.stoneTool.count) {
                                        var stone = new Stone(this.carrot.position.x + this.carrot.texture.tileWidth, this.carrot.position.y, o.z, Scene_1.resources.stoneSprite);
                                        var point = e.mouses[e.mouses.length - 1];
                                        stone.setTarget(point.x, point.y);
                                        this.addGameObject(stone);
                                        this.stoneTool.count--;
                                        this.stoneNum.setNum('*' + this.stoneTool.count.toString());
                                    }
                                    break;
                                case Tools.TYPE.Stick:
                                    if (this.stickTool.count) {
                                        var stick = new Stick(this.carrot.position.x + this.carrot.texture.tileWidth, this.carrot.position.y, o.z, Scene_1.resources.stickSprite, o);
                                        o.setCurrentAnim('stop', 2, function() {
                                            o.setCurrentAnim('run');
                                            o.speed.x = -120;
                                        });
                                        o.hurt(100 / o.bear);
                                        if (o.health <= 0) {
                                            o.setCurrentAnim('sleep');
                                            this.sumScore += o.score;
                                            this.score.setNum(this.sumScore.toString());
                                            o.speed.x = 120;
                                        } else {
                                            o.position.x += 150;
                                        }
                                        if (o.beat) {
                                            clearInterval(o.beat);
                                            o.beat = -1;
                                        }
                                        this.addGameObject(stick);
                                        this.stickTool.count--;
                                        this.stickNum.setNum('*' + this.stickTool.count.toString());
                                    }
                                    break;
                                case Tools.TYPE.Bone:
                                    if (this.boneTool.count) {
                                        var bone = new Bone(this.carrot.position.x + this.carrot.texture.tileWidth, this.carrot.position.y, o.z, Scene_1.resources.boneSprite);
                                        var point = e.mouses[e.mouses.length - 1];
                                        bone.setTarget(point.x, point.y);
                                        this.addGameObject(bone);
                                        this.boneTool.count--;
                                        this.boneNum.setNum('*' + this.boneTool.count.toString());
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                }
            });
        },
        update: function(fps) {
            if (this.success || this.fail) {
                this.trigger('stopScene');
                return;
            }
            this.super(fps);
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
                    this.dogs.push(dog);
                } else {
                    if (r < 0.2 / fps) {
                        dog = this.addGameObject(new Dog2(this.getStageSize().width, 500, this.dogs.length + 5, {
                            texture: Scene_1.resources.dog2
                        }));
                        this.dogs.push(dog);
                    } else {
                        dog = this.addGameObject(new Dog3(this.getStageSize().width, 450, this.dogs.length + 5, {
                            texture: Scene_1.resources.dog3
                        }));
                        this.dogs.push(dog);
                    }
                }
            }
        }
    });
    Scene_1.resources = {
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
    module.exports = Scene_1;
});
// YI.package('game.scene').module('main_1').import('engine.scene').define(function() {
//     Main_1 = YI.Scene.extend({
//         //初始化画面
//         init: function() {
//             this.range = new Rect(0, 0, YI.width, YI.height);
//             //背景
//             this.bg1 = this.addGameObject(new Background(0, 0, Layer.Background, Background.Textures.bg1, {
//                 speed: new Vector2(120, 0),
//                 repeat: true,
//                 distance: 2
//             }));
//             this.bg2 = this.addGameObject(new Background(0, 0, Layer.Foreground, Background.Textures.bg2, {
//                 speed: new Vector2(120, 0),
//                 repeat: true,
//                 distance: 1
//             }));
//             //头像背景
//             this.headBg = this.addGameObject(new Label(20, 20, 3, Label.Textures.headBg));
//             //头像
//             this.head = this.addGameObject(new Label(22, 10, 4, Label.Textures.head));
//             //道具背景
//             this.toolBg = [];
//             for (var i = 0; i < 5; i++) {
//                 this.toolBg[i] = this.addGameObject(new Label(120 + 70 * i, 20, 3, Label.Textures.toolBg));
//             }
//             //石头
//             this.stoneTool = this.addGameObject(new Tools(120, 30, 4, {
//                 type: Tools.TYPE.Stone,
//                 texture: Tools.Textures.stone,
//                 count: 100,
//                 cd: 1000
//             }));
//             //石头数目
//             this.stoneNum = this.addGameObject(new Num(190, 100, 5, '*' + this.stoneTool.count.toString(), Num.Textures.small, {
//                 align: Num.ALIGN.RIGHT,
//                 valign: Num.VALIGN.BOTTOM
//             }));
//             //木棍
//             this.stickTool = this.addGameObject(new Tools(190, 30, 4, {
//                 type: Tools.TYPE.Stick,
//                 texture: Tools.Textures.stick,
//                 count: 3,
//                 cd: 1000
//             }));
//             //木棍数目
//             this.stickNum = this.addGameObject(new Num(260, 100, 5, '*' + this.stickTool.count.toString(), Num.Textures.small, {
//                 align: Num.ALIGN.RIGHT,
//                 valign: Num.VALIGN.BOTTOM
//             }));
//             //骨头
//             this.boneTool = this.addGameObject(new Tools(260, 30, 4, {
//                 type: Tools.TYPE.Bone,
//                 texture: Tools.Textures.bone,
//                 count: 3,
//                 cd: 1000
//             }));
//             //骨头数目
//             this.boneNum = this.addGameObject(new Num(330, 100, 5, '*' + this.boneTool.count.toString(), Num.Textures.small, {
//                 align: Num.ALIGN.RIGHT,
//                 valign: Num.VALIGN.BOTTOM
//             }));
//             //血条背景
//             this.bloodBg = this.addGameObject(new Label(500, 30, 3, Label.Textures.bloodBg));
//             //血条
//             this.blood = this.addGameObject(new Label(510, 45, 4, Label.Textures.blood));
//             //菜单按钮
//             this.menuButton = this.addGameObject(new Button(0, 620, 3, Button.Textures.menuButton));
//             //暂停按钮
//             this.stopButton = this.addGameObject(new Button(100, 620, 3, Button.Textures.stopButton));
//             //萝卜车
//             this.carrot = this.addGameObject(new Carrot(-50, 400, 3));
//             //狗狗
//             this.dogs = [];
//             //当前使用道具
//             this.currentTool = Tools.TYPE.Stone;
//             //当前已经走过长度
//             this.currentLength = 0;
//             //目标长度
//             this.targetLength = 8000;
//             //游戏分数
//             this.sumScore = 0;
//             //显示分数背景
//             this.scoreBg = this.addGameObject(new Label(900, 610, 3, Label.Textures.scoreBg));
//             //分数
//             this.score = this.addGameObject(new Num(1050, 620, 4, this.sumScore.toString(), Num.Textures.big));
//             //成功过关画面
//             this.success = null;
//             //过关失败画面
//             this.fail = null;
//         },
//         update: function() {
//             if (this.success || this.fail) {
//                 YI.stop();
//                 return;
//             }
//             this.super();
//             this.currentLength += this.bg2.speed.x / YI.fps;
//             if (this.currentLength >= this.targetLength) {
//                 this.success = this.addGameObject(new Background(128, 0, 6, Background.Textures.success));
//             }
//             //处理出现狗狗
//             var r = Math.random();
//             var dog;
//             if (r < 0.3 / YI.fps) {
//                 if (r < 0.1 / YI.fps) {
//                     dog = this.addGameObject(new Dog1(YI.width, 500, this.dogs.length + 5));
//                     this.dogs.push(dog);
//                 } else {
//                     if (r < 0.2 / YI.fps) {
//                         dog = this.addGameObject(new Dog2(YI.width, 500, this.dogs.length + 5));
//                         this.dogs.push(dog);
//                     } else {
//                         dog = this.addGameObject(new Dog3(YI.width, 450, this.dogs.length + 5));
//                         this.dogs.push(dog);
//                     }
//                 }
//             }
//         },
//         handleEvent: function() {
//             var o = Event.getChooseObject();
//             if (Event.currentEvent == Event.type.tap) {
//                 if (this.fail || this.success) {
//                     YI.jumpToScene(YI.Scene.Menu);
//                     YI.start();
//                     return;
//                 }
//                 //如果点击了道具
//                 if (o instanceof Tools) {
//                     this.currentTool = o.type;
//                 }
//                 //如果点击了菜单
//                 if (o == this.menuButton) {
//                     YI.jumpToScene(YI.Scene.Menu);
//                 }
//                 //如果点击了暂停
//                 if (o == this.stopButton) {
//                     if (YI.running) {
//                         YI.stop();
//                     } else {
//                         YI.start();
//                     }
//                 }
//                 //如果点击了狗狗，同时狗狗正在奔跑
//                 if (o instanceof Dog && o.currentAnimation == o.animations.run) {
//                     //如果当前使用石头，同时石头还有数量，则从萝卜车里面扔出石头到点击的位置
//                     if (this.currentTool == Tools.TYPE.Stone) {
//                         if (this.stoneTool.count) {
//                             this.carrot.throwStone(Event.Mouses[Event.mouseNum - 1].x, Event.Mouses[Event.mouseNum - 1].y, o.z);
//                             this.stoneTool.count--;
//                             this.stoneNum.setNum('*' + this.stoneTool.count.toString());
//                         }
//                     }
//                     //如果当前使用骨头，同时石头还有数量，则从萝卜车里面扔出骨头到点击的位置
//                     if (this.currentTool == Tools.TYPE.Bone) {
//                         if (this.boneTool.count) {
//                             this.carrot.throwBone(Event.Mouses[Event.mouseNum - 1].x, Event.Mouses[Event.mouseNum - 1].y, o.z);
//                             this.boneTool.count--;
//                             this.boneNum.setNum('*' + this.boneTool.count.toString());
//                         }
//                     }
//                     //如果当前使用木棍，同时木棍还有数量，则从萝卜车里面挥赶木棍到点击的狗狗
//                     if (this.currentTool == Tools.TYPE.Stick) {
//                         if (this.stickTool.count) {
//                             this.carrot.throwStick(o, o.z);
//                             this.stickTool.count--;
//                             this.stickNum.setNum('*' + this.stickTool.count.toString());
//                         }
//                     }
//                 }
//             }
//             this.super();
//         }
//     });
// });