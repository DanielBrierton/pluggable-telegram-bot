var config = require('./config.json'),
    PluggableTelegramBot = require('./src/PluggableTelegramBot');

PluggableTelegramBot.start(config);