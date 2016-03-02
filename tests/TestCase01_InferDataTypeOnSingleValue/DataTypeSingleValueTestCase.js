QUnit.test( "TestDate", function( assert ) {
    var converter = new DataTypeConverter();

    var value = "CAF 92";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.TEXT, "Text /" + value + "/ correctly recognized.");

    var value = "2023-04";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");

});
