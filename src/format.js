let fecs = require('fecs');
let myPromisify = require('./helper').myPromisify;
let format = myPromisify(fecs.format);

module.exports = async function (file) {
    let options = fecs.getOptions([file, '--replace']);
    return await format(options);
};
