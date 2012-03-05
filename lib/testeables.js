var _ = require('underscore');
// incase functions
exports.testNightInRange = function (input) {
    var night, u = input.itemToUpdate,
        i = input.testArgs.length,
        start, end, _args;
    while (i--) {
        _args = input.testArgs[i];
        start = (_args.start && _.isDate(_args.start)) ? _args.start : false;
        end = (_args.end && _.isDate(_args.end)) ? _args.end : false;
        // test input and set *night*. 
        // current night must be in frequency or
        // unit
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
        if ((!start || night >= start) && (!end || night <= end)) {
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
        i = t.length;
    while (i--) {
        var pax = u.frequencyType === 'PerPerson' ? u.frequency : (u.unitType === 'PerPerson' ? u.unit : undefined);
        // Todo: trow error
        var paxCount = t[i].type ? pax.typeCount : pax.number;
        if ((!t[i].rangeStart || t[i].rangeStart <= paxCount) && (!t[i].rangeEnd || t[i].rangeEnd >= paxCount)) {
            return true;
        }
    }
    return false;
};

function duration2ticks(input, limit) {
    // implementar
    // https://github.com/mono/mono/blob/master/mcs/class/System.XML/Test/System.Xml/XmlConvertTests.cs
    // https://github.com/mono/mono/blob/master/mcs/class/System.XML/System.Xml/XmlConvert.cs
}
exports.testCompareDates = function (input) {
    // todo: refactorizar
    return true;
    var u = input.accumulator;
    var t = input.testArgs;
    var diff = duration2ticks(u.compareTo);
    var ret = u[t.to] - u[t.from];
};
