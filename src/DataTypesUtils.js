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

function DataTypesUtils() {}

DataTypesUtils.prototype = (function () {
    return {
        constructor: DataTypesUtils,

        filterFloat: function (value) {
            if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
                    .test(value))
                return Number(value);
            return NaN;
        }//EndFunction.
    };
})();