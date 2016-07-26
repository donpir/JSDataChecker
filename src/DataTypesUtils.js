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

DataTypesUtils.FilterDate = function (value, dtDate) {
    if (dtDate == null) dtDate = new Date();

    //year-month.
    if (/^[0-9][0-9][0-9][0-9]\-[0-9][0-9]$/.test(value)) {
        var year = parseInt(value.substring(0, 4));
        var month = parseInt(value.substring(5));
        dtDate.setYear(year);
        dtDate.setMonth(month);
        return dtDate;
    }

    var expDate = /^[0-9]{4}(\-|\/)[0-9]{2}((\-|\/)[0-9]{2})?$/;
    if (expDate.test(value)) {
        var splitted = value.split(/[\-|\/]/);
        var year = parseInt(splitted[0]);
        var month = parseInt(splitted[1]);
        var day = splitted.length == 3 ? parseInt(splitted[2]) : 0;
        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return dtDate;
    }

    expDate = /^[0-9]{2}(\-|\/)[0-9]{2}(\-|\/)[0-9]{4}$/;
    if (expDate.test(value)) {
        var splitted = value.split(/[\-|\/]/);
        var year = parseInt(splitted[2]);
        var month = parseInt(splitted[1]);
        var day = parseInt(splitted[0]);
        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return dtDate;
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

DataTypesUtils.FilterNumber = function (value) {
    if(/^(\-|\+)?((0|([1-9][0-9]*))((\.|,)[0-9]+)?|Infinity)$/
            .test(value))
        return Number(value);
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