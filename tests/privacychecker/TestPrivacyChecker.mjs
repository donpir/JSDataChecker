import {DataChecker} from "../../src/datachecker.mjs";
import {PrivacyConfigFactory} from "../../src/PrivacyConfigFactory.mjs";

QUnit.test("TestPrivacyChecker", function(assert) {

    let prConfigFactory = new PrivacyConfigFactory();
    let datachecker = new DataChecker(prConfigFactory);

    let value = "mariorossi@gmail.com";
    let inferredType = datachecker.inferDataTypeOfValue(value);
    assert.ok(inferredType.datatype === prConfigFactory.DATATYPES.DT_EMAIL, "Recognizing the value " + value);

    value = "PPPPLT80R10M082K";
    inferredType = datachecker.inferDataTypeOfValue(value);
    assert.ok(inferredType.datatype === prConfigFactory.DATATYPES.DT_CF, "Recognizing the value " + value);

});