if (typeof define !== 'function') { var define = require('amdefine')(module) } 
define(function (require, exports, module) { 
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

function ArrayUtils() {}

/**
 * It tests if the array has an element with the specified key,
 * if does not have the key it initialises it with the object.
 * @param arr
 * @param key
 * @param object
 * @returns {*}
 * @constructor
 */
ArrayUtils.TestAndSet = function (arr, key, object) {
    if (typeof arr == 'undefined') return null;
    if (Array.isArray(arr) == false) return null;
    if (typeof arr[key] == 'undefined')
        arr[key] = object;
    return arr[key];
};//EndFunction.

ArrayUtils.TestAndInitializeKey = function (obj, key, value) {
    if (typeof obj == 'undefined') return null;
    if (typeof obj[key] == 'undefined')
        obj[key] = value;

    return obj[key];
};//EndFunction.

/***
 * It tests whether the array has the key, if not it insert it;
 * then increases the value by one unit.
 * @param arr
 * @param key
 * @returns {The array}
 */
ArrayUtils.TestAndIncrement = function (arr, key) {
    var exists = arr[key];
    if (typeof exists === 'undefined') arr[key] = 0;
    arr[key]++;
    return arr;
};//EndFunction.

/***
 * It converts the object to an array. It loops through the object
 * keys/properties, retrieves the objects and pushes it in the array.
 * @param obj
 * @returns {Array}
 */
ArrayUtils.toFieldsArray = function (obj) {
    var fields = [];

    ArrayUtils.IteratorOverKeys(obj, function(field, key) {
        field.key = key;
        fields.push(field);
    });

    return fields;
};//EndFunction.

/**
 * Iterate over the key within the array arr. For each array
 * value it calls the callback function.
 * @param arr
 * @param callback
 * @constructor
 */
ArrayUtils.IteratorOverKeys = function (arr, callback) {
    for (var property in arr) {
        if (arr.hasOwnProperty(property)) {
            var item = arr[property];
            callback(item, property);
        }
    }
};//EndFunction.

/**
 * Find the item with the max value within the array.
 * @param arr
 * @returns {*} It is an object with index, key, value.
 */
ArrayUtils.FindMinMax = function (arr, fncompare) {
    var max1 = null;
    var max2 = null;

    for (var key in arr) {
        //if (max1 == null) //Only the first time.
        //    max1 = {index: -1, key: key, value: arr[key]};

        if (max1 == null || fncompare(arr[key], max1.value)) {
            max2 = max1;
            max1 = {index: -1, key: key, value: arr[key]};
        } else if (max2 == null || fncompare(arr[key], max2.value))
            max2 = {index: -1, key: key, value: arr[key]};

    }//EndFor.

    return { first: max1, second: max2 };
}//EndFunction.

ArrayUtils.isArray = function (arr) {
    if (Array.isArray(arr))
        return (arr.length > 0);
    return false;
}//EndFunction.

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
    EMPTY       : { value: 0, name: "NULL"},

    TEXT        : { value: 1, name: "TEXT" },
    NUMBER      : { value: 2, name: "NUMBER" },
    OBJECT      : { value: 3, name: "OBJECT" },
    DATETIME    : { value: 4, name: "DATETIME" }
};

DataTypeConverter.SUBTYPES = {
    GEOCOORDINATE   :   { value: 1000, name: "GEOCOORDINATE" },
    GEOJSON         :   { value: 1001, name: "GEOJSON" },
    BOOL            :   { value: 1002, name: "BOOL"},
    CONST           :   { value: 1003, name: "CONST" },
    CATEGORY        :   { value: 1004, name: "CATEGORY" },

    LATITUDE        :   { value: 1101, name: "LATITUDE" },
    LONGITUDE       :   { value: 1102, name: "LONGITUDE" },

    DATETIMEYM      :   { value:  1200, name: "DATETIMEYM" },
    DATETIMEYMD     :   { value:  1201, name: "DATETIMEYMD" },
    DATETIMEDMY     :   { value:  1202, name: "DATETIMEDMY" },
    DATETIMEMDY     :   { value:  1203, name: "DATETIMEMDY" },
    DATETIMEXXY     :   { value:  1203, name: "DATETIMEXXY" },

    NUMINTEGER      :   { value:  1300, name: "INTEGER" },
    NUMREAL         :   { value:  1300, name: "REAL" },
    PERCENTAGE      :   { value:  1400, name: "PERCENTAGE" },

    /*CODE        : { value: 2000, name: "CODE"},*/
};

DataTypeConverter.LANGS = {
    EN   :   { value: 1000, name: "EN" },
    IT   :   { value: 1001, name: "IT" },
    FR   :   { value: 1100, name: "FR" },
    NL   :   { value: 1101, name: "NL" }
};


DataTypeConverter.GEOJSONTYPES = [ "Point", "MultiPoint", "LineString",
    "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection", "Feature",
    "FeatureCollection" ];

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


            /*
            //TODO: removed CODE, I don't know whether it must be inserted
            if (field._inferredTypes[DataTypeConverter.TYPES.CODE.name]) {
                var confidence = field._inferredTypes[DataTypeConverter.TYPES.CODE.name] / field.numOfItems;
                var _numericalInferredType = field._inferredTypes[DataTypeConverter.TYPES.NUMBER.name];
                if (typeof _numericalInferredType != 'undefined') confidence += _numericalInferredType / field.numOfItems;

                field.type = DataTypeConverter.TYPES.CODE.name;
                field.typeConfidence = confidence;
                return;
            }*/

            //Infers the field TYPE.
            var max = ArrayUtils.FindMinMax(field._inferredTypes, function (curval, lastval) {
                return curval > lastval;
            });

            //When the first key is null, it uses the second one.
            var tkey = max.first.key;
            if (tkey === DataTypeConverter.TYPES.EMPTY.name &&
                max.second != null && typeof max.second !== 'undefined')
                tkey = max.second.key;

            field.type = tkey;
            field.typeConfidence = field._inferredTypes[field.type] / field.numOfItems;
            // field.typeConfidence = field._inferredTypes[max.first.key] / field.numOfItems; //BUG? max.first.key


            //##########
            //Infers the field SUBTYPE.

            var max = ArrayUtils.FindMinMax(field._inferredSubTypes, function (curval, lastval) {
                return curval > lastval;
            });

            //SUBTYPE: special case with date format - when the system selects the XXY subtype.
            if (typeof max !== 'undefined' && max != null &&
                typeof max.first !== 'undefined' && max.first != null && max.first.key === DataTypeConverter.SUBTYPES.DATETIMEXXY.name &&
                typeof max.second !== 'undefined' && max.second != null) {
                //Swaps first and second.
                var temp = max.first;
                max.first = max.second;
                max.second = temp;
            }

            //SUBTYPE special case, when two DATETIME formats have the same number of items, the system cannot
            //determine the format.
            if (max.second !== 'undefined' && max.second != null && max.second.key === DataTypeConverter.SUBTYPES.DATETIMEXXY.name) {
                var counter = 0;
                var valueToCompare = field._inferredSubTypes[max.first.key];
                for (var _key in field._inferredSubTypes) {
                    if (_key === DataTypeConverter.SUBTYPES.DATETIMEXXY.name) continue;
                    if (field._inferredSubTypes[_key] == valueToCompare) counter++;
                }//EndFor.
                if (counter > 1) { //There are two formats that have two equal number of cells.
                    max.first = max.second;
                    max.second = null;
                }
            }

            field.subtype = null;
            if (max != null && max.first != null) {
                field.subtype = max.first.key;
                field.subtypeConfidence = field._inferredSubTypes[field.subtype] / field.numOfItems;

                //TODO: improve this piece of code.
                //LAT/LNG.
                var fieldName = field.name.toLowerCase();
                var isLatType = (field.subtype === DataTypeConverter.SUBTYPES.LATITUDE.name);
                var fieldNameContainsLat = fieldName.indexOf('lat') >= 0;
                var fieldNameContainsLon = fieldName.indexOf('ng') >= 0; //It could be 'lng'.
                if (isLatType == true && fieldNameContainsLat == false && fieldNameContainsLon == true) {
                    field.subtype = DataTypeConverter.SUBTYPES.LONGITUDE.name;
                }
            }

            ///
            /// SUBTYPES.


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

        if (value === null || typeof value === 'undefined')
            return DataTypeConverter.TYPES.EMPTY;

        if (typeof value === 'object')
            return DataTypeConverter.TYPES.OBJECT;

        //Try to parse the float.
        //var isnumber = DataTypesUtils.FilterFloat(value);
        var isnumber = DataTypesUtils.FilterNumber(value);
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

        //Tries to indentify whether the value is a data and/or time.
        var _datetype = DataTypesUtils.FilterDateTime(value);
        if (_datetype != null) return _datetype;

        //Tries to identify whether the value is a percentage.
        var _datetype = DataTypesUtils.FilterPercentage(value);
        if (_datetype != null) return _datetype;

        return DataTypeConverter.TYPES.TEXT;
    };//EndFunction.

    var _processInferSubType = function (value) {
        if (value === null || typeof value === 'undefined') return null;

        //GEOCOORDINATE
        if (Array.isArray(value) && value.length == 2) {//It recognises the LAT LNG as array of two values.
            //Checks if the two array's values are numbers.
            //if ( DataTypesUtils.FilterFloat(value[0]) != NaN && DataTypesUtils.FilterFloat(value[1]) != NaN  )
            if ( DataTypesUtils.FilterNumber(value[0]) != NaN && DataTypesUtils.FilterNumber(value[1]) != NaN  )
                if (DataTypesUtils.DecimalPlaces(value[0]) > 4 && DataTypesUtils.DecimalPlaces(value[1]) > 4 )
                    return DataTypeConverter.SUBTYPES.GEOCOORDINATE;
        }//EndIf.

        if (typeof value === 'string') {
            var split = value.split(",");
            //if (split.length == 2)
                if (DataTypesUtils.IsLatLng(split[0]) && DataTypesUtils.IsLatLng(split[1]))
                    return DataTypeConverter.SUBTYPES.GEOCOORDINATE;
        }

        //Try to parse the float.
        //var isnumber = DataTypesUtils.FilterFloat(value);
        var isnumber = DataTypesUtils.FilterNumber(value);
        if (isNaN(isnumber) !== true) {//It is a number.

            //If the number ranges from -90.0 to 90.0, the value is marked as Latitude.
            if (-90.0 <= isnumber && isnumber <= 90.0 && DataTypesUtils.DecimalPlaces(isnumber) >= 5)
                return DataTypeConverter.SUBTYPES.GEOCOORDINATE;

            //It the number ranges from -180.0 to 180.0, the value is marked as Longitude.
            if (-180.0 <= isnumber && isnumber <= 180.0 && DataTypesUtils.DecimalPlaces(isnumber) >= 5)
                return DataTypeConverter.SUBTYPES.GEOCOORDINATE;

            /*if (0.0 <= isnumber && isnumber <= 100.0)
                if(/^(\+)?((0|([1-9][0-9]*))\.([0-9]+))$/ .test(value))
                    return DataTypeConverter.SUBTYPES.PERCENTAGE;*/

            //Distinguish between INTEGER and REAL numbers (the discriminant is the presence of a dot or a comma.
            var parts = (value+"").split(/(,|\.)/g);
            if (parts.length > 1)
                return DataTypeConverter.SUBTYPES.NUMREAL;
            else
                return DataTypeConverter.SUBTYPES.NUMINTEGER;

            return null;
        }

        //Try to parse GEOJSON.
        if (typeof value === 'object' && value.hasOwnProperty('type')) {
            //Check the type variable.
            var geotype = value.type;
            var isincluded = DataTypeConverter.GEOJSONTYPES.includes(geotype);
            if (isincluded) return DataTypeConverter.SUBTYPES.GEOJSON;
        }

        //If the value starts with a zero and contains all numbers, it is
        //inferred as textual content.
        /*if (/^0[0-9]+$/.test(value))
         return DataTypeConverter.TYPES.CODE;*/

        return null;
    };//EndFunction.

    var _filterBasedOnThreshold = function(metadata, threshold) {
        ArrayUtils.IteratorOverKeys(metadata.types, function (fieldType, key) {
            if (fieldType.typeConfidence >= threshold) return;

            var arrHierarchyTypes = DataTypeHierarchy.HIERARCHY[fieldType.type];
            if (arrHierarchyTypes == null)
                return metadata;

            var lastFieldType = { lastType: arrHierarchyTypes[0],
                lastTypeCounter: fieldType._inferredTypes[arrHierarchyTypes[0]],
                typeConfidence:  0 };
            lastFieldType.typeConfidence = lastFieldType.lastTypeCounter / fieldType.numOfItems;

            for (var i= 1, curType; i<arrHierarchyTypes.length, curType = arrHierarchyTypes[i]; i++) {
                var numItemsOfCurType = fieldType._inferredTypes.hasOwnProperty(curType) ? fieldType._inferredTypes[curType] : 0 ;
                lastFieldType.lastType = curType;
                lastFieldType.lastTypeCounter += numItemsOfCurType;
                lastFieldType.typeConfidence = lastFieldType.lastTypeCounter / fieldType.numOfItems;

                if (lastFieldType.typeConfidence >= threshold) {
                    fieldType.type = lastFieldType.lastType;
                    fieldType.typeConfidence = lastFieldType.typeConfidence;
                    break;
                }
            }
        });

        return metadata;
    };//EndFunction.

    var _capitalizeFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };//EndFunction.

    var _replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

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
         *
         * @param metadata Previous information on the inferred types.
         * @param options Some options to cast the data.
         *     - castThresholdConfidence: for which threshold the library must perform the cast (default 1)
         *     - makeChangesToDataset: is a boolean value, to indicate whether the library can do improvement on the storage
         *     values, for instance, numbers with the comma will be replaced with the dot.
         * @returns {*}
         */
        cast: function(metadata, options) {
            if (typeof options === 'undefined' || options == null)
                options = { castThresholdConfidence: 1, castIfNull: false, makeChangesToDataset: false };
            return this.convert(metadata, options);
        },

        /**
         * It parses the json in input and converts the content
         * in according to the inferred data types.
         * @param json
         * @param path Format: field1->field2->field3
         * @deprecated
         */
        convert: function (metadata, options) {
            var lastRowIndex = 0;
            var isRowInvalid = false;
            var numOfRowsInvalid = 0;

            var numOfRows = 0;
            var numOfValues = 0;

            var datasetErrors = 0;
            var datasetMissingValues = 0;

            if (typeof options === 'undefined' || options == null)
                options = { castThresholdConfidence: 1, castIfNull: false, makeChangesToDataset: false };

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

                //var isCast = !(options.castIfNull == false && inferredType.totalNullValues > 0);
                var isCast = inferredType.typeConfidence >= options.castThresholdConfidence;
                if (inferredType.type == DataTypeConverter.TYPES.NUMBER.name && isCast) {
                    //It is a number but I need to check also the subtype to see whether it is a percentage.
                    if (inferredType.subtype === DataTypeConverter.SUBTYPES.PERCENTAGE.name) {
                        if (value == null || typeof value == 'undefined' || (value + "").length == 0) {
                            //datasetErrors++;
                        } else {
                            var dt = DataTypesUtils.FilterPercentage(value);
                            if (typeof dt !== 'undefined' && 'type' in dt)
                                return dt.value;
                        }
                    }

                    //--- It is a number (not a pecentage)
                    if (isNaN(DataTypesUtils.FilterNumber(value)) == false && typeof value === "string")
                        value = value.replace(',', '.');

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
         * @param The json (it is mainly a treee) can be very big and one would not analyse it as whole
         * but only a part of it. One can decide to analyse only a part of the json by indicating the path
         * within the tree to analyse. The parameter fieldKeys is an array with keys within the json to analyse.
         * @param options to use during the Infer Data Type process, in particular
         *     - threshold value for the confidence;
         *     - language of messages.
         */
        inferJsonDataType: function (json, fieldKeys, options) {

            //Default options initialisation.
            if (typeof options === 'undefined' || options == null) options = { };

            if (options.hasOwnProperty("thresholdConfidence") == false)
                options.thresholdConfidence = 1;

            if (options.hasOwnProperty("filterOnThresholdConfidence") == false)
                options.filterOnThresholdConfidence = true;


            if (options.hasOwnProperty("language") == false)
                options.language = DataTypeConverter.LANGS.EN.name;
            else
                options.language = options.language.toUpperCase();

            if (options.hasOwnProperty('trackCellsForEachType') == false)
                options.trackCellsForEachType = false;

            var stack = [];
            var fieldsType = {};
            var fieldsSubType = {};
            var numOfRows = 0;

            if (typeof fieldKeys == 'undefined')
                throw "IllegalArgumentException: undefined json path to analyse.";

            //Insert the first item (json root) within the stack.
            stack.push({ item: json, fieldKeyIndex: 0 });

            while (stack.length > 0) {
                var stackTask = stack.pop();
                var item = stackTask.item;

                var fieldKeyIndex = stackTask.fieldKeyIndex; //Index within the fieldKeys.
                var fieldKey = fieldKeys[fieldKeyIndex]; //Value within the filedKeys corresponding to the fieldKeyIndex.

                //Test fieldKey Value.
                //This if is executed when the fieldKey is * and the dataset it is NOT an ARRAY.
                //Thus, it loops through the javascript object KEYs.
                if (fieldKey == '*' && ArrayUtils.isArray(item) == false) {
                    var sProcessedKeys = fieldKeys.slice(0, fieldKeyIndex).toString();

                    ArrayUtils.IteratorOverKeys(item, function (item, key) {
                        var curKey = sProcessedKeys + ((sProcessedKeys.length == 0) ? "" : ",") + key;

                        var _label = curKey;
                        if (typeof json !== 'undefined' && json.hasOwnProperty('fields')) {
                            if (typeof json.fields[key] !== 'undefined') _label = json.fields[key].label;
                            else {
                                for (var iField=0,field; iField < json.fields.length && (field=json.fields[iField]); iField++) {
                                    if (field.hasOwnProperty('name') && field.name === key && field.hasOwnProperty('label'))
                                        _label = field.label;
                                }//EndFor.
                            }
                        }

                        var fieldType = ArrayUtils.TestAndInitializeKey(fieldsType, curKey, { name: curKey, label: _label, _inferredTypes: [], _inferredSubTypes: [], _inferredValues: [], numOfItems: 0 });
                        fieldType.numOfItems++;

                        ///TYPE
                        var compundTypeSubtype = _processInferType(item);

                        var inferredType = compundTypeSubtype;
                        if (compundTypeSubtype.hasOwnProperty("type")) inferredType = compundTypeSubtype.type;

                        ArrayUtils.TestAndIncrement(fieldType._inferredTypes, inferredType.name);
                        if (inferredType === DataTypeConverter.TYPES.TEXT)
                            ArrayUtils.TestAndIncrement(fieldType._inferredValues, item);

                        ///Tracks for each type X the cells in the dataset of that type.
                        if (options.trackCellsForEachType) {
                            var listCells = ArrayUtils.TestAndInitializeKey(fieldType._inferredTypes, inferredType.name + "_cells", []);
                            listCells.push({ columnKey: key, rowIndex: numOfRows });
                        }

                        ///SUBTYPE
                        var inferredSubType = compundTypeSubtype.hasOwnProperty("subtype") ? compundTypeSubtype.subtype : _processInferSubType(item);
                        if (inferredSubType != null && typeof inferredSubType !== 'undefined') {
                            ArrayUtils.TestAndIncrement(fieldType._inferredSubTypes, inferredSubType.name);
                            /*if (inferredSubType === DataTypeConverter.TYPES.LATITUDE)
                                ArrayUtils.TestAndIncrement(fieldType._inferredSubTypes, DataTypeConverter.TYPES.LATITUDE);
                            if (inferredSubType === DataTypeConverter.TYPES.LONGITUDE)
                                ArrayUtils.TestAndIncrement(fieldType._inferredSubTypes, DataTypeConverter.TYPES.LONGITUDE);*/
                        }//EndSubtype.

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

                //This is executed when the fieldKey is not '*'.
                var jsonSubtree = item[fieldKey]; //Takes the json subtree.
                if (Array.isArray(jsonSubtree)) { //It is an array, hence loops through the array and takes its items.
                    //Note: it is better to push items in reverse order in the stack, to conserve the processing sort.
                    //for (var j=0; j<jsonSubtree.length; j++) {
                    for (var j=jsonSubtree.length-1; j>=0; j--) {
                        var jsonItem = jsonSubtree[j];
                        stack.push({ item: jsonItem, fieldKeyIndex: fieldKeyIndex+1 });
                    }//EndForJ.
                } else {
                    stack.push({ item: jsonSubtree, fieldKeyIndex: fieldKeyIndex+1 });
                }
            }//EndWhile.


            //Calculates the number of rows in the dataset.
            var _numOfRows = 0;
            ArrayUtils.IteratorOverKeys(fieldsType, function(fieldType) {
                if (fieldType.numOfItems > _numOfRows)
                    _numOfRows = fieldType.numOfItems;
            });

            //Computes the number of null values.
            ArrayUtils.IteratorOverKeys(fieldsType, function(fieldType) {
                if (!fieldType._inferredTypes.hasOwnProperty(DataTypeConverter.TYPES.EMPTY.name)) {
                    //Initialises the field.
                    fieldType._inferredTypes[DataTypeConverter.TYPES.EMPTY.name] = 0;
                }

                fieldType._inferredTypes[DataTypeConverter.TYPES.EMPTY.name] = fieldType._inferredTypes[DataTypeConverter.TYPES.EMPTY.name] +  (_numOfRows - fieldType.numOfItems);
            });

            //Infers the data type.
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

            //TRANSLATIONS.
            ArrayUtils.IteratorOverKeys(fieldsType, function(fieldType) {
                //Translates the type.
                var _type = fieldType.type;
                fieldType.typeLabel = _type; //Default value.
                var _lngkey = ('key_type' + _type).toLowerCase();
                if (JDC_LNG.hasOwnProperty(_lngkey)) {
                    var _entry = JDC_LNG[_lngkey];
                    if (_entry.hasOwnProperty(options.language)) {
                        fieldType.typeLabel = _entry[options.language];
                    } else {
                        console.warn("JSDatachecker translation not found. Language " + options.language + ". Type " + _type);
                    }
                } else {
                    console.warn("JSDatachecker translation not found. Language " + options.language + ". Type " + _type);
                }

                //Translates the subtype.
                var _subtype = fieldType.subtype;
                fieldType.subtypeLabel = _subtype;
                if (_subtype != null) {
                    var _lngkey = ('key_subtype' + _subtype).toLowerCase();
                    if (JDC_LNG.hasOwnProperty(_lngkey)) {
                        var _entry = JDC_LNG[_lngkey];
                        if (_entry.hasOwnProperty(options.language)) {
                            fieldType.subtypeLabel = _entry[options.language];
                        } else {
                            console.warn("JSDatachecker translation not found. Language " + options.language + ". Subtype " + _subtype);
                        }
                    } else {
                        console.warn("JSDatachecker translation not found. Language " + options.language + ". Subtype " + _subtype);
                    }
                }

            });

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

                    //var incorrect = fieldType.numOfItems - fieldType.totalNullValues - fieldType._inferredTypes[fieldType.type];
                    var incorrect = fieldType.numOfItems - fieldType._inferredTypes[fieldType.type];
                    if (incorrect > 0) {
                        var _descr1 = _capitalizeFirstLetter(JDC_LNG['key_declaretype'][options.language]) + ".";
                        var _descr2 = _capitalizeFirstLetter(JDC_LNG['key_notoftype_singular'][options.language]) + ".";
                        if (incorrect > 1)
                            _descr2 = _capitalizeFirstLetter(JDC_LNG['key_notoftype_plural'][options.language]) + ".";

                        var _descr3 = ""; var _LISTWRONGROS = "";

                        if (options.trackCellsForEachType) {
                            _descr3 = _capitalizeFirstLetter(JDC_LNG['key_seewrongrows'][options.language]) + ".";

                            //At the end, this array contains keys with wrong types.
                            var keysWrongTypes =  Object.keys(fieldType._inferredTypes).filter(function(typekey) {
                                return (typekey.indexOf("_cells") <0) && (fieldType._inferredTypes[typekey] > 0)
                                    && (typekey !== fieldType.type);
                            });

                            //Loop through the wrong types to collect the cells.
                            //Each type has an array with wrong cells.
                            fieldType.cellsWithWarnings = [];
                            for (var iKeyType=0; iKeyType<keysWrongTypes.length; iKeyType++) {
                                var _keywrongtype = keysWrongTypes[iKeyType];
                                var _wrongcells = fieldType._inferredTypes[_keywrongtype + "_cells"];
                                if (typeof _wrongcells === 'undefined') continue;

                                //Loop on the cells.
                                for (var icell = 0; icell < _wrongcells.length; icell++) {
                                    var _cell = _wrongcells[icell];

                                    var _warningMessage = _capitalizeFirstLetter(JDC_LNG['key_declaretype'][options.language]) + ". ";
                                    _warningMessage += _capitalizeFirstLetter(JDC_LNG['key_cellnotoftype'][options.language]) + ". ";
                                    _warningMessage = _warningMessage.replace(/%COL_NAME/g, fieldType.label);
                                    _warningMessage = _warningMessage.replace(/%COL_TYPE/g, fieldType.type);
                                    _cell.warningMessage = _warningMessage;

                                    //Build the warning message for the cell.
                                    if (_keywrongtype === DataTypeConverter.TYPES.EMPTY.name)
                                        _cell.warningMessage = _capitalizeFirstLetter(JDC_LNG['key_emptycell'][options.language]) + ".";

                                    fieldType.cellsWithWarnings.push(_cell);
                                }//EndFor.
                            }//EndFor.

                            //Build the message for the user.
                            for (var iKeyType=0; iKeyType<keysWrongTypes.length; iKeyType++) {
                                var _keytype = keysWrongTypes[iKeyType];
                                var _cells = fieldType._inferredTypes[_keytype + "_cells"];
                                if (typeof _cells === 'undefined') continue;

                                for (var icell = 0; icell < _cells.length; icell++) {
                                    var _cell = _cells[icell];
                                    _LISTWRONGROS += (_cell.rowIndex + 2) + "(" + _keytype + ")" +
                                        (icell == _cells.length - 2 ? ", and " : "") +
                                        (icell < _cells.length - 2 ? ", " : "");
                                }
                            }//EndForInfTypes.
                        }

                        var descr = _descr1 + " " + _descr2 + " " + _descr3;
                        descr = descr.replace(/%COL_NAME/g, fieldType.label);
                        descr = descr.replace(/%COL_TYPE/g, fieldType.type);
                        descr = descr.replace(/%COL_ERRORS/g, incorrect);
                        descr = descr.replace(/%LIST_WRONG_ROWS/g, _LISTWRONGROS);

                        description += descr;

                        /*description += "The column <" + fieldType.name + "> has the type <" + fieldType.type + ">";
                        var verb = (incorrect == 1) ? " value is" : " values are";
                        description += ", but " + incorrect + verb + " not a " + fieldType.type;*/
                    }

                }

                //Warning messages on the DATETIME formats.
                if (fieldType.type === DataTypeConverter.TYPES.DATETIME.name) {
                    if (fieldType.subtype === DataTypeConverter.SUBTYPES.DATETIMEXXY.name) {
                        description += " " + _capitalizeFirstLetter(JDC_LNG['key_dateformatunknown'][options.language]) + ". ";
                    } else {
                        var valuesNotInRecognizedFormat = fieldType.numOfItems - fieldType._inferredSubTypes[fieldType.subtype] -
                            (fieldType.hasOwnProperty(DataTypeConverter.SUBTYPES.DATETIMEXXY.name)?
                                fieldType._inferredSubTypes[DataTypeConverter.SUBTYPES.DATETIMEXXY.name] : 0);
                        if (valuesNotInRecognizedFormat > 0) {
                            var descr = _capitalizeFirstLetter(JDC_LNG['key_datenotinformat'][options.language]);
                            descr = descr.replace(/%COL_NUMDATENOTINFORMAT/g, valuesNotInRecognizedFormat);
                            description += descr;
                        }
                    }
                }

                var descr = "";
                if (fieldType.totalNullValues == 1)
                    descr = _capitalizeFirstLetter(JDC_LNG['key_emptyvalue_singolar'][options.language]) + ".";
                else if (fieldType.totalNullValues > 1 )
                    descr = _capitalizeFirstLetter(JDC_LNG['key_emptyvalue_plural'][options.language]) + ".";

                //descr = descr.replace(/%COL_NAME/g, fieldType.label);
                //descr = descr.replace(/%COL_TYPE/g, fieldType.type);
                //descr = descr.replace(/%COL_NULLVALUES/g, fieldType.totalNullValues);
                description = description + " " + descr;

                //Replaces keyword in the warning descriptions.
                description = description.replace(/%COL_NAME/g, fieldType.label);
                description = description.replace(/%COL_TYPE/g, fieldType.type);
                description = description.replace(/%COL_SUBTYPE/g, fieldType.subtypeLabel);
                description = description.replace(/%COL_NULLVALUES/g, fieldType.totalNullValues);

                /*if (fieldType.totalNullValues > 0) {
                    var descr = _capitalizeFirstLetter(JDC_LNG['key_declaretype'][options.language]) + ".";

                    description += "The column <" + fieldType.name + "> has " + fieldType.totalNullValues + " EMPTY value";
                    if (fieldType.totalNullValues > 1) description += "s";
                }

                if (description.length > 0)
                    description += ".";*/

                fieldType.errorsDescription = description.trim();
                warningsTextual += description.trim();
            });

            var metadata = { dataset: json, fieldKeys: fieldKeys, types: fieldsType, qualityIndex: quality, warningsTextual: warningsTextual };

            if (options.filterOnThresholdConfidence == true)
                _filterBasedOnThreshold(metadata, options.thresholdConfidence);

            return metadata;
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
        },//EndFunction.

        /**
         * Given in input a value, the function infers the data type.
         * @param value
         * @returns {*}
         */
        inferDataSubTypeOfValue: function (value) {
            return _processInferSubType(value);
        }//EndFunction.

    };
})();


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

