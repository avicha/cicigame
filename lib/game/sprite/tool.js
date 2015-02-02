/**
 * @author lbc
 */
YI.package('game.sprite').module('tool').import('engine.sprite').define(function() {
    Tools = Sprite.extend({
        //道具数量，-1表示无限
        count: 0,
        cd: 0,
        type: 0
    });
    Tools.TYPE = {
        None: 0,
        Stone: 1,
        Bone: 2,
        Stick: 3
    };
    Tools.Textures = {
        //道具图片
        stone: new Texture('thing1.png'),
        stick: new Texture('thing2.png'),
        bone: new Texture('thing3.png')
    };
});