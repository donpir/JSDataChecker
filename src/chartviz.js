
function ChartViz() {
}

ChartViz.prototype = (function() {

    return {
        constructor: ChartViz,
        analyse: function() {

        }
    }
})();

//////////////////////////////////////

function ChartProcessor() {
}

ChartProcessor.TYPES = {
    TEXT : { value: 0, name: "TEXT" },
    NUMBER : { value: 1, name: "NUMBER" },
    BOOL : { value: 2, name: "BOOL" }
};

ChartProcessor.prototype = (function () {

    var _fields = [];

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

        console.log(datasetContent);
    };//EndFunction.

    var _processHeader = function(header) {
        var fields = _processSplitRow(header);
        fields.map( function(item) { _fields.push({ name: item }); });
    };//EndFunction.

    var _processRow = function(row) {
        var values = _processSplitRow(row);
        var i;
        for (i=0; i<values.length; i++) {
            var inferredType = _processInferType(values[i]);
            _fields[i].type = inferredType;
        }//EndFor.
    };//EndFunction.

    var _processInferType = function(value) {
        value = value.toLocaleString();
        if (value === 'yes' || value === 'no') {
            return ChartProcessor.TYPES.BOOL;
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
