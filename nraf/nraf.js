"use strict";

const app = require('./app');

function nraf() {    
    // Starting NRAF.
    // Using App Class for further things 
    return new app();
} 

module.exports = nraf;