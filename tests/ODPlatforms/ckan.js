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

    var _arrUtil = new ArrayUtils();

    var httpGetAsync = function(theUrl, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                _processListOfDataset(xhttp.responseText);
        };
        xhttp.open("GET", theUrl, true);//true for asynchronous.
        xhttp.send(null);
    };//EndFunction.

    var _processListOfDataset = function(requestContent) {
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
    };//EndFunction.

    //PUBLIC CLASS CONTENT.
    return {
        constructor: CKANApi,

        listDatasets: function (urlBase) {
            httpGetAsync(urlBase);
        }//EndFunction.
    };

})();