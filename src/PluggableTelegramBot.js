var PluggableTelegramBot = {
    start: function (config) {
        var TelegramBot = require('node-telegram-bot-api');
        var eventBus = require('./lib/EventBus');

        var bot = new TelegramBot(config.telegram.token, {
            polling: true
        });

        var botPlugins = [];

        config.enabledBots.forEach(function (botName) {
            var BotPlugin = require('./bots/' + botName);
            botPlugins.push(new BotPlugin({
                bot: bot,
                eventBus: eventBus
            }));
        });

        bot.on('message', function (msg) {
            eventBus.publish('message', msg);
        });
    }
};

module.exports = PluggableTelegramBot;