function DataTypesUtils() {}

DataTypesUtils.FilterTime = function (value) {
    var expTime = /^[0-9]{2}:[0-9]{2}(:[0-9]{2})?(\+[0-9]{2}:[0-9]{2})?$/;
    if (expTime.test(value) == false) return null;

    var splitted = value.split(/[:|\+]/);

    var expNumber = /^[0-9]{2}$/;
    var HH = expNumber.test(splitted[0]) ? parseInt(splitted[0]) : 0;
    var MM = expNumber.test(splitted[1]) ? parseInt(splitted[1]) : 0;
    var SS = splitted.length >=3 && expNumber.test(splitted[2]) ? parseInt(splitted[2]) : 0;

    var dt = new Date();
    dt.setHours(HH);
    dt.setMinutes(MM);
    dt.setSeconds(SS);
    return dt;
}//EndFunction.

DataTypesUtils.FilterDateTime = function (value) {
    var _dtSplitted = value.split(/[T|\s]/);
    if (_dtSplitted.length == 2) {
        var dtTime = DataTypesUtils.FilterTime(_dtSplitted[1]);
        if (dtTime == null) return null;

        var dtDateTime = DataTypesUtils.FilterDate(_dtSplitted[0], dtTime);
        return dtDateTime;
    } else {
        var dtDate = DataTypesUtils.FilterDate(value);
        if (dtDate != null) return dtDate;

        var dtTime = DataTypesUtils.FilterTime(value);
        return dtTime;
    }
}//EndFunction.

