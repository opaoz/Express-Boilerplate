"use strict";

/*
 * BadRequestHttpException represents a "Bad Request" HTTP exception with status code 400.
 *
 * Use this exception to represent a generic auth error. In many cases, there
 * may be an HTTP exception that more precisely describes the error. In that
 * case, consider using the more precise exception to provide the user with
 * additional information.
 */

/**
 * @access public
 * @namespace core\exceptions\BadRequestHttpException
 *
 * @params message String exception message| by default Http standard message for 400
 * @params errors Array which contains error messages
 *
 * @see <a href="http://www.checkupdown.com/status/E400.html">400 Bad request</a>
 * */

var HttpException = require("../exceptions/HttpException");
var HttpStatus = require("../enumerations/HttpStatus");

module.exports = function (errors, message) {
    return new HttpException(HttpStatus.BAD_REQUEST, message || "Bad request.", errors);
};