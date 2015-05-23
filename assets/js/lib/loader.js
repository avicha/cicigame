/**
 * @author lbc
 */
define(['lib/class'], function(Class) {
    var Loader = Class.extend({
        loaded: 0,
        sum: 0,
        addResources: function(resources) {
            this._resources = resources;
            return this;
        },
        load: function() {
            var self = this;
            for (var key in this._resources) {
                self.sum++;
                resource = self._resources[key];
                resource.load(function(err) {
                    if (!err) {
                        self.loaded++;
                        self.trigger('progressUpdate', self.loaded / self.sum);
                        if (self.loaded === self.sum) {
                            self.trigger('progressComplete');
                        }
                    } else {
                        self.trigger('progressError', resource, err);
                    }
                });
            }
        }
    });
    return Loader;
});