/**
 * @author lbc
 */
define(['app/sprite/dog', 'lib/shape/vector2'], function(Dog, Vector2) {
    var Dog2 = Dog.extend({
        speed: new Vector2(-120, 0),
        score: 50,
        bear: 4
    });
    return Dog2;
});