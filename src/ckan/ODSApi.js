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

function ODSApi() {
}

ODSApi.prototype = (function() {

    var _arrUtil = new ArrayUtils();

    var httpGetAsync = function(theUrl, callback, callbackOnFinish) {
        //var asynch = typeof asynch === 'undefined' ? true : asynch;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                callback(theUrl, xhttp.responseText, callbackOnFinish);
        };
        xhttp.open("GET", theUrl, true);//true for asynchronous.
        xhttp.send(null);
    };//EndFunction.

    var _processListOfDataset = function(baseUrl, requestContent, callbackOnFinish) {
        var jsonContent = JSON.parse(requestContent);
        var jsonDatasets = jsonContent.datasets;

        var resultDatasets = [];

        for (var i=0; i<jsonDatasets.length; i++) {
            var jsonDataset = jsonDatasets[i];
            var _title = jsonDataset.metas.title;
            var _datasetId = jsonDataset.datasetid;
            var _datasetUrl = "/api/records/1.0/search/?rows=1000&dataset=" + _datasetId;

            var ds = { id: _datasetId, title: _title, url: _datasetUrl };
            ds.fields = jsonDataset.fields;
            resultDatasets.push(ds);
        }

        callbackOnFinish(resultDatasets);
    };//EndFunction.

    var _processDataset = function (dataset, requestContent, callbackOnFinish) {
        var jsonContent = JSON.parse(requestContent);
        var records = jsonContent.records;

        if (typeof dataset !== 'undefined') {
            dataset.rows = [];
            for (var i=0; i<records.length; i++) {
                var record = records[i];
                dataset.rows.push(record.fields);
            }//EndFor.
        }

        callbackOnFinish(dataset);
    };//EndFunction.

    return {
        constructor: ODSApi,

        listDatasets: function (theUrl, callbackOnFinish) {
            theUrl = theUrl + "/api/datasets/1.0/search/?rows=-1";
            httpGetAsync(theUrl, _processListOfDataset, callbackOnFinish);
        },//EndFunction.

        /*requestDataset: function (theUrl, callbackOnFinish) {
            httpGetAsync(theUrl, _processDataset, callbackOnFinish);
        }//EndFunction.*/

        requestDataset: function (urlDomain, dataset, callbackOnFinish) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200)
                    _processDataset(dataset, xhttp.responseText, callbackOnFinish);
            };
            xhttp.open("GET", urlDomain + dataset.url, true);//true for asynchronous.
            xhttp.send(null);
        }//EndFunction.
    };

})();