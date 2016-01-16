var uuidGenerator = require('uuid');

var EventBus = {
    _subscribers: {},

    subscribe: function (eventName, callback, context) {
        var uuid = uuidGenerator.v4();
        if (!this._subscribers[eventName]) {
            this._subscribers[eventName] = {};
        }
        this._subscribers[eventName][uuid] = {
            callback: callback,
            context: context || this
        };
    },

    publish: function (eventName) {
        if (this._subscribers[eventName]) {
            for (var uuid in this._subscribers[eventName]) {
                var event = this._subscribers[eventName][uuid];
                event.callback.apply(event.context, Array.prototype.slice.call(arguments, 1));
            }
        }
    },

    unsubscribe: function (eventName, uuid) {
        if (this._subscribers[eventName] && this._subscribers[eventName][uuid]) {
            delete this._subscribers[eventName][uuid];
        }
    }
};

module.exports = EventBus;