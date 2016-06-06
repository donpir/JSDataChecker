
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset11_nullvalues.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset11 Test null values", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");
        assert.equal(jsonDataset.length, 56, "Dataset number of rows mismatch.");

        var _converter = new DataTypeConverter();
        var path = [ "*" ];
        var infos = _converter.inferJsonDataType(jsonDataset, path);

        //type column.
        var key = 'type';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.TEXT.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //undefkey column.
        var key = 'undefkey';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.EMPTY.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

    });

}//EndTestSuite.