/***
 * Recognized date formats are:
 *     * YYYY-MM
 *     * YYYY-MM-DD
 *     * DD-MM-YYYY
 *     * MM-DD-YYYY
 * @param value
 * @param dtDate
 * @returns {*}
 * @constructor
 */
DataTypesUtils.FilterDate = function (value, dtDate) {
    if (dtDate == null) dtDate = new Date("YYYY-MM-DD");

    // [YYYY-MM] year-month.
    if (/^[0-9]{1,4}(\-|\/)[0-9]{1,2}$/.test(value)) {
        var splitted = value.split(/[\-|\/]/);
        var year = parseInt(splitted[0]);
        var month = parseInt(splitted[1]);

        if (month > 12) return null;

        dtDate.setYear(year);
        dtDate.setMonth(month);
        return { type: DataTypeConverter.TYPES.DATETIME, subtype: DataTypeConverter.SUBTYPES.DATETIMEYM, date: dtDate };
    }

    // [YYYY-MM-DD]
    var expDate = /^[0-9]{1,4}(\-|\/)[0-9]{1,2}((\-|\/)[0-9]{1,2})?$/;
    if (expDate.test(value)) {
        var splitted = value.split(/[\-|\/]/);
        var year = parseInt(splitted[0]);
        var month = parseInt(splitted[1]);
        var day = splitted.length == 3 ? parseInt(splitted[2]) : 0;

        //Checks the range.
        if (month <= 0 || month >= 13) return null;
        if (day <= 0 || day >= 32) return null;

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return { type: DataTypeConverter.TYPES.DATETIME, subtype: DataTypeConverter.SUBTYPES.DATETIMEYMD, date: dtDate };
    }

    /// DD-MM-YYYY or MM-DD-YYYY
    expDate = /^[0-9]{1,2}(\-|\/)[0-9]{1,2}(\-|\/)[0-9]{1,4}$/;
    if (expDate.test(value)) {
        var splitted = value.split(/[\-|\/]/);
        var year = parseInt(splitted[2]);
        var month = parseInt(splitted[1]);
        var day = parseInt(splitted[0]);
        var result =  { type: DataTypeConverter.TYPES.DATETIME, subtype: DataTypeConverter.SUBTYPES.DATETIMEDMY, date: dtDate };

        //Here, recognises the American vs Italian format.
        //When month is greater than twelve, it swaps month and day variable.
        if (month > 12) {
            var temp = month;
            month = day;
            day = temp;
            result.subtype = DataTypeConverter.SUBTYPES.DATETIMEMDY;
        }

        //Checks the range.
        if (month <= 0 || month >= 13) return null;
        if (day <= 0 || day >= 32) return null;

        if (day <= 12 && month <= 12) result.subtype = DataTypeConverter.SUBTYPES.DATETIMEXXY; //It can be both formats.

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return result;
    }

    return null;
};//EndFunction.

