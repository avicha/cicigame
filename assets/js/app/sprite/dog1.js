/**
 * @author lbc
 */
define(['app/sprite/dog', 'lib/shape/vector2'], function(Dog, Vector2) {
    var Dog1 = Dog.extend({
        speed: new Vector2(-120, 0),
        score: 20,
        bear: 2
    });
    return Dog1;
});