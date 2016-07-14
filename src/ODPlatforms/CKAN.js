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


//This JS class allows the connection to a ckan platform.

function CKANApi() {
}//EndFunction.

CKANApi.prototype = (function() {

    var httpGetAsync = function(theUrl, callback, errorCallback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                callback(xhttp.responseText);
        };
        xhttp.onerror = function (XMLHttpRequest, textStatus, errorThrown) {
            console.log( 'The data failed to load :(' );
            if (typeof errorCallback !== 'undefined')
                errorCallback("Check DataStoreAPI.");
        };
        xhttp.open("GET", theUrl, true);//true for asynchronous.
        //xhttp.setRequestHeader('Content-yype')
        xhttp.send(null);
    };//EndFunction.

    /*var _processListOfDataset = function(requestContent) {

        var jsonContent = JSON.parse(requestContent);
        if (jsonContent.success == false) return;
        var ckanresults = jsonContent.result.results;


        var datasetsCSV = [];
        var arrFormatsSummary = [];

        for (var i=0; i<ckanresults.length; i++) {
            var result = ckanresults[i];
            var resources = result.resources;
            for (var j=0; j<resources.length; j++) {
                var resource = resources[j];

                var resourceFormat = resource.format;
                _arrUtil.testAndIncrement(arrFormatsSummary, resourceFormat);

                if (resourceFormat == "CSV")
                    datasetsCSV.push({ id: resource.id, description: resource.description, url: resource.url });

                //debugger;
            }
        }//EndFor.

        console.log("...");
    };//EndFunction.*/

    var _retrieveListOfDatasets = function(baseUrl, userCallback) {
        httpGetAsync(baseUrl, function(responseText) {
            var datasets = [];

            var jsonResponse = JSON.parse(responseText);
            var jsonResults = jsonResponse.result.results;

            for (var i=0; i<jsonResults.length; i++) {
                var jsonResult = jsonResults[i];
                var jsonResources = jsonResult.resources;

                for (var j=0; j<jsonResources.length; j++) {
                    var jsonResource = jsonResources[j];

                    var idx = baseUrl.indexOf("/api");
                    var pageUrl = baseUrl.substring(0, idx) + "/dataset/" + jsonResult.name + "/resource/" + jsonResource.id;
                    datasets.push({ id: jsonResource.id, name: jsonResource.name, format: jsonResource.format,
                        url: jsonResource.url, pageUrl: pageUrl });
                }//EndForJ.
            }//EndForI.

            userCallback(datasets);
        });
    };//EndFunction.

    //PUBLIC CLASS CONTENT.
    return {
        constructor: CKANApi,

        listDatasets: function (baseUrl, userCallback) {
            var apiListDataset = baseUrl + "/api/3/action/package_search" + "?rows=10000";
            _retrieveListOfDatasets(apiListDataset, userCallback)
        },//EndFunction.

        retrieveDataset: function (baseUrl, datasetId, userCallback) {
            var linkDataset = baseUrl + "/api/action/datastore_search?resource_id=" + datasetId;
            httpGetAsync(linkDataset, function(responseContent) {
                var jsonResponseCKAN = JSON.parse(responseContent);
                var numOfRows = jsonResponseCKAN.result.total;
                var numOfCols = jsonResponseCKAN.result.fields.length;
                var record = { error: false, original: jsonResponseCKAN, numOfRows: numOfRows, numOfCols: numOfCols };
                userCallback(record);
            }, function (errMsg) {
                var record = { error: true, errorMessage: errMsg };
                userCallback(record);
            });
        }//EndFunction
    };

})();