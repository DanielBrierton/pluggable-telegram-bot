/**
 * Base class for Telegram bot plugins
 *
 * @class TelegramBotPlugin
 */
var TelegramBotPlugin = function (options) {
    this._eventBus = options.eventBus;
    this.bot = options.bot;
    this._isMessageDestination = false;

    this._eventBus.subscribe('removeMessageDestinations', this.removeAsMessageDestination.bind(this));
    this._eventBus.subscribe('message', this._onMessage.bind(this));
    this.init()
};

TelegramBotPlugin.prototype = {
    /**
     * Should be overridden and return a map of regex to functions to define commands for the plugin.
     *
     * @method commands
     * @return {Object} map of command regex to functions
     */
    commands: function () {
        return {};
    },

    /**
     * Called when the plugin is initialised.
     *
     * @method init
     */
    init: function () {},

    /**
     * Called when plugin is current message destination and a message is sent to the bot.
     *
     * @method onMessage
     */
    onMessage: function () {},

    /**
     * Set the current plugin as the message destination, and remove all other plugins as message destinations.
     *
     * @method setAsMessageDestination
     */
    setAsMessageDestination: function () {
        this._eventBus.publish('removeMessageDestinations');
        this._isMessageDestination = true;
    },

    /**
     * Remove the current plugin as the message destination.
     *
     * @method removeAsMessageDestination
     */
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

/**
 * Used for extending the class.
 *
 * @method extend
 * @param {Object} methods to be added to the newly defined class.
 * @return {Function} The new class after extending.
 */
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