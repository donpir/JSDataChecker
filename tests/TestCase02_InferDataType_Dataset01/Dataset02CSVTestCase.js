/*
 ** This file is part of JSDataChecker.
 **
 ** JSDataChecker is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** JSDataChecker is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with JSDataChecker. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2016 JSDataChecker - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **/


var httpGetAsync = function(theUrl, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(xhttp.responseText);
    };
    xhttp.open("GET", theUrl, true); // true for asynchronous
    xhttp.send(null);
};//EndFunction.

httpGetAsync("../datasets/dataset02.csv", runTests);

function runTests(textualContent) {
    var dataset = textualContent

    QUnit.test("CSVReader Split TestCase", function(assert) {
        var line = "\"2,23\",\"5,5\"";
        var values = csvjson.Split(line, ',');
        assert.equal(values.length, 2, "The line has the correct number of values");

        var line = "Hello,\"2,23\",\"5,5\"";
        var values = csvjson.Split(line, ',');
        assert.equal(values.length, 3, "The line has the correct number of values");
    });

    QUnit.test( "Dataset02", function( assert ) {
        assert.notEqual(dataset, null, "Dataset correctly loaded.");

        //Infer the SEPARATOR.
        try {
            var rows = dataset.split(/\r\n?/);
            var separator = csvjson.RecogniseCSVSeparator(rows);
            assert.equal(separator, ',', "CSV Separator ; recognized");
        } catch (err) {
            assert.failed;
        }

        //Read the CSV Content.
        var reader = new csvjson();
        var jsonDataset = reader.read(dataset);

        assert.notEqual(jsonDataset, null, "Dataset correctly read.");

        assert.equal(jsonDataset.fields.length, 19, "The dataset has the expected number of columns.");
        assert.equal(jsonDataset.records.length, 14, "The dataset has the expected number of rows.");

        debugger;

        //Parse the dataset type.
        var _converter = new DataTypeConverter();
        var path = [ "records", "*" ];
        var metadata = _converter.inferJsonDataType(jsonDataset, path);

        //anne column.
        var key = "records,Final_Cost";
        var actualType = metadata.types[key].type;
        var expectedType = DataTypeConverter.TYPES.NUMBER.name;
        assert.equal(actualType, expectedType, "Check inferred type on " + key);

        debugger;

    });

}//EndTestSuite.