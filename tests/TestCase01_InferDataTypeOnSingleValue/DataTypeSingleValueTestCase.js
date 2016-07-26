QUnit.test( "TestDate", function( assert ) {
    var converter = new DataTypeConverter();

    var value = "CAF 92";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.TEXT, "Text /" + value + "/ correctly recognized.");

    var value = "2023-04";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");

    var value = "2016-03-07";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");

    var value = "02600";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.TEXT, "Text /" + value + "/ correctly recognized.");

    var value = "0";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.NUMBER, "Text /" + value + "/ correctly recognized.");

    var value = "02/03/2016 18:57";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");

    var value = "2016-03-07T11:26:17+00:00";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");

    var value = "92077-02";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.TEXT, "Text /" + value + "/ correctly recognized.");

    var value = "1936.27";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.NUMBER, "Text /" + value + "/ correctly recognized.");

    /*var value = "1936,27";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.NUMBER, "Text /" + value + "/ correctly recognized.");*/

});

QUnit.test("TestIsNumber", function(assert) {
    var value = "1936";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.ok(isnumber, value + " recognized.");

    var value = "1936.27";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.ok(isnumber, value + " recognized.");

    var value = "1936,27";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.ok(isnumber, value + " recognized.");

    var value = "1.936.27";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.notOk(isnumber, value + " recognized.");

    var value = "1,936,27";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.notOk(isnumber, value + " recognized.");

    var value = "1936.";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.notOk(isnumber, value + " recognized.");

    var value = "1936,";
    var isnumber = DataTypesUtils.FilterNumber(value);
    assert.notOk(isnumber, value + " recognized.");

});
