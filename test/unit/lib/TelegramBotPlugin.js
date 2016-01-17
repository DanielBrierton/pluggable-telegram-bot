var expect = require("chai").expect;
var sinon = require("sinon");

var TelegramBotPlugin = require('../../../src/lib/TelegramBotPlugin');

describe('TelegramBotPlugin', function () {
    var sandbox, eventBusStub, objectUnderTest;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        eventBusStub = sinon.stub({
            subscribe: function () {},
            publish: function () {}
        });
        objectUnderTest = new TelegramBotPlugin({
            eventBus: eventBusStub,
            bot: 'bot'
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('constructor', function () {
        it('should set the eventBus and bot, bind events and call init', function () {
            // ARRANGE
            sandbox.stub(TelegramBotPlugin.prototype, 'init');
            eventBusStub.subscribe.reset();

            // ACT
            var telegramBotPlugin = new TelegramBotPlugin({
                eventBus: eventBusStub,
                bot: 'bot'
            });

            // ASSERT
            expect(telegramBotPlugin._eventBus).to.equal(eventBusStub);
            expect(telegramBotPlugin.bot).to.equal('bot');
            expect(telegramBotPlugin._isMessageDestination).to.equal(false);
            expect(eventBusStub.subscribe.callCount).to.equal(2);
            expect(eventBusStub.subscribe.getCall(0).calledWith(
                'removeMessageDestinations', telegramBotPlugin.removeAsMessageDestination, telegramBotPlugin
            )).to.equal(true);
            expect(eventBusStub.subscribe.getCall(1).calledWith(
                'message', telegramBotPlugin._onMessage, telegramBotPlugin
            )).to.equal(true);
            expect(telegramBotPlugin.init.callCount).to.equal(1);
        });
    });

    describe('setAsMessageDestination()', function () {
        it('should publish a removeMessageDestinations event, and set _isMessageDestination to true', function () {
            // ARRANGE
            objectUnderTest._isMessageDestination = false;

            // ACT
            objectUnderTest.setAsMessageDestination();

            // ASSERT
            expect(eventBusStub.publish.callCount).to.equal(1);
            expect(eventBusStub.publish.getCall(0).calledWith('removeMessageDestinations')).to.equal(true);
            expect(objectUnderTest._isMessageDestination).to.equal(true);
        });
    });

    describe('removeAsMessageDestination()', function () {
        it('should set _isMessageDestination to false', function () {
            // ARRANGE
            objectUnderTest._isMessageDestination = true;

            // ACT
            objectUnderTest.removeAsMessageDestination();

            // ASSERT
            expect(objectUnderTest._isMessageDestination).to.equal(false);
        });
    });

    describe('_onMessage', function () {
        var msg;

        beforeEach(function () {
            // ARRANGE
            sinon.stub(objectUnderTest, '_execCommand');
            sinon.stub(objectUnderTest, 'onMessage');
            msg = 'msg';
        });

        it('should call _execCommand and onMessage if _isMessageDestination is true', function () {
            // ARRANGE
            objectUnderTest._isMessageDestination = true;

            // ACT
            objectUnderTest._onMessage(msg);

            // ASSERT
            expect(objectUnderTest._execCommand.callCount).to.equal(1);
            expect(objectUnderTest._execCommand.getCall(0).calledWith(msg)).to.equal(true);
            expect(objectUnderTest.onMessage.callCount).to.equal(1);
            expect(objectUnderTest.onMessage.getCall(0).calledWith(msg)).to.equal(true);
        });

        it('should only call _execCommand if _isMessageDestination is false', function () {
            // ARRANGE
            objectUnderTest._isMessageDestination = false;

            // ACT
            objectUnderTest._onMessage(msg);

            // ASSERT
            expect(objectUnderTest._execCommand.callCount).to.equal(1);
            expect(objectUnderTest._execCommand.getCall(0).calledWith(msg)).to.equal(true);
            expect(objectUnderTest.onMessage.callCount).to.equal(0);

        });
    });

    describe('_execCommand()', function () {
        it('should execute coommands that match, and not those that dont', function () {
            // ARRANGE
            var commands = sandbox.stub({
                '\\/test (.+)': function () {},
                '\\/otherCmd (.+)': function () {}
            });
            sinon.stub(objectUnderTest, 'commands');
            objectUnderTest.commands.returns(commands);
            var msg = {
                text: '/test Message'
            };

            // ACT
            objectUnderTest._execCommand(msg);

            // ASSERT
            expect(commands['\\/test (.+)'].callCount).to.equal(1);
            expect(commands['\\/test (.+)'].getCall(0).calledWith(
                msg, msg.text.match(/\/test (.+)/i)
            )).to.equal(true);
            expect(commands['\\/otherCmd (.+)'].callCount).to.equal(0);
        });
    });

    describe('_register()', function () {
        beforeEach(function () {
            // ARRANGE
            var commands = sandbox.stub({
                '\\/test (.+)': function () {},
                '\\/otherCmd (.+)': function () {}
            });
            sinon.stub(objectUnderTest, 'commands');
            objectUnderTest.commands.returns(commands);
        });

        it('should throw an error if there is already a command registered with same pattern', function (done) {
            // ACT + ASSERT
            try {
                objectUnderTest._register(['\\/test (.+)']);
            } catch (e) {
                expect(e.message).to.equal('Command "\\/test (.+)" is a duplicate');
                done();
            }
        });
    });
});