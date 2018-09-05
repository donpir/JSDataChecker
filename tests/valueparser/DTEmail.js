import {DATATYPES} from "../../src/qcbase.js";

QUnit.test("TestEmail", function(assert) {

    var value = "ciccio@ciccio.it";
    var result = DATATYPES.DT_EMAIL.evaluate(value);
    assert.ok(result);
    assert.equal("EMAIL", result.datatype.name);

});//EndTest.