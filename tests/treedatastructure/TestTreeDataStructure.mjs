import { TDS, TDSNODE } from '../../src/treedatastructure.js';

QUnit.test("TestTreeDataStructure", function(assert) {

    var A = new TDSNODE("A");
    var B = new TDSNODE("B", A);
    var C = new TDSNODE("C", B);
    var D = new TDSNODE("D", A);

    const _tree = new TDS(A);
    let travereOrder = _tree.traverseDepthFirst();

    assert.equal( travereOrder[0].value, "C");
    assert.equal( travereOrder[1].value, "B");
    assert.equal( travereOrder[2].value, "D");
    assert.equal( travereOrder[3].value, "A");

});
