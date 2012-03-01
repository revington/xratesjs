/**
 * specs for hotels
 */
var vows = require('vows'),
    assert = require('assert'),
    xrates = require('../lib/xratesjs');
var context = {};
context.normal = {
    date: new Date(2011, 1, 15),
    pax: [null, null, 5, 7],
    checkin: new Date(2011, 4, 29),
    checkout: new Date(2011, 5, 2)
};
var easyHotel= new xrates.Rates();
easyHotel.pax = [{
    paxType: 'AD',
    fromAge: 12,
    toAge: 2000,
    isDefault: true
}, {
    paxType: 'BB',
    fromAge: 0,
    toAge: 1
}, {
    paxType: 'CH',
    fromAge: 2,
    toAge: 11
}];
easyHotel.rules['rates season 1'] = {
    apply: {
        unit: 'PerPerson',
        frequency: 'PerNight'
    },
    incase: [{
        fn: 'NightInRange',
        args: [{
            start: new Date(2011, 0, 1, 0, 0, 0),
            end: new Date(2011, 2, 1, 23, 59, 59)
        }]
    }],
    update: [{
        register: 'price',
        args: {
            mode: 'x',
            verb: 'a',
            value: 2
        }
    }]
};
easyHotel.rules['rates season 2'] = {
    apply: {
        unit: 'PerPerson',
        frequency: 'PerNight'
    },
    incase: [{
        fn: 'NightInRange',
        args: [{
            start: new Date(2011, 2, 2, 0, 0, 0),
            end: new Date(2011, 4, 31, 23, 59, 59)
        }]
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'a',
            mode: 'x',
            value: 4
        }
    }]
};
easyHotel.rules['rates season 3'] = {
    apply: {
        unit: 'PerPerson',
        frequency: 'PerNight'
    },
    incase: [{
        fn: 'NightInRange',
        args: [{
            'start': new Date(2011, 5, 1, 0, 0, 0),
            'end': new Date(2011, 11, 31, 23, 59, 59)
        }]
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'a',
            mode: 'x',
            value: 8
        }
    }]
};
easyHotel.rules['early booking'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CompareDates',
        args: {
            from: 'today',
            to: 'checkin',
            op: '>=',
            compareTo: 'P30D'
        }
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'm',
            value: 0.90,
            mode: 'x'
        }
    }]
};
easyHotel.rules['first child discount'] = {
    apply: {
        unit: 'PerPerson',
        frequency: 'PerNight'
    },
    incase: [{
        fn: 'NightInRange',
        args: [{
            start: new Date(2011, 0, 1, 0, 0, 0),
            end: new Date(2011, 11, 27, 0, 0, 0)
        }]
    }, {
        fn: 'PaxInRange',
        args: [{
            type: 'NI',
            rangeStart: 1,
            rangeEnd: 1
        }]
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'm',
            value: 0,
            mode: 'u'
        }
    }, {
        register: 'discount',
        args: {
            verb: 'a',
            value: 'primer niño gratis',
            mode: 'x'
        }
    }]
};
easyHotel.rules['second child discount'] = {
    apply: {
        unit: 'PerPerson',
        frequency: 'PerNight'
    },
    incase: [{
        fn: 'NightInRange',
        args: [{
            start: new Date(2011, 0, 1, 0, 0, 0),
            end: new Date(2011, 11, 27, 0, 0, 0)
        }]
    }, {
        fn: 'PaxInRange',
        args: [{
            type: 'NI',
            rangeStart: 2,
            rangeEnd: 2
        }]
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'm',
            value: 0.50,
            mode: 'u'
        }
    }, {
        register: 'discount',
        args: {
            verb: 'a',
            value: 'segundo niño gratis',
            mode: 'x'
        }
    }]
};
easyHotel.rules.vat = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'Always'
    }],
    update: [{
        register: 'price',
        args: {
            mode: 'x',
            verb: 'm',
            value: 1.18
        }
    }]
};
easyHotel.products = [{
    name: 'single',
    rates: {
        ref: 'rates season 1',
        children: [{
            ref: 'rates season 2',
            children: [{
                ref: 'rates season 3',
                children: [{
                    ref: 'early booking',
                    children: [{
                        ref: 'first child discount',
                        children: [{
                            ref: 'second child discount',
                            children: [{
                                ref: 'vat'
                            }]
                        }]
                    }]
                }]
            }]
        }]
    }
}];
vows.describe('xrates').addBatch({
    'Dadas las siguientes tarifas para la single: \n\tDEFINICIÓN PAX\n\t\t- pax ad (por defecto) 12 ~ ∞\n\t\t- bb 0 ~ 1\n\t\t- ch 2,11 \n\tHAB SINGLE (PPPPN)\n\t\t- 2 unidades monetarias desde 1/1/11 hasta 01/03/11 \n\t\t- 4 unidades monetarias 02/03/11 ~ 31/05/11 \n\t\t- 8 unidades monetarias 01/06/11 ~ 31/12/11\n\tDESCUENTOS:\n\t\t- early booking 10% con 30 días\n\t\t- 1er niño 100% descuento\n\t\t- 2 niño 50% descuento\n\tRecargos:\n\t\t- 18% iva\n~~~~~~~~~~~\n pasándole una reserva el día 15/02 para el 15/06 de 4n con pax ?,?,5,7 tendré una oferta:': {
        topic: function () {
            var ret = xrates.Processor.process(easyHotel, context.normal);
            return ret;
        },
        'Debe haber una single': function (topic) {
            assert.isNotNull(topic);
        }
    }
}).export(module);
