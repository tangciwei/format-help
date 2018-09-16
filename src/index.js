let {log, traveAction} = require('./helper');
let fs = require('fs');
let format = require('./format');

// promisify,
// myPromisify,
// readFile,
// writeFile,
// readdir,
// log,
// logJ,
// traveAction

async function dealFile() {
    let lock = false;
    return function (path) {
        fs.watch(path, (curr, prev) => {
            if (!lock) {
                lock = true;
                format(path).then(ok => {
                    lock = false;
                });
            }

        });
    };
}

async function start() {
    await traveAction('/Users/tangciwei/learn/code/github/format-help/test', (path) => {
        dealFile()(path);
    });

    // let data = await format();
    // console.log(data);
}
start();
