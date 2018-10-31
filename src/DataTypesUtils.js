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
}//EndFunction.