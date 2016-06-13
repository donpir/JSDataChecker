
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset10.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset10", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");

        var _converter = new DataTypeConverter();
        var path = [ "*" ];
        var infos = _converter.inferJsonDataType(jsonDataset, path);

        //Intelligence column.
        var key = 'Intelligence';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.TEXT.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Strength column.
        var key = 'Strength';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Speed column.
        var key = 'Speed';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.TEXT.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Similarity column.
        var key = 'Similarity';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.TEXT.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Converts the dataset.
        var converted = _converter.cast(infos);

        //It converts the "types" object to "array"
        var arrFields = ArrayUtils.toFieldsArray(infos.types);

        debugger;
    });

}//EndTestSuite.
