import { TDS, TDSNODE } from '../../src/treedatastructure.mjs';

QUnit.test("TestTreeDataStructure", function(assert) {

    var A = new TDSNODE("A");
    var B = new TDSNODE("B", A);
    var C = new TDSNODE("C", B);
    var D = new TDSNODE("D", A);

    const _tree = new TDS(A);
    debugger;
    let travereOrder = _tree.traverseDepthFirst();

    assert.equal( travereOrder[0].data, "C", "Primo nodo ok");
    assert.equal( travereOrder[1].data, "B");
    assert.equal( travereOrder[2].data, "D");
    assert.equal( travereOrder[3].data, "A");

});
