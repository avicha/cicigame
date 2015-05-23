/**
 * @author lbc
 */
define(['app/sprite/dog', 'lib/shape/vector2'], function(Dog, Vector2) {
    var Dog2 = Dog.extend({
        speed: new Vector2(-120, 0),
        score: 35,
        bear: 3
    });
    return Dog2;
});