/**
 * Converts the value in a number, NaN if it is not a number.
 * @param value
 * @returns {*}
 */
DataTypesUtils.FilterFloat = function (value) {
    if(/^(\-|\+)?((0|([1-9][0-9]*))(\.[0-9]+)?|Infinity)$/
            .test(value))
        return Number(value);
    return NaN;
};//EndFunction.

DataTypesUtils.FilterPercentage = function (value) {
    value = value.trim();
    var index = value.indexOf("%");
    if (index < 0) //Percentage symbol not found.
        return null;

    if (index != value.length - 1)
        return null;

    var _number = value.split('%')[0].trim();
    var number = DataTypesUtils.FilterNumber(_number);
    if (isNaN(number))
        return null;

    return { type: DataTypeConverter.TYPES.NUMBER, subtype: DataTypeConverter.SUBTYPES.PERCENTAGE, value: number};
};//EndFunction.

DataTypesUtils.FilterNumber = function (value) {
    //Check immediatly if it is a classical number.
    var valnum = DataTypesUtils.FilterFloat(value);
    if (isNaN(valnum) == false) return valnum;

    //Checks if the value is a string.
    if (typeof value !== "string")
        return NaN;

    var parts = value.split(/(,|\.)/g);

    //Find the smallest symbol.
    var idxDot          = { idx: value.indexOf('.'), sym: '.' };
    var idxComma        = { idx: value.lastIndexOf(','), sym: ',' };
    var idxFirst = {};
    if (idxDot.idx == -1) idxFirst = idxComma;
    else if (idxComma.idx == -1) idxFirst = idxDot;
    else if (idxDot.idx < idxComma.idx) idxFirst = idxDot;
    else idxFirst = idxComma;

    //Find the greatest symbol.
    var idxLastDot      = { idx: value.lastIndexOf('.'), sym: '.' };
    var idxLastComma    = { idx: value.lastIndexOf(','), sym: ',' };
    var idxLast = {};
    if (idxLastDot.idx == -1) idxLast = idxLastComma;
    else if (idxLastComma.idx == -1) idxLast = idxLastDot;
    else if (idxLastDot.idx > idxLastComma.idx) idxLast = idxLastDot;
    else idxLast = idxLastComma;

    //Splits over the dot and comma and check that are all numbers.
    var splitted = value.split(/(\.|,|\-|\+)/g);
    if (splitted.length == 0) return NaN;

    var numOfDots = 0;
    var numOfComma = 0;
    var i=0;
    if (splitted[0] == '-' || splitted[0] == '+') i=1;

    for (var str; i<splitted.length, str=splitted[i]; i++) {
        if (str == '.') numOfDots++;
        else if (str == ',') numOfComma++;
        //else if (/^(0|([1-9][0-9]*))$/g.test(str) == false)
        else if (/^(0|([0-9]+))$/g.test(str) == false)
            return NaN;
    }//EndFor.

    var lastValue = splitted[splitted.length-1];
    if (lastValue == '.' || lastValue == ',' || lastValue.length == 0) return NaN;

    //No dot/comma char found
    if (idxFirst.idx == -1 && idxLast.idx == -1)
        return DataTypesUtils.FilterFloat(value);

    //Only one dot symbol found
    if (idxFirst.idx == idxLast.idx && idxFirst.sym == '.')
        return Number(value);

    //Only one comma symbol found
    if (idxFirst.idx == idxLast.idx && idxFirst.sym == ',') {
        var nval = value.replace(',', '.');
        return Number(nval);
    }

    return NaN;
};//EndFunction.

