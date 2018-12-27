"use strict";

const app = require('./app');
const getCaller = require('./helper').getCaller;
const path = require('path');

const nraf = function(staticFilePath){

    let ecstatic = (req, res) => {
        res.write(JSON.stringify({
            'url': req.url
        }));
        res.end();
    };

    if(staticFilePath) {
        ecstatic = require('ecstatic')({
            root: path.join(staticFilePath),
            showDir: false,
            autoIndex: true,
        }); 
    }
    return new app(ecstatic);
} 

module.exports = nraf;