"use strict";
var _ = require('underscore');
exports.getPerDay = function (accumulator) {
    var oneDay = 1000 * 24 * 60 * 60,
        ret = [],
        current = accumulator.checkin.getTime(),
        end = accumulator.checkout.getTime();
    for (; current <= end; current += oneDay) {
        ret.push(new Date(current));
    }
    return ret;
};
exports.getPerNight = function (accumulator) {
    var days = exports.getPerDay(accumulator);
    return days.slice(0, days.length - 1);
};
exports.getPerPerson = function (accumulator) {
    return accumulator.pax;
};
exports.getOnce = function (accumulator) {
    return [accumulator];
};
