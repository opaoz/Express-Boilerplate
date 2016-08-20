"use strict";

/**
 * i18n configuration.
 *
 * @access public
 * @namespace core\i18n
 * */

var i18n = require("i18n");
var path = require('path');
var _ = require('underscore');

var placeholder = require("../placeholder");
var alias = require("../alias");
var i18nConf = placeholder.getBySuffix('i18n');

if (!_.isEmpty(i18nConf)) {
    i18n.configure({
        locales: i18nConf.supported || [],
        defaultLocale: i18nConf.default || "",
        queryParameter: i18nConf.queryParameter || "lang",
        autoReload: i18nConf.autoReload || true,
        directory: path.join(alias.path("@resources"), i18nConf.dir || "locales")
    });
} else {
    console.info("i18n configuration not set.");
}

/**
 * @return i18n instance
 * */
module.exports = i18n;