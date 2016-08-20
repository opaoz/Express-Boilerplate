"use strict";

/**
 * App logging configuration.
 *
 * @access public
 * @namespace api\log4js
 *
 * @see <a href="https://github.com/nomiddlename/log4js-node">log4js-node</a>
 * */

var log4js = require('log4js');
var path = require('path');

var alias = require("../alias");

/**
 * @params name
 * @return Logger
 * */
module.exports = function (name) {

    log4js.configure(require(
        path.join(alias.path("@resources"), "log4js.json")
    ), {cwd: alias.path("@root")});

    return log4js.getLogger(name || "app");
};