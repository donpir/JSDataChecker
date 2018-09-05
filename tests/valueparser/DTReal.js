
import {DATATYPES} from "../../src/qcbase.js";

QUnit.test("TestReal", function(assert) {

    var value = "1936";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("INT", result.datatype.name);

    var value = "1936.27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "-1936.27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "+1936.27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "1936,27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "-1936,27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "1936,07";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "+1936,27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("REAL", result.datatype.name);

    var value = "0";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("INT", result.datatype.name);

    var value = "1.936.27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "1,936,27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "1.936,27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "1,936.27";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "1936.";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "1936,";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "CAF 92";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal(result.datatype.name, "TEXT");

    var value = "02600";
    var result = DATATYPES.DT_REAL.evaluate(value);
    assert.ok(result);
    assert.equal(result.datatype.name, "TEXT");

});
