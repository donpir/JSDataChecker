echo off
echo "**********************"
echo "*** DELETING FILES ***"
echo "**********************"
echo on


echo off
echo "**********************"
echo "* UGLIFY SOURCE CODE *"
echo "**********************"
echo on

START /B /WAIT cmd /C "uglifyjs src\datachecker.mjs src\PrivacyConfigFactory.mjs src\PrivacyReportViewBuilder.mjs src\utils.mjs  -o jsprivacychecker.js"

