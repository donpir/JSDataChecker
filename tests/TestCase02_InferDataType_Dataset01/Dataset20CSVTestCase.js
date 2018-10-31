
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset20.csv", runTests);

function runTests(textualContent) {
    var dataset = textualContent

    QUnit.test( "Dataset20", function( assert ) {
        var AssertType = function (analysisResults, key, expectedTypeName) {
            var actualType = analysisResults.types[key].type;
            var expectedType = expectedTypeName;
            assert.equal(actualType, expectedType, "Check inferred type on " + key);
        };

        var AssertSubType = function (analysisResults, key, expectedTypeName) {
            var actualType = analysisResults.types[key].subtype;
            var expectedType = expectedTypeName;
            assert.equal(actualType, expectedType, "Check inferred type on " + key);
        };

        assert.notEqual(dataset, null, "Dataset correctly loaded.");

        //Infer the SEPARATOR.
        try {
            var rows = dataset.split(/\r\n?/);
            var separator = csvjson.RecogniseCSVSeparator(rows);
            assert.equal(separator, ';', "CSV Separator ';' recognized");
        } catch (err) {
            assert.failed;
        }

        //Read the CSV Content.
        var reader = new csvjson();
        var jsonDataset = reader.read(dataset);

        //Infer the types.
        var analyser = new DataTypeConverter();
        var path = [ "records", "*" ];
        var analysisResults = analyser.inferJsonDataType(jsonDataset, path, { filterOnThresholdConfidence: false, trackCellsForEachType: false});

        //Type checking.
        AssertType(analysisResults, "records,name", DataTypeConverter.TYPES.TEXT.name);
        AssertType(analysisResults, "records,values", DataTypeConverter.TYPES.NUMBER.name);
        AssertType(analysisResults, "records,percentage", DataTypeConverter.TYPES.PERCENTAGE.name);

        var casted = analyser.cast(analysisResults);

        debugger;

        /*
        //Type checking.
        AssertType(analysisResults, "records,ID", DataTypeConverter.TYPES.TEXT.name);
        AssertType(analysisResults, "records,NAME", DataTypeConverter.TYPES.TEXT.name);
        AssertType(analysisResults, "records,AGE", DataTypeConverter.TYPES.NUMBER.name);

        AssertType(analysisResults, "records,BORN_US", DataTypeConverter.TYPES.DATETIME.name);
        AssertSubType(analysisResults, "records,BORN_US", DataTypeConverter.SUBTYPES.DATETIMEYMD.name);

        AssertType(analysisResults, "records,BORN_IT", DataTypeConverter.TYPES.DATETIME.name);
        AssertSubType(analysisResults, "records,BORN_IT", DataTypeConverter.SUBTYPES.DATETIMEDMY.name);

        AssertType(analysisResults, "records,BORN_XX", DataTypeConverter.TYPES.DATETIME.name);
        AssertSubType(analysisResults, "records,BORN_XX", DataTypeConverter.SUBTYPES.DATETIMEXXY.name);

        AssertType(analysisResults, "records,BORN_XXY", DataTypeConverter.TYPES.DATETIME.name);
        AssertSubType(analysisResults, "records,BORN_XXY", DataTypeConverter.SUBTYPES.DATETIMEXXY.name);
        assert.ok(analysisResults.types["records,BORN_XXY"].errorsDescription.startsWith("Cannot determine"));

        AssertType(analysisResults, "records,BORN_DMY_MDY", DataTypeConverter.TYPES.DATETIME.name);
        AssertSubType(analysisResults, "records,BORN_DMY_MDY", DataTypeConverter.SUBTYPES.DATETIMEDMY.name);
        assert.ok(analysisResults.types["records,BORN_DMY_MDY"].errorsDescription.indexOf("are not in format") !== -1);*/

    });

}//EndTestSuite.

