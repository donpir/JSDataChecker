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

DataTypesUtils.FilterDate = function (value) {
    if (/^[0-9][0-9][0-9][0-9]\-[0-9][0-9]$/.test(value)) {
        var year = parseInt(value.substring(0, 4));
        var month = parseInt(value.substring(5));
        return new Date(year, month);
    }

    var patt = new RegExp("[^0-9\-Tt:]");
    var isDate = !patt.test(value);
    if (isDate == false) return NaN;
    return Date.parse(value);
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