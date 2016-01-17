var TelegramBotPlugin = require('../lib/TelegramBotPlugin');

var SampleBot = TelegramBotPlugin.extend({
    commands: function () {
        return {
            "\\/msg (.+)": function (msg, matches) {
                var response = ['Hello ' + (msg.from.username || msg.from.first_name) + '!'];
                response.push('\nThanks for your message, "' + matches[1] + '"');

                this.bot.sendMessage(msg.from.id, response.join('\n'), {
                    'parse_mode': 'Markdown',
                    'selective': 2
                }).then(function () {
                    this.setAsMessageDestination();
                }.bind(this));
            }.bind(this)
        };
    },

    onMessage: function (msg) {
        var response = 'Thanks for the follow-up message, "' + msg.text + '"';
        this.bot.sendMessage(msg.from.id, response, {
            'parse_mode': 'Markdown',
            'selective': 2,
        }).then(function () {
            this.removeAsMessageDestination();
        }.bind(this));
    }
});

module.exports = SampleBot;