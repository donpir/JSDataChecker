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

export class Utils {

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

