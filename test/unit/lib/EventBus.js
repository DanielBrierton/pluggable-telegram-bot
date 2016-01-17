var expect = require("chai").expect;
var sinon = require("sinon");

var EventBus = require('../../../src/lib/EventBus');
var uuidGenerator = require('uuid');

describe('EventBus', function () {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        EventBus._subscribers = {};
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('subscribe()', function () {
        it('should add the event to the _subscribers and return a uuid', function () {
            // ARRANGE
            var uuid = 'uuid';
            var eventName = 'eventName';
            var callback = function () {};
            var context = {};
            sandbox.stub(uuidGenerator, 'v4');
            uuidGenerator.v4.returns('uuid');

            // ACT
            var result = EventBus.subscribe(eventName, callback, context);

            // ASSERT
            expect(EventBus._subscribers[eventName][uuid].callback).to.equal(callback);
            expect(EventBus._subscribers[eventName][uuid].context).to.equal(context);
            expect(result).to.equal(uuid);
        });
    });

    describe('publish()', function () {
        beforeEach(function () {
            // ARRANGE
            EventBus._subscribers = {
                'eventName': {
                    'uuid1': {
                        callback: sandbox.spy(),
                        context: this
                    },
                    'uuid2': {
                        callback: sandbox.spy(),
                        context: {}
                    }
                },
                'otherEventName': {
                    'uuid3': {
                        callback: sandbox.spy(),
                        context: this
                    }
                }
            };
        });

        it('should execute each function in the subscribers for the given eventName', function () {
            // ACT
            EventBus.publish('eventName', 'arg1', 'arg2');

            // ASSERT
            expect(EventBus._subscribers.eventName.uuid1.callback.callCount).to.equal(1);
            expect(EventBus._subscribers.eventName.uuid1.callback.getCall(0).calledWith(
                'arg1', 'arg2'
            )).to.equal(true);
            expect(EventBus._subscribers.eventName.uuid2.callback.callCount).to.equal(1);
            expect(EventBus._subscribers.eventName.uuid2.callback.getCall(0).calledWith(
                'arg1', 'arg2'
            )).to.equal(true);
            expect(EventBus._subscribers.otherEventName.uuid3.callback.callCount).to.equal(0);
        });

        it('should execute nothing in the subscribers if the eventName doesnt match', function () {
            // ACT
            EventBus.publish('thirdEventName', 'arg1', 'arg2');

            // ASSERT
            expect(EventBus._subscribers.eventName.uuid1.callback.callCount).to.equal(0);
            expect(EventBus._subscribers.eventName.uuid2.callback.callCount).to.equal(0);
            expect(EventBus._subscribers.otherEventName.uuid3.callback.callCount).to.equal(0);
        });
    });

    describe('unsubscribe()', function () {
        beforeEach(function () {
            // ARRANGE
            EventBus._subscribers = {
                'eventName': {
                    'uuid1': {},
                    'uuid2': {}
                },
                'otherEventName': {
                    'uuid3': {}
                }
            };
        });

        it('should delete the event with the name and uuid if it exists', function () {
            // ACT
            EventBus.unsubscribe('eventName', 'uuid2');

            // ASSERT
            expect(EventBus._subscribers).to.deep.equal({
                'eventName': {
                    'uuid1': {}
                },
                'otherEventName': {
                    'uuid3': {}
                }
            });
        });

        it('should do nothing if theres no matching eventName', function () {
            // ACT
            EventBus.unsubscribe('thirdEventName', 'uuid4');

            // ASSERT
            expect(EventBus._subscribers).to.deep.equal({
                'eventName': {
                    'uuid1': {},
                    'uuid2': {}
                },
                'otherEventName': {
                    'uuid3': {}
                }
            });
        });

        it('should do nothing if eventName matches, but theres no matching uuid', function () {
            // ACT
            EventBus.unsubscribe('eventName', 'uuid4');

            // ASSERT
            expect(EventBus._subscribers).to.deep.equal({
                'eventName': {
                    'uuid1': {},
                    'uuid2': {}
                },
                'otherEventName': {
                    'uuid3': {}
                }
            });
        });
    });
});
