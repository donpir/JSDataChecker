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
 ** Main class.
 **
 **/

 class DataChecker {

    constructor(configFactory) {
        this._dataTypeConfigFactory = configFactory;
    }//EndConstructor.

    inferDataTypeOfValue(value) {
        //Retrieves the array of available types.
        var arrTraverseOrder = this._dataTypeConfigFactory.types;

        //Runs each registered "evaluate" function on the value.
        let _inferredDataType = { datatype: this._dataTypeConfigFactory.DT_UNKNOWN, value: value };
        for (let i=0; i<arrTraverseOrder.length; i++) {
            let dtnode = arrTraverseOrder[i];
            _inferredDataType = dtnode.evaluate(value);

            if (_inferredDataType.datatype.name !== this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN.name)
                return _inferredDataType;
        }

        return _inferredDataType;

        /*arrTraverseOrder.forEach( (dtnode, index) => {
            let _inferredDataType = dtnode.data.evaluate(value);
            if (_inferredDataType.datatype.name != this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN.name) {

            }
            debugger;
        });*/
    }//EndFunction.

    /**
     * The input "metadata" is a json object with:
     *  - an array of columns
     * @param metadata
     */
    evaluate(dataset, fieldKeys) {
        let evaLog = [];

        for (let irow=0; irow<dataset.length; irow++) {
            let row = dataset[irow];

            for (let ikey=0; ikey<fieldKeys.length; ikey++) {
                let key = fieldKeys[ikey];

                //Value to evaluate.
                let fieldValue = row[key.name] + '';

                //
                //if (typeof value === 'undefined')
                //   return  { datatype: PRDATATYPES.DT_UNKNOWN, value: value };

                let _inferredType =  this.inferDataTypeOfValue(fieldValue);

                if (_inferredType.datatype !== this._dataTypeConfigFactory.DATATYPES.DT_UNKNOWN) {
                    evaLog.push({
                        i: irow,
                        j: ikey,
                        key: key.name,
                        value: fieldValue,
                        datatype: _inferredType.datatype
                    });
                }

            }//EndFor on keys.
        }//EndFor.

        return evaLog;
    };//EndFunction.

}//EndClass.
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

 class PrivacyReportViewBuilder {

    /**
     * It builds a report in which the statistics are provided
     * summarised based on DATATYPES
     * @param evaLogs
     */
    build(evaLogs) {
        let reportView = {
            DATATYPES: {}
        };

        for (let ilog=0; ilog<evaLogs.length; ilog++) {
            let slog = evaLogs[ilog];
            let sdtkey = slog.datatype.name;

            if (typeof reportView.DATATYPES[sdtkey] === 'undefined')
                reportView.DATATYPES[sdtkey] = { datatypekey: sdtkey, warnings: 0 };

            reportView.DATATYPES[sdtkey].warnings++;
        }//EndFor.

        return reportView;
    }//EndFunction.

}//EndClass.
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

 class PrivacyConfigFactory {

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
 **/

 class Utils {

    /**
     * Utility to make an http request. It returns a promise.
     * @param url is the target url.
     * @returns {Promise<any>}
     */
    static HttpGet(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300)
                    resolve(xhr.response);
                else
                    reject({ status: this.status, statusText: xhr.statusText });
            };
            xhr.onerror = function () {
                reject({ status: this.status, statusText: xhr.statusText });
            };
            xhr.send();
        });//EndPromise
    }//EndFunction.



}//EndClassUtils.


