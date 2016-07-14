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

function ODStatistics() {
}//EndFunction.

ODStatistics.prototype = (function() {

    var httpGetAsync = function(theUrl, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                callback(xhttp.responseText);
        };
        xhttp.onerror = function (XMLHttpRequest, textStatus, errorThrown) {
            console.log( 'The data failed to load :(' );
            console.log(JSON.stringify(XMLHttpRequest));
        };
        xhttp.open("GET", theUrl, true);//true for asynchronous.
        xhttp.send(null);
    };//EndFunction.

    var _downloadDataset = function() {

    };//EndFunction.

    /**
     * Retrieves the formats of all datasets.
     * @param datasets
     * @returns {{}}
     * @private
     */
    var _analyseFormats = function(datasets) {
        var stats = {};

        stats.numOfDatasets = datasets.length;
        stats.formats = [];
        stats.formatsAggregated = [];

        for (var i=0; i<datasets.length; i++) {
            var dataset = datasets[i];

            //Statistics on the datasets' formats.
            ArrayUtils.TestAndIncrement(stats.formats, dataset.format);

            var dsformat = dataset.format.toLowerCase();

            //Aggregated formats.
            if (dsformat.includes("csv"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "csv");
            else if (dsformat.includes("pdf"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "pdf");
            else if (dsformat.includes("html"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "html");
            else if (dsformat.includes("json"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "json");
            else if (dsformat.includes("xml"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "xml");
            else if (dsformat.includes("shp"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "shp");
            else if (dsformat.includes("geojson"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "geojson");
            else if (dsformat.includes("kml"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "kml");
            else if (dsformat.includes("txt"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "txt");
            else if (dsformat.includes("xls") || dsformat.includes("xlsx") || dsformat.includes("ods"))
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "xls/ods");
            else
                ArrayUtils.TestAndIncrement(stats.formatsAggregated, "other");
        }//EndForI.

        //Calculates the formats percentages.
        var tmpArrFormats = stats.formats;
        stats.formats = [];
        ArrayUtils.IteratorOverKeys(tmpArrFormats, function(item, property) {
            var recordFormat = {};
            recordFormat.name = property;
            recordFormat.occurrance = item;
            recordFormat.occurrancePercentage = (item / datasets.length) * 100;
            recordFormat.occurrancePercentage = Math.round(recordFormat.occurrancePercentage * 100) / 100;
            stats.formats.push(recordFormat);
        });

        //Calculates the formats percentage for the aggregated formats.
        var tmpArrFormatsAggregated = stats.formatsAggregated;
        stats.formatsAggregated = [];
        ArrayUtils.IteratorOverKeys(tmpArrFormatsAggregated, function(item, property) {
            var recordFormat = {};
            recordFormat.name = property;
            recordFormat.occurrance = item;
            recordFormat.occurrancePercentage = (item / datasets.length) * 100;
            recordFormat.occurrancePercentage = Math.round(recordFormat.occurrancePercentage * 100) / 100;
            stats.formatsAggregated.push(recordFormat);
        });

        return stats;
    };//EndFunction.

    /**
     * Given a dataset in input it calculates statistics.
     * @param dataset
     * @private
     */
    var _analyseDataset = function(dataset, stats) {
        if (typeof stats === 'undefined')
            stats = {};

        if (!stats.hasOwnProperty('totRows')) {
            stats.totRows = 0;
            stats.totCols = 0;
            stats.maxRowsPerDataset = null;
            stats.minRowsPerDataset = null;

            stats.maxColsPerDataset = null;
            stats.minColsPerDataset = null;

            stats.totDatasetsAnalysed = 0;
        }

        stats.totRows += dataset.numOfRows;
        stats.totCols += dataset.numOfCols;

        if (stats.maxRowsPerDataset === null || dataset.numOfRows > stats.maxRowsPerDataset)
            stats.maxRowsPerDataset = dataset.numOfRows;

        if (stats.minRowsPerDataset === null || dataset.numOfRows < stats.minRowsPerDataset)
            stats.minRowsPerDataset = dataset.numOfRows;

        if (stats.maxColsPerDataset === null || dataset.numOfCols > stats.maxColsPerDataset)
            stats.maxColsPerDataset = dataset.numOfCols;

        if (stats.minColsPerDataset === null || dataset.numOfCols < stats.minColsPerDataset)
            stats.minColsPerDataset = dataset.numOfCols;

        return stats;
    };//EndFunction.

    return {
        constructor: ODStatistics,

        analyse: function (datasets) {
            var stats = _analyseFormats(datasets); //Analyses the datasets formats.
            return stats;
        },//EndFunction.

        analyseDataset: function (dataset, stats) {
            return _analyseDataset(dataset, stats);
        }//EndFunction.

    };
})();