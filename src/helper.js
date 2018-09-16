/**
 * 后续本文件将逐步放入常用文件操作方法
 */

const util = require('util');
let fs = require('fs');
let path = require('path');
let promisify = require('util').promisify;
let chalk = require('chalk');

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);
let readdir = promisify(fs.readdir);

function log(...arg) {
    let data = chalk.yellow(...arg);
    console.log(data);
}

// 调试用的输出
function logJ(...str) {
    let input = str;
    try {
        if (str.length === 1) {
            input = [JSON.stringify(str[0], null, 2)];
        }

    }
    catch (e) {}
    let data = chalk.yellow(...input);
    console.log(data);
}

// 针对回调函数封装成promise
function myPromisify(fn) {
    return function (...argu) {
        return new Promise((resolve, reject) => {
            fn(...argu, (err, ...data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(...data);
                }
            });
        });
    };
}

// 遍历当前文件夹下所有文件，并执行操作，返回文件树；
async function traveAction(root, callback = () => {
    }, allowed = ['js'], notDir = ['node_modules', '.git']) {
    let tree = {};

    async function travel(root, tree) {
        let dirs = await readdir(root);
        let all = [];
        dirs.forEach(dir => {
            let pathname = root + '/' + dir;
            let stat = fs.lstatSync(pathname);
            // 目录的话
            if (stat.isDirectory()) {
                if (notDir.indexOf(dir) === -1) {
                    tree[dir] = {};
                    all.push(travel(pathname, tree[dir]));
                }
            }
            else {
                let type = dir.split('.').pop();
                if (allowed.indexOf(type) !== -1) {
                    tree[dir] = pathname;
                    callback(pathname);
                }
            }
        });

        await Promise.all(all);
    }

    await travel(root, tree);
    // 对tree进行删除空对象
    function delTreeEmpty(tree) {
        Object.keys(tree).forEach(key => {
            let val = tree[key];
            if (typeof val === 'object') {
                if (Object.keys(val).length === 0) {
                    delete tree[key];
                }
                else {
                    delTreeEmpty(val);
                }
            }

        });
    }
    delTreeEmpty(tree);
    return tree;
}

module.exports = {
    promisify,
    myPromisify,
    readFile,
    writeFile,
    readdir,
    log,
    logJ,
    traveAction
};
