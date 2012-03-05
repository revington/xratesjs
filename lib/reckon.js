"use strict";
var _ = require('underscore');

function add(ctxt, register, mode, value, verb) {
    ctxt.registers[register] += value;
}

function multiply(ctxt, register, mode, value, verb) {
    ctxt.registers[register] *= value;
}

function lock(ctxt, register, mode, value, verb) {}

function deleteRegister(ctxt, register, mode, value, verb) {
    if (false === _.isUndefined(ctxt.registers[register])) {
        delete ctxt.registers[register];
    }
}

function createRegister(ctxt, register, mode, value, verb) {
    ctxt.registers[register] = _.isNumber(value) ? 0 : '';
}

function createOrUpdateRegister(ctxt, register, mode, value, verb) {
    if (_.isUndefined(ctxt.registers[register])) {
        createRegister(ctxt, register, mode, value, verb);
    }
}

function run(input) {
    var verbs = {
        a: add,
        m: multiply,
        l: lock
    },
        modes = {
            c: createRegister,
            x: createOrUpdateRegister,
            d: deleteRegister
        };
    var ret = [];
    ret.registers = {};
    _.forEach(input.applied, function (applied) {
        _.forEach(applied.units, function (u) {
            ret.push({
                frequencyType: applied.frequencyType,
                unitType: applied.unitType,
                rules: u.rules,
                unit: applied.rules,
                frequency: applied.frequency
            });
        });
    });
    _.forEach(ret, function (el) {
        el.registers = {};
        _.forEach(el.rules, function (rule) {
            _.forEach(rule.update, function (r) {
                modes[r.args.mode](el, r.register, r.args.mode, r.args.value, r.args.verb);
                verbs[r.args.verb](el, r.register, r.args.mode, r.args.value, r.args.verb);
            });
        });
        _.each(el.registers, function (v, k) {
            modes.x(ret, k, 'x', v, 'a');
            add(ret, k, 'x', v, 'a');
        });
    });
    return ret;
}
module.exports.run = run;
