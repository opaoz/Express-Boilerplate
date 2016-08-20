"use strict";

/*
 *  Entity error when submitting form with ajax
 */

/**
 * @access public
 * @namespace core\exceptions\UnprocessableEntityHttpException
 *
 * @params message String exception message| by default Http standard message for 404
 * @params errors Array which contains error messages
 * */

var HttpException = require("../exceptions/HttpException");
var HttpStatus = require("../enumerations/HttpStatus");

module.exports = function (errors, message) {
    return new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, message || "Unprocessable Entity.", errors);
};