var assert = require('assert'),
    vows = require('vows'),
    _ = require('underscore'),
    t = require('../lib/testeables');
var suite = vows.describe('testeables');
suite.addBatch({
    'testeables.compareDates': {
        'Must match when a night is in range': function () {
            var from = new Date(2012, 0, 1),
                to = new Date(2012, 0, 6),
                op = '==',
                duration = 'P5D';
            assert.strictEqual(t.compareDates(from, to, duration, op), true);
        }
    }
});
suite.addBatch({
    'testeables.nigthInRange': {
        'Must match when a night is in range': function () {
            var rangeFrom = new Date(2012, 0, 1),
                rangeTo = new Date(2012, 2, 1),
                night = new Date(2012, 1, 1);
            assert.strictEqual(t.nightInRange(rangeFrom, rangeTo, night), true);
        },
        'Must not match when a night is out of range': function () {
            var rangeFrom = new Date(2012, 0, 1),
                rangeTo = new Date(2012, 2, 1),
                night = new Date(2012, 3, 1);
            assert.strictEqual(t.nightInRange(rangeFrom, rangeTo, night), false);
        }
    }
});
suite.addBatch({
    'testeables.countPax': {
        'When no pax type is specified test pax amount': function () {
            var pax = [{
                paxType: 'AD',
                typeCount: 1,
                count: 1
            }, {
                paxType: 'AD',
                typeCount: 2,
                count: 2
            }, {
                paxType: 'AD',
                typeCount: 3,
                count: 3
            }];
            assert.strictEqual(t.countPax({
                op: '==',
                value: 3
            }, pax), true);
        },
        'When pax type is specified test just with that pax type': function () {
            var pax = [{
                paxType: 'AD',
                typeCount: 1,
                count: 1
            }, {
                paxType: 'AD',
                typeCount: 2,
                count: 2
            }, {
                paxType: 'CH',
                typeCount: 1,
                count: 3
            }];
            assert.strictEqual(t.countPax({
                op: '>',
                type: 'AD',
                value: 1
            }, pax), true);
            assert.strictEqual(t.countPax({
                type: 'AD',
                op: '==',
                value: 3
            }, pax), false);
        }
    }
});
suite.export(module);
