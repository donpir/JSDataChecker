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

export class PrivacyReportViewBuilder {

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