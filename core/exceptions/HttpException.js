"use strict";

/*
 * HttpException represents an exception caused by an improper request of the end-user.
 *
 * HttpException can be differentiated via its [[statusCode]] property value which
 * keeps a standard HTTP status code (e.g. 404, 500).
 */

/**
 * @access public
 * @namespace core\exceptions\HttpException
 *
 * @params httpStatus Number|HttpStatus|String
 * @params message String exception message
 * @params errors Array which contains error messages
 *
 * @see <a href="http://www.checkupdown.com/status/error1.html">HTTP errors</a>
 * */

var util = require("util");
var _ = require("underscore");

var HttpStatus = require("../enumerations/HttpStatus");

module.exports = function (httpStatus, message, errors) {

    var statusCode = HttpStatus.INTERNAL_SERVER_ERROR.valueOf();
    var statusMessage = HttpStatus.INTERNAL_SERVER_ERROR.key;

    if (typeof httpStatus === "number") {
        httpStatus = HttpStatus.get(httpStatus);
        if (!_.isUndefined(httpStatus)) {
            statusCode = httpStatus.valueOf();
            statusMessage = message || httpStatus.key;
        } else {
            console.info("Undefined http status " + httpStatus);
        }
    } else if (typeof httpStatus === "object") {
        statusCode = httpStatus.valueOf();
        statusMessage = message || httpStatus.key;
    } else if (typeof httpStatus === "string") {
        statusMessage = httpStatus;
    }

    function HttpException(status, message, errors) {
        this.status = status;
        this.message = message;
        this.errors = errors || [];
        Error.captureStackTrace(this);
    }

    HttpException.prototype.name = "HttpException";

    util.inherits(HttpException, Error);

    return new HttpException(statusCode, statusMessage, errors);
};