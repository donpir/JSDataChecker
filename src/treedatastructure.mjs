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
 ** JS implementation of tree data structure.
 **
 **/

export class TDS {

    constructor(rootnode) {
        if (typeof rootnode === 'undefined')
            rootnode = new TDSNODE();
        this._root = rootnode;
    }//EndConstructor.

    get root() { return this._root; }

    traverseDepthFirst() {
        let stack = [ this._root ];
        let traverse = [];
        let item = null;

        while ( typeof (item = stack.pop()) !== 'undefined') {
            traverse.unshift(item);
            item.children.forEach( (element, index) => {
                stack.push(element);
            });
        }

        return traverse;
    }//EndFunction.

};//EndClass.

export class TDSNODE {

    constructor(data, parent) {
        this._parent = parent;
        this._data = data;
        this._children = [];

        if (typeof this._parent !== 'undefined') {
            this._parent.addChild(this);
        }
    }//EndConstructor.

    get parent() { return this._parent; }
    set parent(parent) { this._parent = parent; }

    get data() { return this._data; }
    set data(value) { this._data = value; }

    get children() { return this._children; }

    addChild(child) {
        child.parent = this;
        this._children.push(child);
    }//EndFunction.

};//EndClass.

