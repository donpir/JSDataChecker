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

function DataTypeConverter() {
    this._fields = [];
    this._numOfRows = 0;
};//EndConstructor.

DataTypeConverter.TYPES = {
    TEXT        : { value: 0, name: "TEXT" },
    NUMBER      : { value: 1, name: "NUMBER" },
    PERCENTAGE  : { value: 2, name: "PERCENTAGE" },

    LATITUDE    : { value: 3, name: "LATITUDE" },
    LONGITUDE   : { value: 4, name: "LONGITUDE" },
    BOOL        : { value: 5, name: "BOOL"},
    CONST       : { value: 6, name: "CONST" },
    CATEGORY    : { value: 7, name: "CATEGORY" },

    DATETIME    : { value: 8, name: "DATETIME" },
    OBJECT      : { value: 100, name: "OBJECT" },
    NULL        : { value: 101, name: "NULL" }
};

DataTypeConverter.prototype = (function () {

    var _arrUtil = new ArrayUtils();
    var _dataTypesUtils = new DataTypesUtils();

    /***
     * Make an asynchronous call to load the content.
     * @param theUrl
     * @param callback
     * @deprecated
     */
    var httpGetAsync = function(theUrl, callbackOnFinish) {
        console.warn("Calling deprecated function.");
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

        _analyseDataTypes(this._fields);

        return this._fields;
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

                if (typeof this._fields[property] === 'undefined')
                    this._fields[property] = { name: property, _inferredTypes: [], _inferredValues: [] };

                _arrUtil.testAndIncrement(this._fields[property]._inferredTypes, inferredType.name);
                if (inferredType === DataTypeConverter.TYPES.TEXT)
                    _arrUtil.testAndIncrement(this._fields[property]._inferredValues, cellValue);
                if (inferredType === DataTypeConverter.TYPES.LATITUDE || inferredType === DataTypeConverter.TYPES.LONGITUDE)
                    _arrUtil.testAndIncrement(this._fields[property]._inferredTypes, DataTypeConverter.TYPES.NUMBER);
            }
        }

        this._numOfRows++;
    };//EndFunction.

    var _analyseDataTypes = function(fields) {
        _arrUtil.iteratorOverKeys(fields, function(field) {
            var max = _arrUtil.findMinMax(field._inferredTypes, function (curval, lastval) {
                return curval > lastval;
            });
            field.type = max.key;
            field.typeConfidence = field._inferredTypes[max.key] / field.numOfItems;

            /*//TODO: improve this piece of code.
             //LAT/LNG.
             var fieldName = field.name.toLowerCase();
             var isLatType = (field.type === DataTypeConverter.TYPES.LATITUDE.name);
             var fieldNameContainsLat = fieldName.indexOf('lat') >= 0;
             var fieldNameContainsLon = fieldName.indexOf('ng') >= 0; //It could be 'lng'.
             if (isLatType == true && fieldNameContainsLat == false && fieldNameContainsLon == true) {
             field.type = DataTypeConverter.TYPES.LONGITUDE.name;
             }*/

            //BOOLEAN.
            var numOfValues = Object.keys(field._inferredValues).length;
            if (field.type === DataTypeConverter.TYPES.TEXT.name) {
                //if (numOfValues == 1) field.type = DataTypeConverter.TYPES.CONST.name;
                //else if (numOfValues == 2) field.type = DataTypeConverter.TYPES.BOOL.name;
                //else
                if (numOfValues < field.numOfItems * 0.20) field.type = DataTypeConverter.TYPES.CATEGORY.name;
            }
        });
    };//EndFunction.

    /**
     * Given a dataset value, it tries to recognise the data types.
     * This is the central function within the library.
     * @param value
     * @returns {*}
     * @private
     */
    var _processInferType = function(value) {
        //value = value.toLocaleString();

        if (value === null || typeof value == 'undefined')
            return DataTypeConverter.TYPES.NULL;

        if (typeof value === 'object')
            return DataTypeConverter.TYPES.OBJECT;

        //Try to parse the float.
        var isnumber = _dataTypesUtils.filterFloat(value);
        if (isNaN(isnumber) !== true) {//It is a number.
            //If the number ranges from -90.0 to 90.0, the value is marked as Latitude.
            //if (-90.0 <= isnumber && isnumber <= 90.0 && _dataTypesUtils.decimalPlaces(isnumber) >= 5)
            //    return DataTypeConverter.TYPES.LATITUDE;

            //It the number ranges from -180.0 to 180.0, the value is marked as Longitude.
            //if (-180.0 <= isnumber && isnumber <= 180.0 && _dataTypesUtils.decimalPlaces(isnumber) >= 5)
            //    return DataTypeConverter.TYPES.LONGITUDE;

            /*if (0.0 <= isnumber && isnumber <= 100.0)
                if(/^(\+)?((0|([1-9][0-9]*))\.([0-9]+))$/ .test(value))
                    return DataTypeConverter.TYPES.PERCENTAGE;*/

            return DataTypeConverter.TYPES.NUMBER;
        }

        var _date = _dataTypesUtils.filterDate(value);
        if (isNaN(_date) == false)
            return DataTypeConverter.TYPES.DATETIME;


        return DataTypeConverter.TYPES.TEXT;
    };//EndFunction.

    var jsonTraverse = function(json, fieldKeys, callback) {
        var stack = [];
        var numOfRows = 0;
        stack.push({ item: json, fieldKeyIndex: 0 });

        while (stack.length > 0) {
            var stackTask = stack.pop();
            var item = stackTask.item;
            var fieldKeyIndex = stackTask.fieldKeyIndex;
            var fieldKey = fieldKeys[fieldKeyIndex];

            //Test fieldKey Value.
            if (fieldKey == '*') {
                var sProcessedKeys = fieldKeys.slice(0, fieldKeyIndex).toString();

                _arrUtil.iteratorOverKeys(item, function (value, key) {
                    var curKey = sProcessedKeys + "," + key;
                    var _value = callback(value, key, curKey, numOfRows);
                    item[key] = _value;
                });

                numOfRows++;
                continue;
            }

            var jsonSubtree = item[fieldKey];
            if (Array.isArray(jsonSubtree)) { //It is an array.
                for (var j=0; j<jsonSubtree.length; j++) {
                    var jsonItem = jsonSubtree[j];
                    stack.push({ item: jsonItem, fieldKeyIndex: fieldKeyIndex+1 });
                }//EndForJ.
            } else {
                stack.push({ item: jsonSubtree, fieldKeyIndex: fieldKeyIndex+1 });
            }
        }//EndWhile.
    };//EndFunction.

    return {
        constructor: DataTypeConverter,

        /**
         * It parses the json in input and converts the content
         * in according to the inferred data types.
         * @param json
         * @param path Format: field1->field2->field3
         */
        convert: function (metadata) {
            debugger;
            jsonTraverse(metadata.dataset, metadata.fieldKeys, function(value, key, traversedKeys, rowIndex) {
                var inferredType = metadata.types[traversedKeys];

                if (inferredType.type == DataTypeConverter.TYPES.NUMBER.name) {
                    var number = parseFloat(value);
                    return  isNaN(number) ? value : number;
                }

                return value;
            });

           return metadata;
        },//EndFunction.

        /**
         * It parses the json and infers the data types.
         * @param json
         * @param path Array of field keys/names.
         */
        inferJsonDataType: function (json, fieldKeys) {
            var stack = [];
            var fieldsType = [];
            var numOfRows = 0;

            //Insert the first item (json root) within the stack.
            stack.push({ item: json, fieldKeyIndex: 0 });

            while (stack.length > 0) {
                var stackTask = stack.pop();
                var item = stackTask.item;
                var fieldKeyIndex = stackTask.fieldKeyIndex;
                var fieldKey = fieldKeys[fieldKeyIndex];

                //Test fieldKey Value.
                if (fieldKey == '*') {
                    var sProcessedKeys = fieldKeys.slice(0, fieldKeyIndex).toString();

                    _arrUtil.iteratorOverKeys(item, function (item, key) {
                        var inferredType = _processInferType(item);
                        var curKey = sProcessedKeys + "," + key;

                        var fieldType = _arrUtil.testAndSet(fieldsType, curKey, { name: curKey, _inferredTypes: [], _inferredValues: [], numOfItems: 0 });
                        fieldType.numOfItems++;
                        _arrUtil.testAndIncrement(fieldType._inferredTypes, inferredType.name);
                        if (inferredType === DataTypeConverter.TYPES.TEXT)
                            _arrUtil.testAndIncrement(fieldType._inferredValues, item);
                        if (inferredType === DataTypeConverter.TYPES.LATITUDE || inferredType === DataTypeConverter.TYPES.LONGITUDE)
                            _arrUtil.testAndIncrement(fieldType._inferredTypes, DataTypeConverter.TYPES.NUMBER);

                    });

                    numOfRows++;
                    continue;
                }

                var jsonSubtree = item[fieldKey];
                if (Array.isArray(jsonSubtree)) { //It is an array.
                    for (var j=0; j<jsonSubtree.length; j++) {
                        var jsonItem = jsonSubtree[j];
                        stack.push({ item: jsonItem, fieldKeyIndex: fieldKeyIndex+1 });
                    }//EndForJ.
                } else {
                    stack.push({ item: jsonSubtree, fieldKeyIndex: fieldKeyIndex+1 });
                }
            }//EndWhile.

            _analyseDataTypes(fieldsType);

            //Data quality.
            var quality = { homogeneity: 1 };
            _arrUtil.iteratorOverKeys(fieldsType, function(fieldType) {
                quality.homogeneity *= fieldType.typeConfidence;
            });

            return { dataset: json, fieldKeys: fieldKeys, types: fieldsType, qualityIndex: quality };
        },//EndFunction.

        inferDataTypes: function (jsonRows) {
            this._fields = [];
            this._numOfRows = 0;
            _processDataset(jsonRows);
            return this._fields;
        },//EndFunction.

        inferDataTypeOfValue: function (value) {
            return _processInferType(value);
        }//EndFunction.

    };
})();
