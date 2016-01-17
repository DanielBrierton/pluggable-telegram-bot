var uuidGenerator = require('uuid');

var EventBus = {
    _subscribers: {},

    /**
     * Subscribe to an event
     *
     * @method subscribe
     * @param {String} eventName
     * @param {Function} callback
     * @param {Object} context
     * @return {String} uuid
     */
    subscribe: function (eventName, callback, context) {
        var uuid = uuidGenerator.v4();
        if (!this._subscribers[eventName]) {
            this._subscribers[eventName] = {};
        }
        this._subscribers[eventName][uuid] = {
            callback: callback,
            context: context || this
        };
        return uuid;
    },

    /**
     * Publish an event of a given name. All subsequent parameters are passed to the event callback(s)
     *
     * @method publish
     * @param {String} eventName
     */
    publish: function (eventName) {
        if (this._subscribers[eventName]) {
            for (var uuid in this._subscribers[eventName]) {
                var event = this._subscribers[eventName][uuid];
                event.callback.apply(event.context, Array.prototype.slice.call(arguments, 1));
            }
        }
    },

    /**
     * Unsubscribe from an event with a given uuid
     *
     * @method unsubscribe
     * @param {String} eventName
     * @param {String} uuid
     */
    unsubscribe: function (eventName, uuid) {
        if (this._subscribers[eventName] && this._subscribers[eventName][uuid]) {
            delete this._subscribers[eventName][uuid];
        }
    }
};

module.exports = EventBus;