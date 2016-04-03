'use strict';

var Path = require('path');

module.exports = {
    messages: {
        open () {
            Editor.Panel.open('excel-to-json.panel');
        },
        //
        parse () {
            var xlsxj;
            try {
                xlsxj = require('xlsx-to-json');
            } catch (e) {
                Editor.log('Please install npm dependencies first.');
                return;
            }
            let srcPath = Path.join(Editor.projectPath, 'heroes.xlsx');
            Editor.log('processing excel parse...');
            Editor.log('src: ' + srcPath);
            let outPath = Path.join(Editor.projectPath, 'assets/resources/data');
            function Refresh(outName) {
                Editor.assetdb.refresh ( 'db://assets/resources/data/' + outName, (err, results) => {
                        if ( err ) {
                            Editor.assetdb.error('Failed to reimport asset %s, %s', outName, err.stack);
                            return;
                        }
                        Editor.assetdb._handleRefreshResults(results);
                });
            }
            xlsxj({
                input: srcPath,  // input xls
                output: Path.join(outPath, 'heroes.json'), // output json
                sheet: 'heroes'
            }, function(err, result) {
                if(err) {
                    console.error(err);
                    return;
                }
                Editor.success("Convert heroes to json complete");
                Refresh('heroes.json');
            });
            xlsxj({
                input: srcPath,  // input xls
                output: Path.join(outPath, 'activeskills.json'), // output json
                sheet: 'activeskills'
            }, function(err, result) {
                if(err) {
                    console.error(err);
                    return;
                }
                Editor.success("Convert activeskills to json complete");
                Refresh('activeskills.json');
            });
            xlsxj({
                input: srcPath,  // input xls
                output: Path.join(outPath, 'passiveskills.json'), // output json
                sheet: 'passiveskills'
            }, function(err, result) {
                if(err) {
                    console.error(err);
                    return;
                }
                Editor.success("Convert passiveskills to json complete");
                Refresh('passiveskills.json');
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
