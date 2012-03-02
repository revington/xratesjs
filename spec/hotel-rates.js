var xrates = require('../lib/xratesjs');
var easyHotel = new xrates.Rates();
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
        unit: 'PerPerson',
        frequency: 'PerNight'
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
module.exports.easyHotel = easyHotel;
