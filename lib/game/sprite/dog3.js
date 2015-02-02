/**
 * @author lbc
 */
YI.package('game.sprite').module('dog3').import('game.sprite.dog').define(function() {
    Dog3 = Dog.extend({
        texture: new Texture('dog3.png', 1, 12),
        speed: new Vector2(-120, 0),
        score: 50,
        bear: 4
    });
});