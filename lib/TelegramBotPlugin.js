var TelegramBotPlugin = function (options) {
    this._eventBus = options.eventBus;
    this.bot = options.bot;
    this._isMessageDestination = false;

    this._eventBus.subscribe('removeMessageDestinations', this.removeAsMessageDestination.bind(this));
    this._eventBus.subscribe('message', this._onMessage.bind(this));
    this.init(options)
};

TelegramBotPlugin.prototype = {
    commands: {},

    init: function () {},

    onMessage: function () {},

    setAsMessageDestination: function () {
        this._eventBus.publish('removeMessageDestinations');
        this._isMessageDestination = true;
    },

    removeAsMessageDestination: function () {
        this._isMessageDestination = false;
    },

    _onMessage: function (msg) {
        this._execCommand(msg);
        if (this._isMessageDestination) {
            this.onMessage(msg);
        }
    },

    _execCommand: function (msg) {
        var commands = this.commands();
        for (var command in commands) {
            var commandRegex = new RegExp(command, 'i');
            var matches = commandRegex.exec(msg.text);
            if (matches) {
                commands[command](msg, matches);
            }
        }
    },

    _register: function (currentCommands) {
        var commands = Object.keys(this.commands());
        commands.forEach(function (command) {
            if (currentCommands.indexOf(command) > -1) {
                throw new Error('Command "' + command + '" is a duplicate');
            }
        });
    }
};

TelegramBotPlugin.extend = function (obj) {
    var superClass = this;
    var subClass = function () {
        superClass.apply(this, arguments);
    };

    var Surrogate = function () {
        this.constructor = subClass;
    };

    Surrogate.prototype = superClass.prototype;
    subClass.prototype = new Surrogate();

    for (var prop in obj) {
        if (prop) {
            subClass.prototype[prop] = obj[prop];
        }
    }

    subClass.__super__ = superClass.prototype;

    return subClass;
};

module.exports = TelegramBotPlugin;