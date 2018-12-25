"use strict";

const app = require('./app');
const getCaller = require('./helper').getCaller;
const path = require('path');

const nraf = function(staticFilePath){

    if(!staticFilePath) {
        throw new Error('Error: Function accepts static file path as parameter');
    }

    const ecstatic = require('ecstatic')({
        root: path.join(staticFilePath),
        showDir: false,
        autoIndex: true,
    }); 
    return new app(ecstatic);
} 

module.exports = nraf;