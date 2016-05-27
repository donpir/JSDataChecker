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

function DataTypeConverter() {
    this._fields = [];
    this._numOfRows = 0;
};//EndConstructor.

DataTypeConverter.TYPES = {
    TEXT        : { value: 0, name: "TEXT" },
    CODE        : { value: 1, name: "CODE"},

    NUMBER      : { value: 2, name: "NUMBER" },
    OBJECT      : { value: 3, name: "OBJECT" },


    BOOL        : { value: 5, name: "BOOL"},
    CONST       : { value: 6, name: "CONST" },
    CATEGORY    : { value: 7, name: "CATEGORY" },

    DATETIME    : { value: 8, name: "DATETIME" },



    EMPTY       : { value: 101, name: "NULL" }
};

DataTypeConverter.SUBTYPES = {
    PERCENTAGE  : { value: 1000, name: "PERCENTAGE" },
    LATITUDE    : { value: 1001, name: "LATITUDE" },
    LONGITUDE   : { value: 1002, name: "LONGITUDE" }
};

DataTypeConverter.prototype = (function () {

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

    /*var _processDataset = function (jsonRows) {
        //Check if the jsonRow is an array.
        if (Array.isArray(jsonRows) == false) return;

        for (var i=0; i<jsonRows.length; i++) {
            var jsonRow = jsonRows[i];
            _processRow(jsonRow);
        }//EndFor.

        _analyseDataTypes(this._fields);

        return this._fields;
    };//EndFunction.*/

    /*var _processRow = function(row) {
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
    };//EndFunction.*/

    var _analyseDataTypes = function(fields) {
        ArrayUtils.IteratorOverKeys(fields, function(field) {
            if (field._inferredTypes[DataTypeConverter.TYPES.CODE.name]) {
                var confidence = field._inferredTypes[DataTypeConverter.TYPES.CODE.name] / field.numOfItems;
                var _numericalInferredType = field._inferredTypes[DataTypeConverter.TYPES.NUMBER.name];
                if (typeof _numericalInferredType != 'undefined') confidence += _numericalInferredType / field.numOfItems;

                field.type = DataTypeConverter.TYPES.CODE.name;
                field.typeConfidence = confidence;
                return;
            }


            var max = ArrayUtils.FindMinMax(field._inferredTypes, function (curval, lastval) {
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
            /*var numOfValues = Object.keys(field._inferredValues).length;
            if (field.type === DataTypeConverter.TYPES.TEXT.name) {
                //if (numOfValues == 1) field.type = DataTypeConverter.TYPES.CONST.name;
                //else if (numOfValues == 2) field.type = DataTypeConverter.TYPES.BOOL.name;
                //else
                if (numOfValues < field.numOfItems * 0.20) field.type = DataTypeConverter.TYPES.CATEGORY.name;
            }*/
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
            return DataTypeConverter.TYPES.EMPTY;

        if (typeof value === 'object')
            return DataTypeConverter.TYPES.OBJECT;

        //If the value starts with a zero and contains all numbers, it is
        //inferred as textual content.
        if (/^0[0-9]+$/.test(value))
            return DataTypeConverter.TYPES.CODE;

        //Try to parse the float.
        var isnumber = DataTypesUtils.FilterFloat(value);
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

        var _date = DataTypesUtils.FilterDateTime(value);
        if (isNaN(_date) == false && _date != null)
            return DataTypeConverter.TYPES.DATETIME;


        return DataTypeConverter.TYPES.TEXT;
    };//EndFunction.

    var _processInferSubType = function(value) {
        //Try to parse lat/lng.

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
            if (fieldKey == '*' && ArrayUtils.isArray(item) == false) {
                var sProcessedKeys = fieldKeys.slice(0, fieldKeyIndex).toString();

                ArrayUtils.IteratorOverKeys(item, function (value, key) {
                    var curKey = sProcessedKeys + (sProcessedKeys.length > 0 ? "," : "")  + key;
                    var _value = callback(value, key, curKey, numOfRows);
                    item[key] = _value;
                });

                numOfRows++;
                continue;
            }

            //It is an array, loops through its cells and pushes items within the stack.
            if (fieldKey == '*' && ArrayUtils.isArray(item) == true) {
                for (var j= 0, cell; j<item.length && (cell = item[j]); j++) {
                    stack.push({item: cell, fieldKeyIndex: fieldKeyIndex});
                    numOfRows++;
                }
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
            var lastRowIndex = 0;
            var isRowInvalid = false;
            var numOfRowsInvalid = 0;

            var numOfRows = 0;
            var numOfValues = 0;

            var datasetErrors = 0;
            var datasetMissingValues = 0;

            jsonTraverse(metadata.dataset, metadata.fieldKeys, function(value, key, traversedKeys, rowIndex) {
                var inferredType = metadata.types[traversedKeys];
                numOfValues++;

                if (lastRowIndex != rowIndex) {
                    lastRowIndex = rowIndex;
                    numOfRows++;
                    //if (isRowInvalid) numOfRowsInvalid++;
                }

                if (value == null || typeof value == 'undefined' || (value + "").length == 0) {
                    //datasetErrors++;
                } //isRowInvalid = true;

                if (inferredType.type == DataTypeConverter.TYPES.NUMBER.name) {
                    var number = parseFloat(value);

                    if (isNaN(number)) {
                        datasetErrors++;
                        return value;
                    }

                    return number;
                }

                return value;
            });


            metadata.qualityIndex.notNullValues = (numOfValues - datasetMissingValues) / numOfValues;
            metadata.qualityIndex.errors = (numOfValues - datasetErrors) / numOfValues;

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

            if (typeof fieldKeys == 'undefined')
                throw "IllegalArgumentException: undefined json path to analyse.";

            //Insert the first item (json root) within the stack.
            stack.push({ item: json, fieldKeyIndex: 0 });

            while (stack.length > 0) {
                var stackTask = stack.pop();
                var item = stackTask.item;
                var fieldKeyIndex = stackTask.fieldKeyIndex;
                var fieldKey = fieldKeys[fieldKeyIndex];

                //Test fieldKey Value.
                //This if is executed when the fieldKey is * and the dataset it is NOT an ARRAY.
                //Thus, it loops through the javascript object KEYs.
                if (fieldKey == '*' && ArrayUtils.isArray(item) == false) {
                    var sProcessedKeys = fieldKeys.slice(0, fieldKeyIndex).toString();

                    ArrayUtils.IteratorOverKeys(item, function (item, key) {
                        var inferredType = _processInferType(item);
                        var curKey = sProcessedKeys + ((sProcessedKeys.length == 0) ? "" : ",") + key;

                        var fieldType = ArrayUtils.TestAndSet(fieldsType, curKey, { name: curKey, _inferredTypes: [], _inferredValues: [], numOfItems: 0 });
                        fieldType.numOfItems++;
                        ArrayUtils.TestAndIncrement(fieldType._inferredTypes, inferredType.name);
                        if (inferredType === DataTypeConverter.TYPES.TEXT)
                            ArrayUtils.TestAndIncrement(fieldType._inferredValues, item);
                        //if (inferredType === DataTypeConverter.TYPES.LATITUDE || inferredType === DataTypeConverter.TYPES.LONGITUDE)
                        //    ArrayUtils.TestAndIncrement(fieldType._inferredTypes, DataTypeConverter.TYPES.NUMBER);

                    });

                    numOfRows++;
                    continue;
                }

                //Loops through the array cells.
                if (fieldKey == '*' && ArrayUtils.isArray(item)) {
                    for (var j= 0, cell; j<item.length && (cell = item[j]); j++) {
                        stack.push({item: cell, fieldKeyIndex: fieldKeyIndex});
                        numOfRows++;
                    }
                    continue;
                }

                //This is executed when the fieldKey is not *
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
            var quality = { homogeneity: 1, completeness: 1, totalNullValues: 0, totalValues: 0 };
            ArrayUtils.IteratorOverKeys(fieldsType, function(fieldType) {
                quality.totalValues += fieldType.numOfItems;
                quality.homogeneity *= fieldType.typeConfidence;

                fieldType.totalNullValues = 0;
                if (fieldType._inferredTypes.hasOwnProperty(DataTypeConverter.TYPES.EMPTY.name)) {
                    fieldType.totalNullValues = fieldType._inferredTypes[DataTypeConverter.TYPES.EMPTY.name];
                    quality.totalNullValues += fieldType.totalNullValues;
                }

            });
            quality.homogeneity = Math.round(quality.homogeneity * 100) / 100;
            var totFullValues = quality.totalValues - quality.totalNullValues;
            quality.completeness = Math.round(totFullValues / quality.totalValues * 100) / 100;

            //Converts confidence to description.
            var warningsTextual = "";
            ArrayUtils.IteratorOverKeys(fieldsType, function(fieldType) {
                fieldType.errorsDescription = "";

                var description = "";

                //if (fieldType.typeConfidence < 1 || fieldType.totalNullValues > 0)
                //    description = "The field <" + fieldType.name + "> is a <" + fieldType.type + ">,  ";

                if (fieldType.typeConfidence < 1) {
                    /*if (fieldType._inferredTypes.hasOwnProperty(DataTypeConverter.TYPES.EMPTY.name)) {
                        var numNulls = fieldType._inferredTypes[DataTypeConverter.TYPES.EMPTY.name];
                        if (typeof numNulls !== 'undefined' && numNulls > 0)
                            description += " and has " + numNulls + " EMPTY values, ";
                    }*/

                    var incorrect = fieldType.numOfItems - fieldType.totalNullValues - fieldType._inferredTypes[fieldType.type];
                    if (incorrect > 0) {
                        description += "The column <" + fieldType.name + "> has the type <" + fieldType.type + ">  ";
                        description += ", but " + incorrect + " values are not a " + fieldType.type;
                    }
                }

                if (fieldType.totalNullValues > 0) {
                    description += "The column <" + fieldType.name + ">  has " + fieldType.totalNullValues + " EMPTY value";
                    if (fieldType.totalNullValues > 1) description += "s";
                }

                if (description.length > 0)
                    description += ".";

                fieldType.errorsDescription = description;
                warningsTextual += description;
            });

            return { dataset: json, fieldKeys: fieldKeys, types: fieldsType, qualityIndex: quality, warningsTextual: warningsTextual };
        },//EndFunction.

        /*inferDataTypes: function (jsonRows) {
            this._fields = [];
            this._numOfRows = 0;
            _processDataset(jsonRows);
            return this._fields;
        },//EndFunction.*/

        /**
         * Given in input a value, the function infers the data type.
         * @param value
         * @returns {*}
         */
        inferDataTypeOfValue: function (value) {
            return _processInferType(value);
        }//EndFunction.

    };
})();
