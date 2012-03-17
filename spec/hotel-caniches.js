
var rules = [{
    incase: [{
        fn: "CountPax",
        args: {
            type: "AD",
            value: 0,
            op: "=="
        }
    }],
    update: [{
        register: "availability",
        mode: "c",
        value: "min one adult",
        verb: "a"
    }],
    apply: {
        frequency: "Once",
        unit: "Once"
    },
    name: "Min 1 adult"
}, {
    incase: [{
        fn: "CountPax",
        args: {
            type: "",
            value: 2,
            op: ">="
        }
    }],
    update: [{
        register: "availability",
        mode: "c",
        value: "Min two pax",
        verb: "a"
    }],
    apply: {
        frequency: "Once",
        "unit": "Once"
    },
    name: "Min two pax"
}, {
    incase: [{
        fn: "CountPax",
        args: {
            type: "",
            value: 4,
            op: ">"
        }
    }],
    update: [{
        register: "availability",
        mode: "c",
        value: "max 4 pax",
        verb: "a"
    }],
    apply: {
        frequency: "Once",
        "unit": "Once"
    },
    name: "Max 4 pax"
}, {
    incase: [{
        fn: "CountPax",
        args: {
            type: "AD",
            value: 4,
            op: "=="
        }
    }],
    update: [{
        register: "availability",
        mode: "c",
        value: "on request ** ",
        verb: "a"
    }],
    apply: {
        frequency: "Once",
        "unit": "Once"
    },
    name: "4 AD on request"
}, {
    incase: [{
        fn: "Antelation",
        args: {
            "duration": "P3D",
            op: ">="
        }
    }],
    update: [{
        register: "availability",
        mode: "c",
        value: "book with at least 3 days in advance",
        verb: "a"
    }],
    apply: {
        frequency: "Once",
        "unit": "Once"
    },
    name: "Antelation min 3 days"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-01-01+01:00",
            end: "2011-04-30+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "35",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Season 1"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-05-01+01:00",
            end: "2011-05-31+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "40.56",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "season 2"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-06-01+01:00",
            end: "2011-06-18+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "46.80",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "season 3"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-06-19+01:00",
            end: "2011-06-30+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "53.92",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "season 4"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-07-01+01:00",
            end: "2011-07-09+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "54.60",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "season 5"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-07-10+01:00",
            end: "2011-07-30+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "60.84",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "season 6"
}, {
    incase: [{
        fn: "NightInRange",
        args: {
            start: "2011-07-30+01:00",
            end: "2011-12-31+01:00"
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: "60",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "season 7"
}, {
    incase: [{
        fn: "CountPax",
        args: {
            type: "",
            value: 1,
            op: "=="
        }
    }],
    update: [{
        register: "price",
        mode: "x",
        value: "20",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Double room Individual use surcharge"
}, {
    incase: [{
        fn: "CountPax",
        args: {
            type: "",
            value: 1,
            op: "=="
        }
    }],
    update: [{
        register: "price",
        mode: "x",
        value: "10",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Single room "
}, {
    incase: [{
        fn: "Always",
        args: {}
    }],
    update: [{
        register: "price",
        mode: "x",
        value: "10",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "All inclusive surcharge"
}, {
    incase: [{
        fn: "Always",
        args: {}
    }],
    update: [{
        register: "price",
        mode: "x",
        value: "-2.50",
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Half board discount"
}, {
    incase: [{
        fn: "PaxInRange",
        args: {
            type: "BB",
            start: 1,
            end: 5
        }
    }],
    update: [{
        register: "price",
        mode: "x",
        value: 0,
        verb: "m"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Babies free of charge"
}, {
    incase: [{
        fn: "PaxInRange",
        args: {
            type: "AD",
            start: 3,
            end: 3
        }
    }],
    update: [{
        register: "price",
        mode: "x",
        value: "0.75",
        verb: "m"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Third adult 25% discount"
}, {
    incase: [{
        fn: "PaxInRange",
        args: {
            type: "CH",
            start: 1,
            end: 1
        }
    }, {
        fn: "CountPax",
        args: {
            type: "AD",
            value: 2,
            op: "=="
        }
    }],
    update: [{
        register: "price",
        mode: "c",
        value: 0,
        verb: "a"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "First child free of charge"
}, {
    incase: [{
        fn: "CountPax",
        args: {
            type: "AD",
            value: 2,
            op: "=="
        }
    }, {
        fn: "PaxInRange",
        args: {
            type: "CH",
            start: 2,
            end: 2
        }
    }],
    update: [{
        register: "price",
        mode: "x",
        value: "0.50",
        verb: "m"
    }],
    apply: {
        frequency: "PerNight",
        "unit": "PerPerson"
    },
    name: "Second child has a 50% discount when two adults in room"
}];
