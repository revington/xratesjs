"use strict";
var _ = require('underscore'),
    events = require('events'),
    util = require('util'),
    testeables = require('./testeables'),
    computables = require('./computables');
/**
 * Update API
 */

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
/**
 * Get pax type from an array
 * of pax definitions
 * @param {number} age - The age. Can be null.
 * @param {PaxDefinition[]} paxDefinitions.
 * @returns {string|bool} Matching pax type.
 */

function getPaxType(age, paxDefinitions) {
    var i = paxDefinitions.length,
        p, searchingDefault = _.isNull(age);
    while (i--) {
        p = paxDefinitions[i];
        if (searchingDefault) {
            if (p.isDefault) {
                return p.paxType;
            }
        } else if (age >= p.fromAge && age <= p.toAge) {
            return p.paxType;
        }
    }
    return false;
}
module.exports.getPaxType = getPaxType;
// TODO: rename to something like makePaxContext or contextualizePax

function getPaxContext(paxArray, paxDefinitions) {
    var ret = [],
        paxTypeCounter = {},
        i, x;
    for (i = 0; i < paxArray.length; i++) {
        x = {
            age: paxArray[i],
            number: i + 1,
            paxType: getPaxType(paxArray[i], paxDefinitions)
        };
        x.typeCount = paxTypeCounter[x.paxType] ? ++paxTypeCounter[x.paxType] : paxTypeCounter[x.paxType] = 1;
        ret.push(x);
    }
    return ret;
}
module.exports.getPaxContext = getPaxContext;

function applyRuleToComputableItems(units, frequency, rule) {
    var maxU = rule.maxUnitApplies,
        maxF = rule.maxFrequencyApplies,
        ret = [],
        ul, fl;
    for (fl = rule.frequencySkip | 0;
    (fl < frequency.length | 0) && (!maxF || fl <= maxF); fl++) {
        for (ul = rule.unitSkip | 0;
        (ul < units.length | 0) && (!maxU || ul <= maxU); ul++) {
            ret.push({
                frequencyType: rule.apply.frequency,
                unitType: rule.apply.unit,
                unit: units[ul],
                frequency: frequency[fl]
            });
        }
    }
    return ret;
}
module.exports.applyRuleToComputableItems = applyRuleToComputableItems;

function testRule(itemToUpdate, accumulator, ruleOptions, lib) {
    var allTrue = true,
        tests = ruleOptions.incase && ruleOptions.incase.length ? ruleOptions.incase.length : 0,
        i;
    for (i = 0; allTrue && i < tests; i++) {
        allTrue = allTrue && lib['test' + ruleOptions.incase[i].fn]({
            testArgs: ruleOptions.incase[i].args,
            itemToUpdate: itemToUpdate,
            accumulator: accumulator
        });
    }
    return allTrue;
}
module.exports.testRule = testRule;

function isValidAccumulator(element, applied) {
    return (applied && (applied.frequencyType === element.frequencyType && applied.unitType === element.unitType));
}
module.exports.isValidAccumulator = isValidAccumulator;

/**
 * Rules ctor
 */

function RulesApplied(element) {
    this.frequencyType = element.frequencyType;
    this.unitType = element.unitType;
    this.units = [];
    this.addUnit = function (element, rule, ruleName) {
        var i = this.units.length;
        while (i--) {
            if (_.isEqual(this.units[i].frequency, element.frequency) && _.isEqual(this.units[i].unit, element.unit)) {
                this.units[i].rules.push({
                    update: rule.update,
                    id: ruleName
                });
                return;
            }
        }
        this.units.push({
            frequency: element.frequency,
            unit: element.unit,
            rules: [{
                update: rule.update,
                id: ruleName
            }]
        });
    };
}
module.exports.RulesApplied = RulesApplied;

function applyRule(rates, accumulator, step, computables, testeables, callback) {
    var rule = rates.rules[step.ref],
        elements = applyRuleToComputableItems(
        computables['get' + rule.apply.unit](accumulator), computables['get' + rule.apply.frequency](accumulator), rule),
        i = 0,
        x, length = elements.length;
    // todo: sacar los test de este fichero
    for (; i < length; i++) {
        x = elements[i];
        //itemToUpdate, accumulator, ruleOptions,lib)
        if (true === testRule(x, accumulator, rule, testeables)) {
            // refactorizar la llamada
            // updateAccumulator(x, accumulator, rule);
            if (accumulator.applied.length === 0) {
                accumulator.applied.push(new RulesApplied(x));
            }
            var valid = accumulator.applied[accumulator.applied.length - 1];
            if (!isValidAccumulator(x, valid)) {
                valid = new RulesApplied(x);
                accumulator.applied.push(valid);
            }
            valid.addUnit(x, rule, step.ref);
        }
    }
    // walk the children...
    if (step.children) {
        i = step.children.length;
        while (i--) {
            if (i === 0) {
                applyRule(rates, accumulator, step.children[i], computables, testeables, callback);
            } else {
                applyRule(rates, _.clone(accumulator), step.children[i], computables, testeables, callback);
            }
        }
    } else {
        if (_.isFunction(callback)) {
            callback(accumulator);
        }
    }
}
module.exports.applyRule = applyRule;
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

function reckon(input) {
    /**
     * Reckon the rules
     * -a rule is a composition of updates
     * -updates must reckoned in order
     * -each update inherits its precessor registers
     * --some units access to the main product registers like 'Once'
     * -Once all the updates have been reckoned we must update the main registers in x mode and a verb
     */
    // Create registers
    input.registers = {};
    _.forEach(input.applied, function (applied) {
        _.forEach(applied.units, function (u) {
            /**
             * Once registers are main registers.
             * The rest use their own set of registers
             */
            var target = (applied.frequencyType !== 'Once' && applied.unitType !== 'Once') ? u : u.unit;
            if (_.isUndefined(target.registers)) {
                target.registers = {};
            }
            _.each(u.rules, function (r) {
                _.each(r.update, function (update) {
                    modes[update.args.mode](target, update.register, update.args.mode, update.args.value, update.args.verb);
                    verbs[update.args.verb](target, update.register, update.args.mode, update.args.value, update.args.verb);
                });
            });
            /**
             * If we did not updated main registers yet it is
             * necesary to update main registers now.
             */
            if (applied.frequencyType !== 'Once' && applied.unitType !== 'Once') {
                _.each(u.registers, function (v, k) {
                    modes.x(input, k, 'x', v, 'a');
                    add(input, k, 'x', v, 'a');
                });
            }
        });
    });
}
module.exports.reckon = reckon;

function Accumulator(name, context, rates) {
    var self = this;
    _.extend(self, context);
    self.applied = [];
    self.name = name;
    self.pax = getPaxContext(context.pax, rates.pax);
    self.reckon = function () {
        reckon(self);
    };
}

function applyRates(rates, context, computables, testeables) {
    var products = [],
        callback = function (x) {
            products.push(x);
        },
        i, length, s = {},
        currentProduct;
    for (i = 0, length = rates.products.length; i < length; i++) {
        currentProduct = rates.products[i];
        //        _.extend(s, context, {
        //            applied: [],
        //            name: currentProduct.name,
        //            pax: getPaxContext(context.pax, rates.pax),
        //            reckon: reckonThis(s)
        //        });
        applyRule(rates, new Accumulator(currentProduct.name, context, rates), currentProduct.rates, computables, testeables, callback);
    }
    return products;
}
module.exports.applyRates = applyRates;
module.exports.process = function (rates, context, options) {
    return {
        products: applyRates(rates, context, computables, testeables)
    };
};
module.exports.Processor = function (options) {
    var self = this;
    self.process = '';
};
