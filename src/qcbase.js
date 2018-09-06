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
 ** Copyright (C) 2018 JSDataChecker - Donato Pirozzi (donatopirozzi@gmail.com)
 ** Distributed under the GNU GPL v3. For full terms see the file LICENSE.
 ** License: http://www.gnu.org/licenses/gpl.html GPL version 3 or higher
 **
 ** ----------------------------------------------------------------------------------
 **
 ** A basic configuration for quality check.
 **
 **/

import { TDS, TDSNODE } from "./treedatastructure.js";

////////////////////////////////////////////////////////////
/// Definition of the data types recognised by the system.
///

export const DATATYPES = {
    DT_NULL:    { name: "NULL" },

    DT_TEXT:    { name: "TEXT" },
    DT_REAL:    { name: "REAL"},
    DT_INT:     { name: "INT" },

    DT_DATE:    { name: "DATE" },
    DT_DATEYM:  { name: "DATEYM"},
    DT_DATEYMD: { name: "DATEYMD" },
    DT_DATEXXY: { name: "DATEXXY" },
    DT_DATEDMY: { name: "DATEDMY" },
    DT_DATEMDY: { name: "DATEMDY" },

    DT_OBJECT:  { name: "OBJECT" },

    DT_EMAIL:   { name: "EMAIL" }
};

//Specific functions to recognize types.
DATATYPES.DT_NULL.evaluate = function(value) {
    if (value === null || typeof value === 'undefined')
        return { datatype: DATATYPES.DT_NULL, value: value };

    return { datatype: DATATYPES.DT_TEXT, value: value };
};

DATATYPES.DT_REAL.evaluate = function (value) {
    if(/^(\-|\+)?((0|([1-9][0-9]*))|Infinity)$/
        .test(value))
        return { datatype: DATATYPES.DT_INT, value: value, parsedValue: Number(value) };

    var match = /^(\-|\+)?(0|([1-9][0-9]*))((\.|\,)([0-9]+))?$/.exec(value);
    if( match )
        return { datatype: DATATYPES.DT_REAL, value: value, parsedValue: Number(value), sign: match[1], decimalSeparator: match[5] }

    return { datatype: DATATYPES.DT_TEXT, value: value };
};
DATATYPES.DT_INT.evaluate = DATATYPES.DT_REAL.evaluate;

DATATYPES.DT_DATE.evaluate = function (value) {
    var dtDate = new Date("YYYY-MM-DD");

    // [YYYY-MM] year-month.
    var match = /^([0-9]{1,4})(\-|\/)([0-9]{1,2})$/.exec(value);
    if (match) {
        var splitted = match[2];
        var year = parseInt(match[1]);
        var month = parseInt(match[3]);

        if (month > 12) return { datatype: DATATYPES.DT_TEXT, value: value };

        dtDate.setYear(year);
        dtDate.setMonth(month);
        return { datatype: DATATYPES.DT_DATEYM, value: value, parsedValue: dtDate };
    }

    // [YYYY-MM-DD]
    var match = /^([0-9]{1,4})(\-|\/)([0-9]{1,2})((\-|\/)([0-9]{1,2}))?$/.exec(value);
    if (match) {
        var year = parseInt(match[1]);
        var month = parseInt(match[3]);
        var day = parseInt(match[6]); //splitted.length == 3 ? parseInt(splitted[2]) : 0;

        //Checks the range.
        if (month <= 0 || month >= 13) return null;
        if (day <= 0 || day >= 32) return null;

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);

        return { datatype: DATATYPES.DT_DATEYMD, value: value, parsedValue: dtDate };
    }

    /// DD-MM-YYYY or MM-DD-YYYY
    var match = /^([0-9]{1,2})(\-|\/)([0-9]{1,2})(\-|\/)([0-9]{1,4})$/.exec(value);
    if (match) {
        var year = parseInt(match[5]);
        var month = parseInt(match[3]);
        var day = parseInt(match[1]);
        var result = { datatype: DATATYPES.DT_DATEDMY, value: value, parsedValue: dtDate };

        //Here, recognises the American vs Italian format.
        //When month is greater than twelve, it swaps month and day variable.
        if (month > 12) {
            var temp = month;
            month = day;
            day = temp;
            result.datatype = DATATYPES.DT_DATEMDY;
        }

        //Checks the range.
        if (month <= 0 || month >= 13) return { datatype: DATATYPES.DT_TEXT, value: value };
        if (day <= 0 || day >= 32) return { datatype: DATATYPES.DT_TEXT, value: value };

        if (day <= 12 && month <= 12) result.datatype = DATATYPES.DT_DATEXXY;//It can be both formats.

        dtDate.setYear(year);
        dtDate.setMonth(month);
        dtDate.setDate(day);
        return result;
    }

    return { datatype: DATATYPES.DT_TEXT, value: value };
};
DATATYPES.DT_DATEYM.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEYMD.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEXXY.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEDMY.evaluate = DATATYPES.DT_DATE.evaluate;
DATATYPES.DT_DATEMDY.evaluate = DATATYPES.DT_DATE.evaluate;

DATATYPES.DT_OBJECT.evaluate = function(value) {
    var dt_null = DATATYPES.DT_NULL.evaluate(value);
    if (dt_null.datatype.name == DATATYPES.DT_NULL.name)
        return dt_null;

    if (typeof value === 'object')
        return { datatype: DATATYPES.DT_OBJECT, value: value };

    return { datatype: DATATYPES.DT_TEXT, value: value };
};

//PRIVACY CHECKING.
DATATYPES.DT_EMAIL.evaluate = function (value) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    value = value.toLowerCase();
    if (regex.test(value))
        return { datatype: DATATYPES.DT_EMAIL, value: value };

    return { datatype: DATATYPES.DT_TEXT, value: value };
};

////////////////////////////////////////////////////////////
/// Definition of the tree data structure.
///

export class QCBaseConfigFactory {

    constructor() { }//EndConstructor.

    build() {
        const dt_text = new TDSNODE(DATATYPES.DT_TEXT);

        const dt_null = new TDSNODE(DATATYPES.DT_NULL, dt_text);

        const dt_real = new TDSNODE(DATATYPES.DT_REAL, dt_text);
        const dt_int = new TDSNODE(DATATYPES.DT_INT, dt_real);

        const dt_date = new TDSNODE(DATATYPES.DT_DATE, dt_text);
        const dt_date_ym = new TDSNODE(DATATYPES.DT_DATEYM, dt_date);
        const dt_date_ymd = new TDSNODE(DATATYPES.DT_DATEYMD, dt_date);
        const dt_date_xxy = new TDSNODE(DATATYPES.DT_DATEXXY, dt_date);
        const dt_date_dmy = new TDSNODE(DATATYPES.DT_DATEDMY, dt_date_xxy);
        const dt_date_mdy = new TDSNODE(DATATYPES.DT_DATEMDY, dt_date_xxy);

        const dt_email = new TDSNODE(DATATYPES.DT_EMAIL, dt_text);

        const dt_object = new TDSNODE(DATATYPES.DT_OBJECT, dt_text);

        this._dtds = new TDS(dt_text);
    };

};//EndClass.



