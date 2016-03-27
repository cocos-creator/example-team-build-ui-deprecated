'use strict';

var Path = require('path');

module.exports = {
    messages: {
        open () {
            Editor.Panel.open('excel-to-json.panel');
        },
        //
        parse (event, opts) {
            var xlsxj;
            try {
                xlsxj = require('xlsx-to-json');
            } catch (e) {
                Editor.log('Please install npm dependencies first.');
                return;
            }
            Editor.log('processing excel parse...');
            Editor.log('src: ' + opts.srcPath + ' outname: ' + opts.outName);
            var outPath = Path.join(Path.dirname(opts.srcPath), opts.outName);
            xlsxj({
                input: opts.srcPath,  // input xls
                output: outPath,  // output json
            }, function(err, result) {
                if(err) {
                    console.error(err);
                    return;
                }
                Editor.success("Convert excel to json complete: " + outPath);
            });
        },
        install (event, opts) {
            let fork = require('child_process').fork;
            let cmdStr = Editor.url('app://node_modules/npm/bin/npm-cli.js');
            let child = fork(cmdStr, ['install'], {
                cwd: Editor.url('packages://excel-to-json/'),
                stdio: 'inherit'
            });
            child.on('exit', function(code) {
                Editor.success('Install npm dependencies complete!');
            });
        }
    }
};
