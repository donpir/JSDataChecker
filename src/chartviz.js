 /*
 ** This file is part of ChartViz.
 **
 ** ChartViz is free software: you can redistribute it and/or modify
 ** it under the terms of the GNU General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** ChartViz is distributed in the hope that it will be useful,
 ** but WITHOUT ANY WARRANTY; without even the implied warranty of
 ** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 ** GNU General Public License for more details.
 **
 ** You should have received a copy of the GNU General Public License
 ** along with ChartViz. If not, see <http://www.gnu.org/licenses/>.
 **
 ** Copyright (C) 2016 ChartViz - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **/

//<INCLUDE>. Find a batter way to include dependent scripts.
//document.write('<script type="text/javascript" src="ArrayUtils.js"></script>');
//document.write('<script type="text/javascript" src="DataTypesUtils.js"></script>');

function ChartProcessor() {
}

ChartProcessor.TYPES = {
    TEXT : { value: 0, name: "TEXT" },
    NUMBER : { value: 1, name: "NUMBER" },
    BOOL : { value: 2, name: "BOOL" }
};

ChartProcessor.prototype = (function () {

    var _fields = [];
    var _arrUtil = new ArrayUtils();
    var _dataTypesUtils = new DataTypesUtils();

    /***
     * Make an asynchronous call to load the content.
     * @param theUrl
     * @param callback
     */
    var httpGetAsync = function(theUrl, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                callback(xhttp.responseText);
        }
        xhttp.open("GET", theUrl, true); // true for asynchronous
        xhttp.send(null);
    };//EndFunction.

    var _processDataset = function (datasetContent) {
        //Split the dataset rows.
        var rows = datasetContent.split("\n");

        //The assumption is that the first row is the header.
        _processHeader(rows[0]);

        //Loop through the dataset's rows.
        var i;
        for (i=1; i<rows.length; i++) {
            var row = rows[i];
            _processRow(row);
        }//EndFor.

        //It determines the type of each column.
        var datasetsize = rows.length - 1;
        _fields.map(function (field) {
            var max = _arrUtil.findMinMax(field._inferredTypes, function (curval, lastval) {
                return curval > lastval;
            });
            field.type = max.key;
            field.typeConfidence = field._inferredTypes[max.key] / datasetsize;

            //if (field.type === ChartProcessor.TYPES.TEXT && Object.keys(field._inferredValues)) {
            //}

        });

        console.log(datasetContent);
    };//EndFunction.

    var _processHeader = function(header) {
        var fields = _processSplitRow(header);
        fields.map( function(item) { _fields.push({ name: item, _inferredTypes: [], _inferredValues: [] }); });
    };//EndFunction.

    var _processRow = function(row) {
        var values = _processSplitRow(row);
        var i;
        for (i=0; i<values.length; i++) {//Loop on the row values.
            var inferredType = _processInferType(values[i]);
            _arrUtil.testAndIncrement(_fields[i]._inferredTypes, inferredType.name);
            if (inferredType === ChartProcessor.TYPES.TEXT)
                _arrUtil.testAndIncrement(_fields[i]._inferredValues, values[i]);
        }//EndFor.
    };//EndFunction.

    var _processInferType = function(value) {
        value = value.toLocaleString();

        //Try to parse the float.
        var isnumber = _dataTypesUtils.filterFloat(value);
        if (isNaN(isnumber) !== true) {//It is a number.
            return ChartProcessor.TYPES.NUMBER;
        }

        return ChartProcessor.TYPES.TEXT;
    };//EndFunction.

    var _processSplitRow = function (row) {
        return row.split(',');
    };//EndFunction.

    return {
        constructor: ChartProcessor,

        inferDataTypes: function (theUrl) {
            httpGetAsync(theUrl, _processDataset);
        }
    };
})();



