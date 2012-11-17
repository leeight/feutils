/*jshint boss: true */

(function (args) {
    var jshint = args[0],
        name = args[1],
        input;

    if (!name || !jshint) {
        print('Usage: jshint.js file.js');
        quit(1);
    }

    load(jshint);

    input = readFile(name);

    if (!input) {
        print('jshint: Couldn\'t open file ' + name);
        quit(1);
    }

    if (!JSHINT(input, { rhino: true })) {
        for (var i = 0, err; err = JSHINT.errors[i]; i++) {
            print(err.reason + ' (line: ' + err.line + ', character: ' + err.character + ')');
            print('> ' + (err.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            print('');
        }
        quit(1);
    }

    quit(0);
}(arguments));
