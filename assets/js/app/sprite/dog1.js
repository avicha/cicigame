/**
 * @author lbc
 */
YI.package('game.sprite').module('dog1').import('game.sprite.dog').define(function() {
    Dog1 = Dog.extend({
        texture: new Texture('dog1.png', 1, 12),
        speed: new Vector2(-120, 0),
        score: 20,
        bear: 2
    });
});