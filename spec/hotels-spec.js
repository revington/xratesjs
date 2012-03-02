/**
 * specs for hotels
 */
var vows = require('vows'),
    assert = require('assert'),
    xrates = require('../lib/xratesjs'),
    easyHotel = require('../spec/hotel-rates').easyHotel,
    context = {};
context.normal = {
    date: new Date(2011, 1, 15),
    pax: [null, null, 5, 7],
    checkin: new Date(2011, 4, 29),
    checkout: new Date(2011, 5, 2)
};
vows.describe('xrates').addBatch({
    'With the following rates for the single room: \n\tPax policy\n\t\t- pax ad (this is the default pax) 12 ~ ∞\n\t\t- bb 0 ~ 1\n\t\t- ch 2,11 \n\tSeasons:\n\t\t- from 1/1/11 till 01/03/11 price is 2 units PPPN\n\t\t- from 02/03/11 till 31/05/11 price is 4 units PPPN\n\t\t- from 01/06/11 till 31/12/11 price is 8 units PPPN\n\tDiscounts:\n\t\t- early booking 10% if 30 days in advance\n\t\t- first children 100%\n\t\t- secon children 50%\n\tSurcharge:\n\t\t- 18% vat for all bookings\n~~~~~~~~~~~\n A reservation made on 15/2/11 from 29/05/11 till 2/06/11 for pax ?,?,5,7:': {
        topic: function () {
            var ret = xrates.Processor.process(easyHotel, context.normal);
            return ret;
        },
        'Must have one product': function (topic) {
            assert.strictEqual(topic.products.length, 1);
        },
        'First three nights "season 2" rate will be applied to all pax': function (topic) {
            var x = topic.products[0].applied[0].units;
            var i, length = 3 * 4,
                // 3 nights by 4 pax
                curr;
            for (i = 0; i < length; i++) {
                curr = x[i];
                assert.strictEqual(curr.rules[0].id, 'rates season 2');
            }
        },
        'Last night "season 3" rate will be applied to all pax': function (topic) {
            var x = topic.products[0].applied[0].units;
            var i, length, curr;
            for (i = 3 * 4, length = x.length; i < length; i++) {
                curr = x[i];
                assert.strictEqual(curr.rules[0].id, 'rates season 3');
            }
        },
        'An early booking discount must be applied for each night': function (topic) {
            var x = topic.products[0].applied[0].units,
                i, // 4 nights by 4 
                paxlength = 4 * 4,
                curr,
		length;
            for (i = 0,length = x.lengt; i < length; i++) {
                curr = x[i];
                assert.strictEqual(curr.rules[1].id, 'early booking');
            }
        },
        'Vat must be applied': function (topic) {
            assert.strictEqual(topic.products[0].applied[1].units[0].rules[0].id, 'vat');
        }
    }
}).export(module);
