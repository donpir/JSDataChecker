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

function ArrayUtils() {}

ArrayUtils.prototype = (function() {
    return {
        constructor: ArrayUtils,

        /***
         * It tests whether the array has the key, if not it insert it;
         * then increases the value by one unit.
         * @param arr
         * @param key
         * @returns {The array}
         */
        testAndIncrement: function (arr, key) {
            var exists = arr[key];
            if (typeof exists === 'undefined') arr[key] = 0;
            arr[key]++;
            return arr;
        },//EndFunction.

        /**
         * Find the item with the max value within the array.
         * @param arr
         * @returns {*}
         */
        findMax: function (arr) {
            if (arr.length <= 0) return NaN;
            var max = { index: 0, value: arr[0] }
            var i=1;
            for (i=1; i<arr.length; i++) {
                var value = arr[i];
                if (value > max.value) {
                    max.index = i;
                    max.value = value;
                }
            }//EndFor.

            return max;
        }//EndFunction.
    };
})();
