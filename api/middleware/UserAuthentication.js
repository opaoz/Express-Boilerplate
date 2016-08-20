'use strict';

/**
 * User Authentication filter.
 *
 * @access public
 * @namespace api\middleware\UserAuthentication
 * */

var UnauthorizedHttpException = require('../../core/exceptions/UnauthorizedHttpException');
var _ = require('underscore');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('../../api/modules/auth/data/models/User');
var Constants = require('../../api/enumerations/Constants');

/**
 * @throws UnauthorizedHttpException
 * @return callback
 * */
passport.use(new BearerStrategy(function (token, done) {
        User.findOne({token: token}, function (err, user) {
            if (err) {
                return done(new UnauthorizedHttpException());
            } else if (_.isEmpty(user)) {
                return done(new UnauthorizedHttpException());
            }

            return done(null, user);
        });
    }
));