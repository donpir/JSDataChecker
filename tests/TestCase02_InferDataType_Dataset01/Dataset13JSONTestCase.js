
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset13_geojson.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset13 geojson", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");

        var _converter = new DataTypeConverter();
        var path = [ "records", "*" ];
        var infos = _converter.inferJsonDataType(jsonDataset, path);

        //type column.
        var key = 'records,geometry';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.OBJECT.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);
        var actualType = infos.types[key].subtype;
        var expectedType = DataTypeConverter.SUBTYPES.GEOJSON.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        debugger;
    });

}//EndTestSuite.
