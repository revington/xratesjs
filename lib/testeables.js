"use strict";
var _ = require('underscore'),
    xsduration = require('xsdurationjs'),
    op = {
        '>': function (a, b) {
            return a > b;
        },
        '<': function (a, b) {
            return a < b;
        },
        '==': function (a, b) {
            return _.isEqual(a, b);
        },
        '>=': function (a, b) {
            return a >= b;
        },
        '<=': function (a, b) {
            return a <= b;
        }
    };
exports.op = op;

function resolve(input, str) {
    return input.registers[str] | str;
}
// incase functions

function nightInRange(start, end, night) {
    return (!start || night >= start) && (!end || night <= end);
}
exports.nightInRange = nightInRange;
exports.testNightInRange = function (input) {
    var night, u = input.itemToUpdate,
        i = input.testArgs.length,
        start, end, _args;
    if (u.frequencyType === 'PerNight') {
        if (_.isDate(u.frequency)) {
            night = u.frequency;
        }
    } else if (u.unitType === 'PerNight') {
        if (_.isDate(u.unit)) {
            night = u.unit;
        }
    } else {
        // ups...
    }
    while (i--) {
        _args = input.testArgs[i];
        start = (_args.start && _.isDate(_args.start)) ? _args.start : false;
        end = (_args.end && _.isDate(_args.end)) ? _args.end : false;
        if (nightInRange(start, end, night)) {
            return true;
        }
    }
    return false;
};
exports.testAlways = function () {
    return true;
};
exports.testPaxInRange = function (input) {
    var t = input.testArgs,
        u = input.itemToUpdate,
        i = t.length,
        pattern, startRangeMatch, endRangeMatch, paxTypeMatch, pax = u.frequencyType === 'PerPerson' ? u.frequency : (u.unitType === 'PerPerson' ? u.unit : undefined);
    while (i--) {
        pattern = t[i];
        var paxCount = pattern.type ? pax.typeCount : pax.number;
        paxTypeMatch = _.isUndefined(pattern.type) | pattern.type === u.unit.paxType;
        startRangeMatch = !pattern.rangeStart || pattern.rangeStart <= paxCount;
        endRangeMatch = !pattern.rangeEnd || pattern.rangeEnd >= paxCount;
        if (paxTypeMatch && startRangeMatch && endRangeMatch) {
            return true;
        }
    }
    return false;
};

function countPax(test, pax) {
    var allPax = pax.length,
        operation = op[test.op],
        current, value = test.value,
        fn = function (v) {
            return operation(v, value);
        };
    if (_.isUndefined(test.type)) {
        return fn(allPax);
    }
    while (allPax--) {
        current = pax[allPax];
        if (current.paxType === test.type) {
            return fn(current.typeCount);
        }
    }
    return fn(0);
}
exports.countPax = countPax;
exports.testCountPax = function (input) {
    return _.all(input.testArgs, function (test) {
        return countPax(test, input.accumulator.pax);
    });
};

function compareDates(from, to, duration, f) {
    return op[f](to, xsduration.add(duration, from));
}
exports.compareDates = compareDates;
exports.testAntelation = function (input) {
    var start = input.accumulator.date,
        checkin = input.accumulator.checkin;
    return _.all(input.testArgs, function (test) {
        return compareDates(start, checkin, test.duration, test.op);
    });
};
