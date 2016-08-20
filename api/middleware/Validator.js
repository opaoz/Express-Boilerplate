'use strict';

/**
 * @access public
 * @namespace api\middleware\Validator
 * */

/**
 * @param email String
 * @return boolean
 * */
exports.isEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

/**
 * @param value String
 * @return boolean
 * */
exports.isDate = function (value) {
    var re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(value);
};

/**
 * @param value String
 * @return boolean
 * */
exports.isYear = function (value) {
    var re = /^\d{4}$/;
    return re.test(value);
};

/**
 * @param id
 * @returns {boolean}
 */
exports.isObjectId = function (id) {
    var re = new RegExp('^[0-9a-fA-F]{24}$');

    return id && re.test(id.toString());
};


/**
 * @param zip String
 * @return boolean
 * */
exports.isZipCode = function (zip) {
        return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip || '');
};