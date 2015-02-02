/**
 * @author lbc
 */
YI.package('game.sprite').module('dog2').import('game.sprite.dog').define(function() {
    Dog2 = Dog.extend({
        texture: new Texture('dog2.png', 1, 12),
        speed: new Vector2(-120, 0),
        score: 35,
        bear: 3
    });
});