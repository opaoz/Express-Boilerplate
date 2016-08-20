"use strict";

/*
 * ForbiddenHttpException represents a "Forbidden" HTTP exception with status code 403.
 *
 * Use this exception when a user has been authenticated but is not allowed to
 * perform the requested action. If the user is not authenticated, consider
 * using a 401 [[UnauthorizedHttpException]]. If you do not want to
 * expose authorization information to the user, it is valid to respond with a  404 [[NotFoundHttpException]].
 */

/**
 * @access public
 * @namespace core\exceptions\ForbiddenHttpException
 *
 * @params message String exception message| by default Http standard message for 401
 * @params errors Array which contains error messages
 *
 * @see <a href="http://www.checkupdown.com/status/E403.html">403 Forbidden</a>
 * */

var HttpException = require("../exceptions/HttpException");
var HttpStatus = require("../enumerations/HttpStatus");

module.exports = function (errors, message) {
    return new HttpException(HttpStatus.FORBIDDEN, message || "Forbidden.", errors);
};