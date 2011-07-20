goog.require('baidu');
goog.require('base.DateRangeConverter');
goog.require('base.UrlPrefixConverter');

var converter;
module('base.DateRangeConverter', {
    setup: function() {
        converter = new base.DateRangeConverter();
    }
});

test('convert', function() {
    var now = new Date(),
        range = {
            begin: now,
            end: now
        },
        result = converter.convert(range);

    equals(result, baidu.date.format(now, 'yyyyMMdd') + '000000,' +
        baidu.date.format(now, 'yyyyMMdd') + '235959', 'convert');
});

test('convertBack', function() {
    var now = new Date(),
        today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        str = baidu.date.format(now, 'yyyyMMdd') + '000000,' +
            baidu.date.format(now, 'yyyyMMdd') + '235959',
        result = converter.convertBack(str);

    equals(result.begin.getTime(), today.getTime(), 'begin');
    equals(result.end.getTime(), today.getTime(), 'end');
});

test("urlPrefixConvert", function(){
    var converter = new base.UrlPrefixConverter('http://');
    equals(encodeURIComponent("http://www.google.com"), converter.convert("www.google.com"), "pass test");
    equals(encodeURIComponent("http://www.google.com"), converter.convert("http://www.google.com"), "pass test");

    var converter2 = new base.UrlPrefixConverter("ftp://");
    equals(encodeURIComponent("ftp://www.google.com"), converter2.convert("www.google.com"), "pass test");
    equals(encodeURIComponent("http://www.google.com"), converter2.convert("http://www.google.com"), "pass test");
    equals(encodeURIComponent("https://www.google.com"), converter2.convert("https://www.google.com"), "pass test");
    equals(encodeURIComponent("ftp://www.google.com"), converter2.convert("ftp://www.google.com"), "pass test");
    equals(encodeURIComponent("ftps://www.google.com"), converter2.convert("ftps://www.google.com"), "pass test");
    equals(encodeURIComponent("ftp://mail://www.google.com"), converter2.convert("mail://www.google.com"), "pass test");

    var converter3 = new base.UrlPrefixConverter('http://');
    equals("www.google.com", converter3.convertBack("www.google.com"), "pass test");
});
