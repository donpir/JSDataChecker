function DataTypeHelper() {

};//EndConstructor.

DataTypeHelper.forEachType = function (metadata, callback) {
    var keys = Object.keys(metadata.types);
    for (var i=0; i<keys.length; i++) {
        var key = keys[i];
        var type = metadata.types[key];
        callback(type);
    }//EndFor.
};