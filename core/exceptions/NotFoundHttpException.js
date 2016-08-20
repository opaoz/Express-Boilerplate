"use strict";

/*
 * NotFoundHttpException represents a "Not Found" HTTP exception with status code 404.
 */

/**
 * @access public
 * @namespace core\exceptions\NotFoundHttpException
 *
 * @params message String exception message| by default Http standard message for 404
 * @params errors Array which contains error messages
 *
 * @see <a href="http://www.checkupdown.com/status/E404.html">404 Not found</a>
 * */

var HttpException = require("../exceptions/HttpException");
var HttpStatus = require("../enumerations/HttpStatus");

module.exports = function (errors, message) {
    return new HttpException(HttpStatus.NOT_FOUND, message || "Not found.", errors);
};