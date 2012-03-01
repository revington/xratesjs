var vows = require('vows'),
    assert = require('assert'),
    processor = require('../lib/processor');
var suite = vows.describe('proccesor');
var paxDefinitions = [{
    paxType: 'AD',
    fromAge: 13,
    isDefault: true,
    toAge: 150
}, {
    paxType: 'CH',
    fromAge: 0,
    toAge: 12
}];
suite.addBatch({
    'Get pax type by age': {
        'We can get pax type by age if previously we define a pax for this age': function () {
            var i;
            for (i = 0; i <= 150; i++) {
                if (i >= 0 && i <= 12) {
                    assert.strictEqual(processor.getPaxType(i, paxDefinitions), 'CH');
                } else if (i >= 13) {
                    assert.strictEqual(processor.getPaxType(i, paxDefinitions), 'AD');
                }
            }
        },
        'Optionally we can specify a default pax for when no age is given': function () {
            assert.strictEqual(processor.getPaxType(null, paxDefinitions), 'AD');
        },
        'Returns false when no pax definition matches the given age': function () {
            assert.strictEqual(processor.getPaxType(6, [paxDefinitions[0]]), false);
        }
    }
});
suite.addBatch({
    'Adds a context to pax': {
        'Set a pax number preserving the order': function () {
            var c = processor.getPaxContext([30, 20], paxDefinitions);
            assert.strictEqual(c[0].number, 1);
            assert.strictEqual(c[1].number, 2);
            assert.strictEqual(c[0].age, 30);
            assert.strictEqual(c[1].age, 20);
	}, 
	'Set a pax number by type preserving the order' : function (){

		var c = processor.getPaxContext([30, 20,2,6], paxDefinitions);
		var must = [{age:30,number :1, paxType:'AD',typeCount:1},
			{age:20, number:2,paxType:'AD', typeCount:2},
			{age:2, number:3,paxType:'CH', typeCount:1},
			{age:6, number:4,paxType:'CH', typeCount:2}];
			var i;
			for (i = 0;i <4; i++){
				assert.strictEqual(c[i].age,must[i].age);
				assert.strictEqual(c[i].number,must[i].number);
				assert.strictEqual(c[i].paxType,must[i].paxType);
				assert.strictEqual(c[i].typeCount,must[i].typeCount);
			}
	}
    }
});
//suite.addBatch({'Items to compute':{
	
suite.export(module);

