
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset01.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset01", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");

        var _converter = new DataTypeConverter();
        var path = [ "records", "fields", "*" ];
        var types = _converter.inferJsonDataType(jsonDataset, path);

        //anne column.
        var key = "records,fields,annee";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //capital_restant_du column.
        var key = "records,fields,capital_restant_du";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Column.
        var key = "records,fields,cbc_charte_bonne_conduite";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.CATEGORY.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Column.
        var key = "records,fields,date_de_fin";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.DATETIME.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Column.
        var key = "records,fields,preteur";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.CATEGORY.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Column.
        var key = "records,fields,taux";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        //Column.
        var key = "records,fields,type";
        var actualType = types[key].type;
        var expectedType = DataTypeConverter.TYPES.CATEGORY.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        debugger;
    });

}//EndTestSuite.
