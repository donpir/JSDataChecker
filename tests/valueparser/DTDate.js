
import {DATATYPES} from "../../src/qcbase.js";

QUnit.test("TestDate", function(assert) {

    var value = "2023-04";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("DATEYM", result.datatype.name);

    var value = "2016-03-07";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("DATEYMD", result.datatype.name);

    var value = "02/03/2016";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal(result.datatype.name, "DATEXXY", "Testing value: " + value);

    var value = "92077-02";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("TEXT", result.datatype.name);

    var value = "50/50/2016";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result, "Testing value: " + value);
    assert.equal(result.datatype.name, "TEXT", "Testing value: " + value);

    var value = "02/13/2016";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result, "Testing value: " + value);
    debugger;
    assert.equal("DATEMDY", result.datatype.name, "Testing Value: " + value);

    var value = "12/26/2016";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result, "Testing value: " + value);
    assert.equal(result.datatype.name, "DATEMDY", "Testing value: " + value);

    var value = "1/1/2016";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("DATEXXY", result.datatype.name);

    var value = "01/1/2016";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("DATEXXY", result.datatype.name);

    var value = "01/1/250";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("DATEXXY", result.datatype.name);

    var value = "520/12/1";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result);
    assert.equal("DATEYMD", result.datatype.name);

    var value = "520/12";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result, "Testing value: " + value);
    assert.equal(result.datatype.name, "DATEYM", "Testing value: " + value);

    var value = "520/50";
    var result = DATATYPES.DT_DATE.evaluate(value);
    assert.ok(result, "Testing value: " + value);
    assert.equal("TEXT", result.datatype.name, "Testing value: " + value);

});//EndTest.