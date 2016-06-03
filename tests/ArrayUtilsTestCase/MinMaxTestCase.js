QUnit.test( "TestMinMax", function( assert ) {

    var fncCompare = function(val1, val2){ return val1 > val2; };

    var arr1 = [ 1, 2, 3, 4, 5, 6];
    var result = ArrayUtils.FindMinMax(arr1, fncCompare);
    assert.equal(result.first.value, 6, "Array 1 Checked max 1");
    assert.equal(result.second.value, 5, "Array 1 Checked max 2");

    var arr2 = [ 6, 5, 4, 3, 2, 1];
    var result = ArrayUtils.FindMinMax(arr2, fncCompare);
    assert.equal(result.first.value, 6, "Array 2 Checked max 1");
    assert.equal(result.second.value, 5, "Array 2 Checked max 2");

    var arr3 = [ 2, 3, 4, 6, 1, 5];
    var result = ArrayUtils.FindMinMax(arr2, fncCompare);
    assert.equal(result.first.value, 6, "Array 3 Checked max 1");
    assert.equal(result.second.value, 5, "Array 3 Checked max 2");

});
