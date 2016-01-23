var expect = require("chai").expect;
var sinon = require("sinon");
var proxyquire = require('proxyquire');

var TelegramBotAPIStub;

describe('PluggableTelegramBot', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    it('start()', function () {
        // ARRANGE
        TelegramBotAPIStub = sandbox.spy();
        TelegramBotAPIStub.prototype.on = function (eventName, callback) {
            callback('msg');
        };
        sandbox.spy(TelegramBotAPIStub.prototype, 'on');
        var configMock = {
            telegram: {
                token: '123'
            },
            enabledBots: [
                'SampleBot'
            ]
        };

        var EventBusStub = {
            publish: function () {}
        };
        sandbox.spy(EventBusStub, 'publish');
        var SampleBotStub = sandbox.spy();

        var PluggableTelegramBot = proxyquire('../../src/PluggableTelegramBot', {
            'node-telegram-bot-api': TelegramBotAPIStub,
            './lib/EventBus': EventBusStub,
            './bots/SampleBot': SampleBotStub
        });

        // ACT
        PluggableTelegramBot.start(configMock);

        // ASSERT
        expect(TelegramBotAPIStub.callCount).to.equal(1);
        expect(TelegramBotAPIStub.getCall(0).calledWith('123', {
            polling: true
        })).to.equal(true);
        expect(SampleBotStub.callCount).to.equal(1);
        expect(SampleBotStub.getCall(0).args[0].eventBus).to.equal(EventBusStub);
        expect(SampleBotStub.getCall(0).args[0].bot instanceof TelegramBotAPIStub).to.equal(true);
        expect(TelegramBotAPIStub.prototype.on.callCount).to.equal(1);
        expect(TelegramBotAPIStub.prototype.on.getCall(0).calledWith('message')).to.equal(true);
        expect(EventBusStub.publish.callCount).to.equal(1);
        expect(EventBusStub.publish.getCall(0).calledWith('message', 'msg')).to.equal(true);
    });
});