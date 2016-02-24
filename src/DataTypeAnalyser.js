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

function DataTypeAnalyser() {}

DataTypeAnalyser.TYPES = {
    TEXT        : { value: 0, name: "TEXT" },
    NUMBER      : { value: 1, name: "NUMBER" },
    PERCENTAGE  : { value: 2, name: "PERCENTAGE" },

    LATITUDE    : { value: 3, name: "LATITUDE" },
    LONGITUDE   : { value: 4, name: "LONGITUDE" },
    BOOL        : { value: 5, name: "BOOL"},
    CONST       : { value: 6, name: "CONST" },
    CATEGORY    : { value: 7, name: "CATEGORY" },

    DATETIME    : { value: 8, name: "DATETIME" },
    OBJECT      : { value: 100, name: "OBJECT" }
};

DataTypeAnalyser.prototype = (function () {

    var _fields = [];
    var _numOfRows = 0;
    var _arrUtil = new ArrayUtils();
    var _dataTypesUtils = new DataTypesUtils();

    /***
     * Make an asynchronous call to load the content.
     * @param theUrl
     * @param callback
     */
    var httpGetAsync = function(theUrl, callbackOnFinish) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                _processDataset(xhttp.responseText, callbackOnFinish);
        }
        xhttp.open("GET", theUrl, true); // true for asynchronous
        xhttp.send(null);
    };//EndFunction.

    var _processDataset = function (jsonRows) {
        //Check if the jsonRow is an array.
        if (Array.isArray(jsonRows) == false) return;

        for (var i=0; i<jsonRows.length; i++) {
            var jsonRow = jsonRows[i];
            _processRow(jsonRow);
        }//EndFor.

        _dataTypeAnalyser(_fields);

        return _fields;
    };//EndFunction.

    var _processRow = function(row) {
        //Avoid empty rows
        if (typeof row === 'undefined') return;

        //Get the object keys.
        for (var property in row) {
            if (row.hasOwnProperty(property)) {
                var cellValue = row[property];

                //if (property == 'votantspourcentages') debugger;
                //if (property == 'va_no_voie') debugger;

                var inferredType = _processInferType(cellValue);

                if (typeof _fields[property] === 'undefined')
                    _fields[property] = { name: property, _inferredTypes: [], _inferredValues: [] };

                _arrUtil.testAndIncrement(_fields[property]._inferredTypes, inferredType.name);
                if (inferredType === DataTypeAnalyser.TYPES.TEXT)
                    _arrUtil.testAndIncrement(_fields[property]._inferredValues, cellValue);
                if (inferredType === DataTypeAnalyser.TYPES.LATITUDE || inferredType === DataTypeAnalyser.TYPES.LONGITUDE)
                    _arrUtil.testAndIncrement(_fields[property]._inferredTypes, DataTypeAnalyser.TYPES.NUMBER);
            }
        }

        _numOfRows++;
    };//EndFunction.

    var _dataTypeAnalyser = function(fields) {
        _arrUtil.iteratorOverKeys(fields, function(field) {
            var max = _arrUtil.findMinMax(field._inferredTypes, function (curval, lastval) {
                return curval > lastval;
            });
            field.type = max.key;
            field.typeConfidence = field._inferredTypes[max.key] / _numOfRows;

            /*//TODO: improve this piece of code.
            //LAT/LNG.
            var fieldName = field.name.toLowerCase();
            var isLatType = (field.type === DataTypeAnalyser.TYPES.LATITUDE.name);
            var fieldNameContainsLat = fieldName.indexOf('lat') >= 0;
            var fieldNameContainsLon = fieldName.indexOf('ng') >= 0; //It could be 'lng'.
            if (isLatType == true && fieldNameContainsLat == false && fieldNameContainsLon == true) {
                field.type = DataTypeAnalyser.TYPES.LONGITUDE.name;
            }*/

            //BOOLEAN.
            var numOfValues = Object.keys(field._inferredValues).length;
            if (field.type === DataTypeAnalyser.TYPES.TEXT.name) {
                if (numOfValues == 1) field.type = DataTypeAnalyser.TYPES.CONST.name;
                //else if (numOfValues == 2) field.type = DataTypeAnalyser.TYPES.BOOL.name;
                else if (numOfValues < _numOfRows * 0.20) field.type = DataTypeAnalyser.TYPES.CATEGORY.name;
            }
        });
    };//EndFunction.

    /*var _dataTypeAnalyserField = function (field) {
        var max = _arrUtil.findMinMax(field._inferredTypes, function (curval, lastval) {
            return curval > lastval;
        });
        field.type = max.key;
        field.typeConfidence = field._inferredTypes[max.key] / _numOfRows;

        //TODO: improve this piece of code.
        //LAT/LNG.
        var fieldName = field.name.toLowerCase();
        var isLatType = (field.type === ChartProcessor.TYPES.LATITUDE.name);
        var fieldNameContainsLat = fieldName.indexOf('lat') >= 0;
        var fieldNameContainsLon = fieldName.indexOf('ng') >= 0; //It could be 'lng'.
        if (isLatType == true && fieldNameContainsLat == false && fieldNameContainsLon == true) {
            field.type = ChartProcessor.TYPES.LONGITUDE.name;
        }

        //BOOLEAN.
        var numOfValues = Object.keys(field._inferredValues).length;
        if (field.type === ChartProcessor.TYPES.TEXT.name) {
            if (numOfValues == 1) field.type = ChartProcessor.TYPES.CONST.name;
            else if (numOfValues == 2) field.type = ChartProcessor.TYPES.BOOL.name;
            else if (numOfValues < _numOfRows * 0.10) field.type = ChartProcessor.TYPES.CATEGORY.name;
        }
    };//EndFunction.*/

    /**
     * Given a dataset value, it tries to recognise the data types.
     * This is the central function within the library.
     * @param value
     * @returns {*}
     * @private
     */
    var _processInferType = function(value) {
        //value = value.toLocaleString();

        if (typeof value === 'object')
            return DataTypeAnalyser.TYPES.OBJECT;

        //Try to parse the float.
        var isnumber = _dataTypesUtils.filterFloat(value);
        if (isNaN(isnumber) !== true) {//It is a number.
            //If the number ranges from -90.0 to 90.0, the value is marked as Latitude.
            //if (-90.0 <= isnumber && isnumber <= 90.0 && _dataTypesUtils.decimalPlaces(isnumber) >= 5)
            //    return DataTypeAnalyser.TYPES.LATITUDE;

            //It the number ranges from -180.0 to 180.0, the value is marked as Longitude.
            //if (-180.0 <= isnumber && isnumber <= 180.0 && _dataTypesUtils.decimalPlaces(isnumber) >= 5)
            //    return DataTypeAnalyser.TYPES.LONGITUDE;

            if (0.0 <= isnumber && isnumber <= 100.0)
                if(/^(\+)?((0|([1-9][0-9]*))\.([0-9]+))$/ .test(value))
                    return DataTypeAnalyser.TYPES.PERCENTAGE;

            return DataTypeAnalyser.TYPES.NUMBER;
        }

        var _date = Date.parse(value);
        if (isNaN(_date) == false)
            return DataTypeAnalyser.TYPES.DATETIME;


        return DataTypeAnalyser.TYPES.TEXT;
    };//EndFunction.

    return {
        constructor: DataTypeAnalyser,

        inferDataTypes: function (jsonRows) {
            _fields = [];
            _numOfRows = 0;
            _processDataset(jsonRows);
            return _fields;
        }
    };
})();
