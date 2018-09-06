
var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset12.json", runTests);

function runTests(jsonTextualContent) {
    var jsonDataset = JSON.parse(jsonTextualContent);

    QUnit.test( "Dataset12", function( assert ) {
        assert.notEqual(jsonDataset, null, "Dataset correctly loaded.");
        assert.equal(jsonDataset.length, 36, "Dataset number of rows mismatch.");
        jsonDataset[2].numero_du_panneau = undefined;
        jsonDataset[2].image_panneau = undefined;

        var _converter = new DataTypeConverter();
        var path = [ "*" ];
        var infos = _converter.inferJsonDataType(jsonDataset, path);

        debugger;



    });

}//EndTestSuite.
