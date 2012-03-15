var xrates = require('../lib/xratesjs');
var losPersas = new xrates.Rates();
losPersas.pax = [{
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
losPersas.rules['At least one adult per room'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CountPax',
        args: [{
            type: 'AD',
            op: '==',
            value: 0
        }]
    }],
    update: [{
        register: 'availability',
        args: {
            mode: 'c',
            verb: 'a',
            value: 'At least one adult per room'
        }
    }]
};
losPersas.rules['Up to 3 adults per room'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CountPax',
        args: [{
            type: 'AD',
            op: '>',
            value: 3
        }]
    }],
    update: [{
        register: 'availability',
        args: {
            mode: 'c',
            verb: 'a',
            value: 'Up to 3 adults per room'
        }
    }]
};
losPersas.rules['children overload'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CountPax',
        args: [{
            op: '>',
            value: 4
        }, {
            op: '>',
            value: 2,
            type: 'CH'
        }]
    }],
    update: [{
        register: 'availability',
        args: {
            mode: 'c',
            verb: 'a',
            value: 'Children overload: A maximum of 4 pax are allowed'
        }
    }]
};
losPersas.rules['adult overload'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CountPax',
        args: [{
            op: '>',
            value: 4
        }, {
            op: '>',
            value: 2,
            type: 'AD'
        }]
    }],
    update: [{
        register: 'availability',
        args: {
            mode: 'c',
            verb: 'a',
            value: 'A maximum of 4 pax are allowed'
        }
    }]
};
losPersas.rules['aaa'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CountPax',
        args: [{
            op: '>',
            value: 4
        }, {
            op: '>',
            value: 2,
            type: 'AD'
        }, {
            op: '>',
            value: 2,
            type: 'BB'
        }, {
            op: '>',
            value: 1,
            type: 'CH'
        }]
    }],
    update: [{
        register: 'availability',
        args: {
            mode: 'c',
            verb: 'a',
            value: 'More than 4 pax are only allowed for a 2 adults,1 child and 2 baby'
        }
    }]
};
losPersas.rules['More than 4 pax are only allowed for a 2 adults,1 child and 2 baby'] = {
    apply: {
        unit: 'Once',
        frequency: 'Once'
    },
    incase: [{
        fn: 'CountPax',
        args: [{
            op: '>',
            value: 4
        }, {
            op: '>',
            value: 2,
            type: 'AD'
        }, {
            op: '>',
            value: 3,
            type: 'BB'
        }, {
            op: '>',
            value: 0,
            type: 'CH'
        }]
    }],
    update: [{
        register: 'availability',
        args: {
            mode: 'c',
            verb: 'a',
            value: 'More than 4 pax are only allowed for a 2 adults,1 child and 2 baby'
        }
    }]
};
losPersas.products = [{
    name: 'single',
    rates: {
        ref: 'At least one adult per room',
        children: [{
            ref: 'Up to 3 adults per room',
            children: [{
                ref: 'adult overload',
                children: [{
                    ref: 'children overload',
                    children: [{
                        ref: 'More than 4 pax are only allowed for a 2 adults,1 child and 2 baby',
                        children: [{
                            ref: 'aaa'
                        }]
                    }]
                }]
            }]
        }]
    }
}];
module.exports.losPersas = losPersas;
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
        fn: 'Antelation',
        args: [{
            op: '>=',
            duration: 'P30D'
        }]
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
            type: 'CH',
            rangeStart: 1,
            rangeEnd: 1
        }]
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'm',
            value: 0,
            mode: 'x'
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
            type: 'CH',
            rangeStart: 2,
            rangeEnd: 2
        }]
    }],
    update: [{
        register: 'price',
        args: {
            verb: 'm',
            value: 0.50,
            mode: 'x'
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
