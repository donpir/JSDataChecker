var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("http://localhost:63342/chartviz/tests/datasets/dataset02.csv", runTests);

function runTests(textualContent) {
    var dataset = textualContent

    QUnit.test("CSVReader Split TestCase", function(assert) {
        var line = "\"2,23\",\"5,5\"";
        var values = CSVReader.Split(line);
        assert.equal(values.length, 2, "The line has the correct number of values");

        var line = "Hello,\"2,23\",\"5,5\"";
        var values = CSVReader.Split(line);
        assert.equal(values.length, 3, "The line has the correct number of values");
    });

    QUnit.test( "Dataset02", function( assert ) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");

        //Read the CSV Content.
        var reader = new CSVReader();
        var jsonDataset = reader.read(dataset);

        assert.notEqual(jsonDataset, null, "Dataset correctly read.");

        assert.equal(jsonDataset.fields.length, 19, "The dataset has the expected number of columns.");
        assert.equal(jsonDataset.records.length, 14, "The dataset has the expected number of rows.");

        debugger;

        //Parse the dataset type.
        var _converter = new DataTypeConverter();
        var path = [ "records", "*" ];
        var types = _converter.inferJsonDataType(jsonDataset, path);

        //anne column.
        /*var key = "records,fields,annee";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);*/

        debugger;

    });

}//EndTestSuite.