import {DataChecker} from "../../src/datachecker.mjs";
import {BasicDataTypeConfigFactory} from "../../src/BasicDataTypeConfigFactory.mjs";

QUnit.test("TestDataChecker", function(assert) {

    let dtConfigFactory = new BasicDataTypeConfigFactory();
    let datachecker = new DataChecker(dtConfigFactory);

    let value = "1936";
    let inferredDataType = datachecker.inferDataTypeOfValue(value);
    assert.ok("ok");

});
