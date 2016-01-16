# pluggable-telegram-bot
Pluggable Telegram Bot written in Node.

[![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]

A work in progress framework for writing Telegram bot plugins in Node.js. The purpose of this is to allow users to
combine multiple Telegram bot back-ends to run on one Telegram bot without them conflicting.

## Usage
Copy config.template.json to config.json and add your Telegram bot token to it, then run:

    node index.js

[travis-image]: https://travis-ci.org/DanielBrierton/pluggable-telegram-bot.svg?branch=master
[travis-url]: https://travis-ci.org/DanielBrierton/pluggable-telegram-bot

[coveralls-image]: https://coveralls.io/repos/DanielBrierton/pluggable-telegram-bot/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/DanielBrierton/pluggable-telegram-bot?branch=master