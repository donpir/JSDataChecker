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
 ** A basic configuration for the privacy module.
 **/

const PRDATATYPES = {
    DT_UNKNOWN: { name: "UNKNOWN" },
    DT_EMAIL:   { name: "EMAIL" },
    DT_CF:      { name: "CF" },
};

PRDATATYPES.DT_CF.evaluate = function (value) {
    var regex = /^(?:(?:[B-DF-HJ-NP-TV-Z]|[AEIOU])[AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i;
    value = value.toLowerCase();
    if (regex.test(value))
        return { datatype: PRDATATYPES.DT_CF, value: value };

    return { datatype: PRDATATYPES.DT_UNKNOWN, value: value };
};

PRDATATYPES.DT_EMAIL.evaluate = function (value) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    value = value.toLowerCase();
    if (regex.test(value))
        return { datatype: PRDATATYPES.DT_EMAIL, value: value };

    return { datatype: PRDATATYPES.DT_UNKNOWN, value: value };
};

PRDATATYPES.DT_UNKNOWN.evaluate = function (value) {
    return { datatype: PRDATATYPES.DT_UNKNOWN, value: value };
};

//////////////////////////////////////////////////////////////////////////
//// The factory class for the configuration of the privacy module.
////

export class PrivacyConfigFactory {

    constructor() { }//EndConstructor.

    get DATATYPES() {
        return PRDATATYPES;
    }

    get types() {
        return [ PRDATATYPES.DT_EMAIL, PRDATATYPES.DT_CF, PRDATATYPES.DT_UNKNOWN ];
    }

    /*
     * For the moment it does nothing...
     */
    build() {
        return null;
    };

};//EndClass.