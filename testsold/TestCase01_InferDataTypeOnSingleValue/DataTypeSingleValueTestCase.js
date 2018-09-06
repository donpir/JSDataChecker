QUnit.test( "TestDate", function( assert ) {
    var converter = new DataTypeConverter();

    var value = "02/03/2016 18:57";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt.type, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");


    var value = "2016-03-07T11:26:17+00:00";
    var dt = converter.inferDataTypeOfValue(value);
    assert.equal(dt.type, DataTypeConverter.TYPES.DATETIME, "Text /" + value + "/ correctly recognized.");

});
