
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset09.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset09", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");

        var _converter = new DataTypeConverter();
        var path = [ "*" ];
        var infos = _converter.inferJsonDataType(jsonDataset, path);

        //anne column.
        var key = 'Intelligence';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Converts the dataset.
        var converted = _converter.cast(infos);
        assert.ok(typeof converted.dataset[0].currency === "number", "Converted to number");
        debugger;
    });

}//EndTestSuite.
