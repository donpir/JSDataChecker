
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

        //Lat column.
        var key = 'Lat';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);
        var actualType = infos.types[key].subtype;
        var expectedType = DataTypeConverter.SUBTYPES.GEOCOORDINATE.name;
        assert.equal(actualType, expectedType, "Check inferred subtype on " + key);

        //Lat column.
        var key = 'Lon';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.TEXT.name; //It is textual because it has one value that is undefined.
        assert.equal(actualType, expectedType, "Check inferred type on " + key);
        var actualType = infos.types[key].subtype;
        var expectedType = DataTypeConverter.SUBTYPES.GEOCOORDINATE.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //LatLng array as on OpenDataSoft.
        var key = 'LatLon';
        var actualType = infos.types[key].type;
        var expectedType = DataTypeConverter.TYPES.OBJECT.name; //It is textual because it has one value that is undefined.
        assert.equal(actualType, expectedType, "Check inferred type on " + key);
        var actualType = infos.types[key].subtype;
        var expectedType = DataTypeConverter.SUBTYPES.GEOCOORDINATE.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Converts the dataset.
        var converted = _converter.cast(infos);

        //It converts the "types" object to "array"
        var arrFields = ArrayUtils.toFieldsArray(infos.types);

        assert.notEqual(null, infos.warningsTextual);
        assert.ok(infos.warningsTextual.startsWith("The column"), "EN translation is ok.");

        //FRANCE TRANSLATION.
        infos = _converter.inferJsonDataType(jsonDataset, path, { language: "FR" });
        assert.notEqual(null, infos.warningsTextual);
        assert.ok(infos.warningsTextual.startsWith("Le colonne"), "France translation is ok");

        //ITALIAN TRANSLATION.
        infos = _converter.inferJsonDataType(jsonDataset, path, { language: "IT" });
        assert.notEqual(null, infos.warningsTextual, "Warning present");
        assert.ok(infos.warningsTextual.startsWith("La colonna"), "Italian translation is ok");

        //NL TRANSLATION.
        infos = _converter.inferJsonDataType(jsonDataset, path, { language: "NL" });
        assert.notEqual(null, infos.warningsTextual, "Warning present");
        assert.ok(infos.warningsTextual.startsWith("De kolom"), "Dutch translation is ok");

        debugger;
    });

}//EndTestSuite.
