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
        xhttp.open("GET", theUrl, true);//true for asynchronous.
        xhttp.send(null);
    };//EndFunction.

    var _downloadDataset = function() {

    };//EndFunction.

    var _analyseFormats = function(datasets) {
        var stats = {};

        stats.numOfDatasets = datasets.length;
        stats.formats = [];

        for (var i=0; i<datasets.length; i++) {
            var dataset = datasets[i];

            //Statistics on the datasets' formats.
            ArrayUtils.TestAndIncrement(stats.formats, dataset.format);
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

        return stats;
    };//EndFunction.

    var _analyse = function(datasets) {
        var stats = _analyseFormats(datasets);
        return stats;
    };//EndFunction.

    return {
        constructor: ODStatistics,

        analyse: function (datasets) {
            return _analyse(datasets);
        }//EndFunction.

    };
})();