/**
 * Solution from here:
 * http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
 * @param num
 * @returns {number}
 */
DataTypesUtils.DecimalPlaces = function (num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
        - (match[2] ? +match[2] : 0));
}//EndFunction.

DataTypesUtils.IsLatLng = function (num) {
    if (DataTypesUtils.FilterFloat(num) == NaN) return false;
    if (DataTypesUtils.DecimalPlaces(num) > 4) return true;
    return false;
}//EndFunction./*
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

function DataTypeHierarchy() {

};//EndConstructor.

DataTypeHierarchy.HIERARCHY = [ ];

DataTypeHierarchy.HIERARCHY[DataTypeConverter.TYPES.TEXT.name] = [ DataTypeConverter.TYPES.TEXT.name ];
DataTypeHierarchy.HIERARCHY[DataTypeConverter.TYPES.NUMBER.name] = [ DataTypeConverter.TYPES.NUMBER.name, DataTypeConverter.TYPES.TEXT.name];
DataTypeHierarchy.HIERARCHY[DataTypeConverter.TYPES.DATETIME.name] = [ DataTypeConverter.TYPES.DATETIME.name, DataTypeConverter.TYPES.TEXT.name ];

DataTypeHierarchy.HIERARCHY[DataTypeConverter.SUBTYPES.GEOCOORDINATE.name] = [ DataTypeConverter.SUBTYPES.GEOCOORDINATE.name,
    DataTypeConverter.TYPES.NUMBER.name, DataTypeConverter.TYPES.TEXT.name];

