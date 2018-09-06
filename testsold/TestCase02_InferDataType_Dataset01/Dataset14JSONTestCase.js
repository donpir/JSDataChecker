
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset14_undefined.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset14 undefined values", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");

        var _converter = new DataTypeConverter();
        var path = [ "records", "fields", "*" ];
        var infos = _converter.inferJsonDataType(jsonDataset, path, { language: "it" });

        //type column.
        var key = 'records,fields,taux';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        var actualNullValues = infos.types[key].totalNullValues;
        var expectedNullValues = 38;
        assert.equal(actualNullValues, expectedNullValues, "Checked the number of null values");
        assert.equal(infos.types[key].typeLabel, "numero", "Check the translation");

        //Checking error messages.
        assert.ok(infos.types[key].errorsDescription, "Null checking");
        assert.ok(infos.types[key].errorsDescription.length > 0, "Checking error message length");
        assert.ok(infos.warningsTextual.length > 0, "Checking error message length");
        debugger;

    });

}//EndTestSuite.
