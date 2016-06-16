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

runTests();

function runTests() {

    QUnit.test("CSVReader Split TestCase", function(assert) {

        //TEXT and NUMBER
        var bval = DataTypeHierarchy.canConvert("TEXT", "TEXT");
        assert.equal(bval, true, "TEXT => TEXT");

        var bval = DataTypeHierarchy.canConvert("NUMBER", "TEXT");
        assert.equal(bval, true, "NUMBER => TEXT");

        var bval = DataTypeHierarchy.canConvert("TEXT", "NUMBER");
        assert.equal(bval, false, "TEXT => NUMBER");

        //LAT and OTHERS
        var bval = DataTypeHierarchy.canConvert("GEOCOORDINATE", "GEOCOORDINATE");
        assert.equal(bval, true, "GEOCOORDINATE => GEOCOORDINATE");

        var bval = DataTypeHierarchy.canConvert("GEOCOORDINATE", "NUMBER");
        assert.equal(bval, true, "GEOCOORDINATE => NUMBER");

        var bval = DataTypeHierarchy.canConvert("GEOCOORDINATE", "TEXT");
        assert.equal(bval, true, "GEOCOORDINATE => TEXT");

        var bval = DataTypeHierarchy.canConvert( "TEXT", "GEOCOORDINATE");
        assert.equal(bval, false, "TEXT => GEOCOORDINATE");

        var bval = DataTypeHierarchy.canConvert( "NUMBER", "GEOCOORDINATE");
        assert.equal(bval, false, "NUMBER => GEOCOORDINATE");

    });

}//EndTestSuite.