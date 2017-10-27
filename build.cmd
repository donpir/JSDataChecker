echo off
echo "**********************"
echo "*** DELETING FILES ***"
echo "**********************"
echo on

del jsdatachecker.min.js
del jsdatacheckermodule.min.js
del jsdatacheckermodule.js

echo off
echo "**********************"
echo "* UGLIFY SOURCE CODE *"
echo "**********************"
echo on

START /B /WAIT cmd /C "uglifyjs src\ArrayUtils.js src\DataTypeConverter.js src\DataTypesUtils.js src\DataTypeHierarchy.js src\langs.js src\DataTypeHelper.js --compress -o jsdatachecker.min.js"

echo off
echo "**********************"
echo "** CREATE JS MODULE **"
echo "**********************"
echo on

::echo off
echo if (typeof define !== 'function') { var define = require('amdefine')(module) } >> jsdatacheckermodule.min.js
echo define(function (require, exports, module) { >> jsdatacheckermodule.min.js

type jsdatachecker.min.js >> jsdatacheckermodule.min.js

echo var _converter = function(obj) { return new DataTypeConverter(); }; >> jsdatacheckermodule.min.js
echo module.exports = _converter; >> jsdatacheckermodule.min.js
echo }); >> jsdatacheckermodule.min.js

echo off
echo "**************************"
echo "** MODULE NOT MINIFIED. **"
echo "**************************"
echo on

::echo off

type . >> jsdatacheckermodule.js
echo if (typeof define !== 'function') { var define = require('amdefine')(module) } >> jsdatacheckermodule.js
echo define(function (require, exports, module) { >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

type src\ArrayUtils.js >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

type src\DataTypeConverter.js >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

type src\DataTypesUtils.js >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

type src\DataTypeHierarchy.js >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

type src\langs.js >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

type src\DataTypeHelper.js >> jsdatacheckermodule.js
type . >> jsdatacheckermodule.js

echo var _converter = function(obj) { return new DataTypeConverter(); }; >> jsdatacheckermodule.js
echo module.exports = _converter; >> jsdatacheckermodule.js
echo }); >> jsdatacheckermodule.js

echo off
echo "**********************"
echo "** END. **"
echo "**********************"
echo on