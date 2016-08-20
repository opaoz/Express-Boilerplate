"use strict";

/**
 * App bootstrap file.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');
var passport = require('passport');

var Mongoose = require("./core/db/Mongoose");
var Logger = require('./core/log4js');
var i18n = require('./core/i18n');
var placeholder = require("./core/placeholder");
var HttpStatus = require("./core/enumerations/HttpStatus");
var Constants = require("./api/enumerations/Constants");

var dbConf = placeholder.getBySuffix("mongoose");

var app = express();

app.db = new Mongoose(dbConf.uri);
app.logger = new Logger();
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

var auth = require('./api/middleware/UserAuthentication'); //required for auth

/**
 * User routing register
 */
var userRoute = require('./api/modules/auth/endpoint/auth/routes/user');
app.use(Constants.AUTH_ROUTE.valueOf(), userRoute);

/**
 Error handlers
 * */
/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
    var NotFoundHttpException = require("./core/exceptions/NotFoundHttpException");
    next(new NotFoundHttpException());
});

/**
 *
 * development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        var statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR.valueOf();
        res.status(statusCode)
            .json(
                _.pick({
                    code: statusCode,
                    message: err.message,
                    error: err,
                    errors: err.errors
                }, function (value) {
                    return _.isNumber(value) || !_.isEmpty(value);
                })
            );
    });
}

/**
 * production error handler
 * no stacktraces leaked to user
 */
app.use(function (err, req, res, next) {
    var statusCode = err.status || HttpStatus.INTERNAL_SERVER_ERROR.valueOf();

    res.status(statusCode)
        .json(_.pick({
            code: statusCode,
            message: err.message,
            errors: err.errors
        }, function (value) {
            return _.isNumber(value) || !_.isEmpty(value);
        }));
});

/**
 * @return express application instance
 * */
module.exports = app;
