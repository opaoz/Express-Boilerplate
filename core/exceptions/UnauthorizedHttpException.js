"use strict";

/*
 * UnauthorizedHttpException represents an "Unauthorized" HTTP exception with status code 401
 *
 * Use this exception to indicate that a auth needs to authenticate or login
 * to perform the requested action. If the auth is already authenticated and
 * is simply not allowed to perform the action, consider using a 403
 * [[ForbiddenHttpException]] or 404 [[NotFoundHttpException]] instead.
 */

/**
 * @access public
 * @namespace core\exceptions\UnauthorizedHttpException
 *
 * @params message String exception message| by default Http standard message for 401
 * @params errors Array which contains error messages
 *
 * @see <a href="http://www.checkupdown.com/status/E401.html">401 Unauthorized</a>
 * */

var HttpException = require("../exceptions/HttpException");
var HttpStatus = require("../enumerations/HttpStatus");

module.exports = function (errors, message) {
    return new HttpException(HttpStatus.UNAUTHORIZED, message || "Unauthorized.", errors);
};