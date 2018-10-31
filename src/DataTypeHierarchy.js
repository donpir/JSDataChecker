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
