let {log, traveAction} = require('./helper');
let fs = require('fs');
let format = require('./format');

function dealFile(callback = ()=>{}) {
    let lock = false;
    return function (path) {
        fs.watch(path, (curr, prev) => {
            if (!lock) {
                lock = true;
                format(path).then(ok => {
                    lock = false;
                    callback(path)
                });
            }

        });
    };
}

module.exports = function formatHelp(dirname = process.cwd(),callback) {
	 traveAction(dirname, (path) => {
	    dealFile(callback)(path);
	});
}
