var vows = require('vows'),
    assert = require('assert'),
    computables = require('../lib/computables.js'),
    suite = vows.describe('computables');
suite.addBatch({
    'getPerDay': {
        'With a defined and consecutive checkin and check out': {
            topic: computables.getPerDay({
                checkin: new Date(2011, 0, 1),
                checkout: new Date(2011, 0, 5)
            }),
            'Must return an ordered array with the range of days from checkin to checkout': function (topic) {
                var i, lengt;
                assert.strictEqual(topic.length, 5);
                for (i = 0, length = topic.length; i < length; i++) {
                    assert.strictEqual(topic[i].valueOf(), new Date(2011, 0, i + 1).valueOf());
                }
            }
        },
        'If checkin and checkout is same day ': {
            topic: computables.getPerDay({
                checkin: new Date(2011, 0, 1),
                checkout: new Date(2011, 0, 1)
            }),
            'Must return an array with this day': function (topic) {
                assert.strictEqual(topic.length, 1);
                assert.strictEqual(topic[0].valueOf(), new Date(2011, 0, 1).valueOf());
            }
        }
    }
});
suite.addBatch({
    'getPerNight': {
        'With a defined and consecutive checkin and check out': {
            topic: computables.getPerNight({
                checkin: new Date(2011, 0, 1),
                checkout: new Date(2011, 0, 5)
            }),
            'Must return an ordered array with the range of days from checkin to checkout': function (topic) {
                assert.strictEqual(topic.length, 4);
                for (i = 0, length = topic.length; i < length; i++) {
                    assert.strictEqual(topic[i].valueOf(), new Date(2011, 0, i + 1).valueOf());
                }
            }
        },
        'If checkin and checkout is same day ': {
            topic: computables.getPerNight({
                checkin: new Date(2011, 0, 1),
                checkout: new Date(2011, 0, 1)
            }),
            'Must return an empty array': function (topic) {
                assert.strictEqual(topic.length, 0);
            }
        }
    }
});
suite.addBatch({
    'Once': {
        topic: computables.getOnce(),
        'must return an array with one elment': function (topic) {
            assert.strictEqual(topic.length, 1);
        }
    }
});
suite.export(module);
