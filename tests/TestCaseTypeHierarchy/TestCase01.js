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
        var bval = DataTypeHierarchy.canConvert("LATITUDE", "LATITUDE");
        assert.equal(bval, true, "LATITUDE => LATITUDE");

        var bval = DataTypeHierarchy.canConvert("LATITUDE", "NUMBER");
        assert.equal(bval, true, "LATITUDE => NUMBER");

        var bval = DataTypeHierarchy.canConvert("LATITUDE", "TEXT");
        assert.equal(bval, true, "LATITUDE => TEXT");

        var bval = DataTypeHierarchy.canConvert( "TEXT", "LATITUDE");
        assert.equal(bval, false, "TEXT => LATITUDE");

        var bval = DataTypeHierarchy.canConvert( "NUMBER", "LATITUDE");
        assert.equal(bval, false, "NUMBER => LATITUDE");

        var bval = DataTypeHierarchy.canConvert( "LATITUDE", "LONGITUDE");
        assert.equal(bval, false, "LATITUDE => LONGITUDE");
    });

}//EndTestSuite.