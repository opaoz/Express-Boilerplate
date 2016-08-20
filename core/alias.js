"use strict";

/**
 * Aliases configuration.
 *
 * @access public
 * @namespace core\Alias
 * */

var Alias = require("require-alias");

var alias = new Alias({
    aliases: {
        '@root': "../",
        '@core': 'core/',
        '@api': '../api/',
        '@logs': '../logs/',
        '@resources': '../resources/',
        '@test': '../test/',
        '@v1': '../api/modules/auth/'
    }
});

/**
 * @return Alias instance
 */
module.exports = alias;