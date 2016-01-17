var expect = require("chai").expect;
var sinon = require("sinon");

var SampleBot = require('../../../src/bots/SampleBot');
var EventBus = require('../../../src/lib/EventBus');

describe('SampleBot', function () {
    var sandbox, objectUnderTest;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        objectUnderTest = new SampleBot({
            eventBus: EventBus
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('commands()', function () {
        describe('\\/msg (.+)', function () {
            it('should send a message containing the username and the sent message', function () {
                // ARRANGE
                var msg = {
                    from: {
                        id: '123',
                        username: 'pluggable_telegram_bot'
                    },
                    text: '/msg Test Message'
                };
                var matches = ['/msg Test Message', 'Test Message'];
                objectUnderTest.bot = sandbox.stub({
                    sendMessage: function () {}
                });
                objectUnderTest.bot.sendMessage.returns({
                    then: function (callback) {
                        callback();
                    }
                });
                sandbox.stub(objectUnderTest, 'setAsMessageDestination');

                // ACT
                objectUnderTest.commands()['\\/msg (.+)'](msg, matches);

                // ASSERT
                expect(objectUnderTest.bot.sendMessage.callCount).to.equal(1);
                expect(objectUnderTest.bot.sendMessage.getCall(0).calledWith(
                    '123',
                    'Hello pluggable_telegram_bot!\n\nThanks for your message, "Test Message"',
                    {
                        'parse_mode': 'Markdown',
                        'selective': 2
                    }
                )).to.equal(true);
                expect(objectUnderTest.setAsMessageDestination.callCount).to.equal(1);
            });
        });
    });

    describe('onMessage()', function () {
        it('should respond with a message containing the original message', function () {
            // ARRANGE
            var msg = {
                from: {
                    id: '123'
                },
                text: 'Test Message'
            };
            objectUnderTest.bot = sandbox.stub({
                sendMessage: function () {}
            });
            objectUnderTest.bot.sendMessage.returns({
                then: function (callback) {
                    callback();
                }
            });
            sandbox.stub(objectUnderTest, 'removeAsMessageDestination');

            // ACT
            objectUnderTest.onMessage(msg);

            // ASSERT
            expect(objectUnderTest.bot.sendMessage.callCount).to.equal(1);
            expect(objectUnderTest.bot.sendMessage.getCall(0).calledWith(
                '123',
                'Thanks for the follow-up message, "Test Message"',
                {
                    'parse_mode': 'Markdown',
                    'selective': 2
                }
            )).to.equal(true);
            expect(objectUnderTest.removeAsMessageDestination.callCount).to.equal(1);
        });

    });
});