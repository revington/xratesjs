/**
 * specs for hotels
 */
var vows = require('vows'),
    assert = require('assert'),
    xrates = require('../lib/xratesjs'),
    hotelRates = require('../spec/hotel-rates'),
    _ = require('underscore'),
    context = {};
context.normal = {
    date: new Date(2011, 1, 15),
    pax: [null, null, 5, 7],
    checkin: new Date(2011, 4, 29),
    checkout: new Date(2011, 5, 2)
};

function changePropName(target, replace, input) {
    input.replace = input.target;
    delete input.target;
    return input;
}

function summarize(rates) {
    var ret = [];
    _.each(rates.products, function (p) {
        ret.push(p.name);
        var r = p.rates;
        while (!_.isUndefined(r)) {
            ret.push(r.ref);
            r = r.children;
        }
    });
    return ret.join('\n');
}
var suite = vows.describe('xrates');
suite.addBatch({
    'With the following rates for the single room: \n\tPax policy\n\t\t- pax ad (this is the default pax) 12 ~ ∞\n\t\t- bb 0 ~ 1\n\t\t- ch 2,11 \n\tSeasons:\n\t\t- from 1/1/11 till 01/03/11 price is 2 units PPPN\n\t\t- from 02/03/11 till 31/05/11 price is 4 units PPPN\n\t\t- from 01/06/11 till 31/12/11 price is 8 units PPPN\n\tDiscounts:\n\t\t- early booking 10% if 30 days in advance\n\t\t- first children 100%\n\t\t- secon children 50%\n\tSurcharge:\n\t\t- 18% vat for all bookings\n~~~~~~~~~~~\n A reservation made on 15/2/11 from 29/05/11 till 2/06/11 for pax ?,?,5,7:': {
        topic: function () {
            var ret = xrates.Processor.process(hotelRates.easyHotel, context.normal);
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
        'First children has a 100% discount each night': function (topic) {
            var firstChildNights = _.map(_.filter(topic.products[0].applied, function (applied) {
                return applied.frequencyType === 'PerNight' && applied.unitType === 'PerPerson';
            }), function (applied) {
                return _.filter(applied.units, function (unit) {
                    return unit.unit.paxType === 'CH' && unit.unit.typeCount === 1;
                });
            });
            var discountsLeft = 4;
            var discounts = _.filter(_.flatten(_.pluck(_.flatten(firstChildNights), 'rules')), function (x) {
                return x.id === 'first child discount';
            });
            assert.strictEqual(discounts.length, discountsLeft);
        },
        'Second children has a 50% discount each night': function (topic) {
            var secondChildNights = _.map(_.filter(topic.products[0].applied, function (applied) {
                return applied.frequencyType === 'PerNight' && applied.unitType === 'PerPerson';
            }), function (applied) {
                return _.filter(applied.units, function (unit) {
                    return unit.unit.paxType === 'CH' && unit.unit.typeCount === 2;
                });
            });
            var discountsLeft = 4;
            var discounts = _.filter(_.flatten(_.pluck(_.flatten(secondChildNights), 'rules')), function (x) {
                return x.id === 'second child discount';
            });
            assert.strictEqual(discounts.length, discountsLeft);
        },
        'An early booking discount must be applied for each night, each pax': function (topic) {
            var x = topic.products[0].applied[0].units,
                i, // 4 nights by 4 
                paxlength = 4 * 4,
                curr, length;
            for (i = 0, length = x.lengt; i < length; i++) {
                curr = x[i];
                assert.strictEqual(curr.rules[1].id, 'early booking');
            }
        },
        'Vat must be applied for the whole reservation': function (topic) {
            assert.strictEqual(topic.products[0].applied[1].units[0].rules[0].id, 'vat');
        },
        'Final price must be 53.1  units': function (topic) {
            topic.products[0].reckon();
            // xrates.reckon.run(topic.products[0]);
            assert.strictEqual(topic.products[0].registers.price.toFixed(2), (53.10).toFixed(2));
        }
    }
});
 suite.addBatch({
     'Check availability restriction in Los Persas. Note that Los Persas does not has normal availability, just restrictions': {
         topic: hotelRates.persas,
         'At least one adult per room': function (topic) {
             var r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [5, 6],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.strictEqual(p.registers.availability, 'At least one adult per room');
             });
         },
         'Up to three adults with a maximun of 4 pax in room': function (topic) {
             var r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [null, null, null, null],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.strictEqual(p.registers.availability, 'Up to 3 adults per room');
             });
             r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [null, null, 5, null],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.notStrictEqual(p.registers.availability, 'false');
             });
         },
         'Five pax are allowed only when they are 2 adults 2 baby and 1 children or two adults with three babies': function (topic) {
             var r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [null, null, 7, 0, 0],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.strictEqual(_.isUndefined(p.registers.availability),true); 
             });
             r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [null, null, null, 0, 0],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.strictEqual(p.registers.availability,'A maximum of 4 pax are allowed'); 
             });
             r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [null, null, 7, 5, 3],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.strictEqual(p.registers.availability,'Children overload: A maximum of 4 pax are allowed'); 
             });
             r = xrates.Processor.process(hotelRates.losPersas, {
                 date: new Date(2011, 1, 15),
                 pax: [null, null, 0, 0, 0],
                 checkin: new Date(2011, 4, 29),
                 checkout: new Date(2011, 5, 2)
             });
             _.each(r.products, function (p) {
                 p.reckon();
                 assert.strictEqual(_.isUndefined(p.registers.availability),true); 
             });
         }
     }
 });
suite.export(module);
