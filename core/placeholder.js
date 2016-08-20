"use strict";

/**
 * App configuration placeholder.
 *
 * @access public
 * @namespace core\Placeholder
 *
 * @see <a href="https://www.npmjs.com/package/yamljs">yamljs</a>
 * */

var YAML = require('yamljs');
var path = require('path');
var _ = require('underscore');

var alias = require("./alias");

/**
 * Initialize Placeholder object
 * @constructor
 * */
function Placeholder() {
    this.instance = YAML.load(path.join(alias.path("@resources"), "application.yml"));
}

/**
 * @return Placeholder object
 * */
Placeholder.prototype.get = function () {
    return this.instance;
};

/**
 * @params suffix string
 * @return  Object by suffix e.g 'server'
 * */
Placeholder.prototype.getBySuffix = function (suffix) {
    return _.propertyOf(this.instance)(suffix) || {};
};

/**
 * @return Placeholder object
 * */
module.exports = new Placeholder();
