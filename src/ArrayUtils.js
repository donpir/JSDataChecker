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
    var result = null;
    for (var key in arr) {
        if (result == null || fncompare(arr[key], result.value))
            result = { index: -1, key: key, value: arr[key] };
    }

    return result;
}//EndFunction.

ArrayUtils.isArray = function (arr) {
    if (Array.isArray(arr))
        return (arr.length > 0);
    return false;
}//EndFunction.

