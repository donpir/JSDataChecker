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


function CSVReader() {
};//EndConstructor.

CSVReader.Split = function(line, COL_SEPARATOR) {
    //var COL_SEPARATOR = typeof colseparator == 'undefined' ? ',' : colseparator;

    if (COL_SEPARATOR == null || typeof COL_SEPARATOR == 'undefined')
        throw "CSV Column separator is null.";

    var STATE = {
        INIT :    { id: 0 },
        READVAL : { id: 1 }
    };

    var cells = [];
    var value = "";
    var status = STATE.INIT;

    for (var i=0; i<line.length; i++) {
        var c = line[i];

        switch(c) {
            case "\"":
                if (status == STATE.INIT)           status = STATE.READVAL, value = "";
                else if (status == STATE.READVAL)   status = STATE.INIT, cells.push(value), value = null;
                break;
            case COL_SEPARATOR:
                if (status == STATE.INIT && value != null)  cells.push(value), value = "";
                else if (status == STATE.READVAL)           value += c;
                break;
            default:
                status: STATE.READVAL, value += c;
                break;
        }//EndSwitch.
    }//EndFor.

    return cells;
};//EndFunction.

CSVReader.RecogniseCSVSeparator = function(rows) {

    var tryToSplit = function (rows, colsep) {
        var numCols = -1;
        for (var i=1; i<rows.length && i<10; i++) {
            var cells = CSVReader.Split(rows[i], colsep);
            var rowNumCols = cells.length;

            if (numCols == -1 && rowNumCols > 1) {
                numCols = rowNumCols;
                continue;
            }

            if (numCols != rowNumCols)
                return false;
        }//EndFor.

        return true;
    };

    //Try to use the ";" character as separator.
    var SEPARATOR = ';';
    var foundSparator = tryToSplit(rows, SEPARATOR);
    if (foundSparator) return SEPARATOR;

    SEPARATOR = ',';
    foundSparator = tryToSplit(rows, SEPARATOR);
    if (foundSparator) return SEPARATOR;

    throw "Cannot infer the CSV column separator.";
};//EndFunction.

CSVReader.prototype = (function() {

    var _processHeader = function(header, colseparator) {
        if (colseparator == null || typeof colseparator == 'undefined')
            throw "Cannot process the CSV header because the column separator is null";

        var headerNames = header.split(colseparator);
        var fields = [];

        headerNames.forEach( function(item, index) {
            var name = item.replace(/\s/, "_");
            var field = { name: name, label: item, index: index };
            fields.push(field);
            fields[name] = field;
        });

        return fields;
    };//EndFunction.

    return {
        constructor: CSVReader,

        /**
         * Read the CSV string and generate an object with two arrays:
         * "fields" that contains the column names and "records" that contains the data.
         * @param csvContent
         * @returns {{fields: *, records: Array}}
         */
        read: function(csvContent) {
            var records = [];
            var fields = null;

            var rows = csvContent.split(/\r\n?/);
            var separator = CSVReader.RecogniseCSVSeparator(rows);

            //First row is the header.
            fields = _processHeader(rows[0], separator);

            //Loop through the dataset's rows.
            for (var i=1; i<rows.length; i++) {
                var row = rows[i];
                var values = CSVReader.Split(row, separator);
                var jsonRow = [];

                for (var j=0; j<values.length; j++) {
                    var value = values[j];

                    if (typeof fields[j] == 'undefined')
                        debugger;

                    var key = fields[j].name;
                    jsonRow[key] = value;
                }

                records.push(jsonRow);
            }//EndFor.

            return { fields: fields, records: records };
        }//EndFunction.
    };

})();