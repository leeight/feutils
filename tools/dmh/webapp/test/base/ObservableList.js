goog.require('base.ObservableList');

var list;
module('base.ObservableList', {
    setup: function() {
        list = new base.ObservableList();
    },
    tearDown: function() {
        list = null;
    }
});

test('length and data', function() {
    var array = [1, 2, 3],
        ol = new base.ObservableList(array);
    
    equals(ol.length, array.length, 'length');
    for (var i = 0; i < array.length; i++) {
        equals(ol[i], array[i], 'item');
    }
    ol.pop();
    equals(ol.length, array.length - 1, 'length');
});

test('add and remove listener', function() {
    var times = 0;
    function listener() {
        times++;
        equals(times, 1, 'call only one time');
    };
    list.addListChangedListener(listener);
    list.push(1);
    list.removeListChangedListener(listener);
    list.push(2);
});