DataTypeHierarchy.HIERARCHY[DataTypeConverter.SUBTYPES.PERCENTAGE.name] = [DataTypeConverter.SUBTYPES.PERCENTAGE.name,
    DataTypeConverter.TYPES.NUMBER.name, DataTypeConverter.TYPES.TEXT.name];

DataTypeHierarchy.canConvert = function (fromType, toType) {
    var arrConvertableTypes = DataTypeHierarchy.HIERARCHY[fromType];
    var idx = arrConvertableTypes.indexOf(toType);
    return (idx >= 0);
};//EndFunction.

var JDC_LNG = {

    "key_declaretype": {
        "EN": "the column '%COL_NAME' is of type '%COL_TYPE'",
        "IT": "la colonna '%COL_NAME' è di tipo '%COL_TYPE'",
        "FR": "le colonne '%COL_NAME' est de type '%COL_TYPE'",
        "NL": "de kolom '%COL_NAME' is van het type '%COL_TYPE'"
    },

    "key_notoftype_singular": {
        "EN": "a value is not '%COL_TYPE'",
        "IT": "un valore non è un '%COL_TYPE'",
        "FR": "La valeur n'est pas '%COL_TYPE'",
        "NL": "een waarde is niet '%COL_TYPE'"
    },

    "key_cellnotoftype": {
        "EN": "the cell value is not '%COL_TYPE'",
        "IT": "il valore della cella non è di tipo '%COL_TYPE'",
        "FR": "the cell value is not '%COL_TYPE'",
        "NL": "the cell value is not '%COL_TYPE'"
    },

    "key_notoftype_plural": {
        "EN": "%COL_ERRORS values are not '%COL_TYPE'",
        "IT": "%COL_ERRORS valori non sono di tipo '%COL_TYPE'",
        "FR": "%COL_ERRORS les valeurs ne sont pas de type '%COL_TYPE'",
        "NL": "%COL_ERRORS waarden niet '%COL_TYPE'"
    },

    "key_emptyvalue_singolar": {
        "EN": "the column '%COL_NAME' has an empty value",
        "IT": "la colonna '%COL_NAME' ha un valore vuoto",
        "FR": "La colonne '%COL_NAME'  a une valeur vide",
        "NL": "de kolom '%COL_NAME' heeft een lege waarde"
    },

    "key_emptycell": {
        "EN": "the cell is empty",
        "IT": "la cella è vuota",
        "FR": "the cell is empty",
        "NL": "the cell is empty"
    },

    "key_emptyvalue_plural": {
        "EN": "the column '%COL_NAME' has '%COL_NULLVALUES' empty values",
        "IT": "la colonna '%COL_NAME' ha '%COL_NULLVALUES' valori vuoti",
        "FR": "La colonne '%COL_NAME' a la valeur '%COL_NULLVALUES' qui est vide",
        "NL": "de kolom '%COL_NAME' heeft '%COL_NULLVALUES' lege waarde"
    },

    "key_seewrongrows": {
        "EN": "check rows '%LIST_WRONG_ROWS'",
        "IT": "controlla le righe '%LIST_WRONG_ROWS'",
        "FR": "check rows '%LIST_WRONG_ROWS'",
        "NL": "check rows '%LIST_WRONG_ROWS'"
    },

    "key_type": {
        "EN": "type",
        "IT": "tipo",
        "FR": "type",
        "NL": "type"
    },

    "key_subtype": {
        "EN": "subtype",
        "IT": "sottotipo",
        "FR": "sous-type",
        "NL": "subtype"
    },

    "key_typetext": {
        "EN": "text",
        "IT": "testo",
        "FR": "texte",
        "NL": "tekst"
    },

    "key_typenumber": {
        "EN": "number",
        "IT": "numero",
        "FR": "chiffres",
        "NL": "aantal"
    },

    "key_typeobject": {
        "EN": "object",
        "IT": "oggetto",
        "FR": "objet",
        "NL": "voorwerp"
    },

    "key_typedatetime": {
        "EN": "date or time",
        "IT": "data o orario",
        "FR": "date ou l'heure",
        "NL": "datum of tijd"
    },

    "key_typeempty": {
        "EN": "empty",
        "IT": "vuoto",
        "FR": "vide",
        "NL": "leeg"
    },

    "key_typenull": {
        "EN": "empty",
        "IT": "vuoto",
        "FR": "vide",
        "NL": "leeg"
    },

    "key_typelatitude": {
        "EN": "latitude",
        "IT": "latitudine",
        "FR": "latitude",
        "NL": "breedtegraad"
    },

    "key_typelongitude": {
        "EN": "longitude",
        "IT": "longitudine",
        "FR": "longitude",
        "NL": "lengtegraad"
    },

    "key_subtypegeocoordinate": {
        "EN": "coordinate",
        "IT": "coordinate",
        "FR": "coordonnées",
        "NL": "coordinate"
    },

    "key_subtypegeojson": {
        "EN": "geojson",
        "IT": "geojson",
        "FR": "geojson",
        "NL": "geojson"
    },

    "key_subtypebool": {
        "EN": "bool",
        "IT": "bool",
        "FR": "bool",
        "NL": "bool"
    },

    "key_subtypeconst": {
        "EN": "const",
        "IT": "costante",
        "FR": "const",
        "NL": "const"
    },

    "key_subtypecategory": {
        "EN": "category",
        "IT": "categoria",
        "FR": "category",
        "NL": "category"
    },

    "key_subtypepercentage": {
        "EN": "percentage",
        "IT": "percentuale",
        "FR": "percentage",
        "NL": "percentage"
    },

    "key_subtypelatitude": {
        "EN": "latitude",
        "IT": "latitudine",
        "FR": "latitude",
        "NL": "latitude"
    },

    "key_subtypelongitude": {
        "EN": "longitude",
        "IT": "longitudine",
        "FR": "longitude",
        "NL": "longitude"
    },

    "key_subtypedatetimeymd": {
        "EN": "YYYY/MM/DD",
        "IT": "YYYY/MM/DD",
        "FR": "YYYY/MM/DD",
        "NL": "YYYY/MM/DD"
    },

    "key_subtypedatetimedmy": {
        "EN": "DD/MM/YYYY",
        "IT": "DD/MM/YYYY",
        "FR": "DD/MM/YYYY",
        "NL": "DD/MM/YYYY"
    },

    "key_subtypedatetimexxy": {
        "EN": "D?M/D?M/YYYY",
        "IT": "D?M/D?M/YYYY",
        "FR": "D?M/D?M/YYYY",
        "NL": "D?M/D?M/YYYY"
    },

    "key_subtypenuminteger": {
        "EN": "integer number",
        "IT": "numero intero",
        "FR": "integer number",
        "NL": "integer number"
    },

    "key_subtypenumreal": {
        "EN": "real number",
        "IT": "numero reale",
        "FR": "real number",
        "NL": "real number"
    },

    "key_subtypeinteger": {
        "EN": "integer number",
        "IT": "numero intero",
        "FR": "integer number",
        "NL": "integer number"
    },

    "key_subtypereal": {
        "EN": "real number",
        "IT": "numero reale",
        "FR": "real number",
        "NL": "real number"
    },

    "key_dateformatunknown": {
        "EN": "Cannot determine the date format for the column '%COL_NAME'",
        "IT": "Impossibile determinare il formato della data per la colonna '%COL_NAME'",
        "FR": "Cannot determine the date format for the column '%COL_NAME'",
        "NL": "Cannot determine the date format for the column '%COL_NAME'"
    },

    "key_datenotinformat": {
        "EN": "'%COL_NUMDATENOTINFORMAT' values of the column '%COL_NAME' are not in format '%COL_SUBTYPE'",
        "IT": "'%COL_NUMDATENOTINFORMAT' valori della colonna '%COL_NAME' non sono in formato '%COL_SUBTYPE'",
        "FR": "'%COL_NUMDATENOTINFORMAT' values of the column '%COL_NAME' are not in format '%COL_SUBTYPE'",
        "NL": "'%COL_NUMDATENOTINFORMAT' values of the column '%COL_NAME' are not in format '%COL_SUBTYPE'"
    },

};function DataTypeHelper() {

};//EndConstructor.

DataTypeHelper.forEachType = function (metadata, callback) {
    var keys = Object.keys(metadata.types);
    for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        var type = metadata.types[key];
        callback(type);
    }//EndFor.
};var _converter = function(obj) { return new DataTypeConverter(); }; 
module.exports = _converter; 
}); 
