'use strict';

/**
 * UserController
 *
 * @apiDefine User User
 *
 * @access public
 * @namespace api\modules\v1\endpoint\user\controllers\UserController
 * */

var randomstring = require('randomstring');
var util = require('util');
var _ = require('underscore');
var async = require('async');

var Mailer = require('../../../../../../core/mailer');
var Validator = require('../../../../../middleware/Validator');
var placeholder = require('../../../../../../core/placeholder');
var User = require('../../../data/models/User');
var i18n = require('../../../../../../core/i18n');
var EmailTemplate = require('../../../../../enumerations/EmailTemplate');
var ResponseDto = require('../../../../../middleware/ResponseDTO');
var Constants = require('../../../../../enumerations/Constants');
var HttpStatus = require('../../../../../../core/enumerations/HttpStatus');
var BadRequestHttpException = require('../../../../../../core/exceptions/BadRequestHttpException');
var ServerErrorHttpException = require('../../../../../../core/exceptions/ServerErrorHttpException');
var NotFoundHttpException = require('../../../../../../core/exceptions/NotFoundHttpException');
var ForbiddenHttpException = require('../../../../../../core/exceptions/ForbiddenHttpException');
var UnprocessableEntityHttpException = require('../../../../../../core/exceptions/UnprocessableEntityHttpException');

/**
 * Initialize UserController object
 * @constructor
 * */
function UserController() {
}

/**
 * @api {POST} /email Login
 * @apiHeaderExample {json} Headers
 *     {
 *       'Content-type': 'application/json'
 *     }
 * @apiVersion 1.0.0
 * @apiName PostUserLogin
 * @apiGroup User
 *
 * @apiParam {String} email the user's email
 * @apiParam {String} password the user's password
 *
 * @apiParamExample {json} Request
 *     {
 *       'email':'example',
 *       'password':'password'
 *     }
 *
 * @apiErrorExample Response error: Not found
 *    HTTP/1.1 404 Not found
 *    {
 *     'code': 404,
 *     'message': 'Not found.',
 *     'errors': [
 *      'invalid credentials'
 *     ]
 *   }
 *
 * @apiSuccessExample  Response success {User}
 *     HTTP/1.1 200 Ok
 *     {
 *       'status': 200,
 *       'name': 'OK',
 *       'data': {
 *         'token': 'eyJhbGciOiJIUzI1NiJ9.MTQ2NTkwNDI1NjI3OA.2FNE-ImJ2hxNCNO5Ig13ieJpj5Ornv2PM6_bCLQaH6Y',
 *         'user': {
 *           '_id': '575ef9eb3b21523c11734795',
 *           'updatedAt': '2016-06-14T11:37:36.289Z',
 *           'createdAt': '2016-06-13T18:22:35.048Z',
 *           'email': 'opa_oz@mailinator.com',
 *         }
 *       }
 *     }
 *
 * */
UserController.prototype.actionLogin = function (req, res, next) {
    var email = req.body.email ? String(req.body.email).toLocaleLowerCase() : null;
    var password = req.body.password ? String(req.body.password) : null;

    User.findOne({
        email: email
    }).exec(function (err, user) {
        if (err) {
            console.error(err);
            return next(new ServerErrorHttpException());
        } else if (_.isEmpty(user) || !user.comparePassword(password)) {
            return next(new NotFoundHttpException([res.__('invalid credentials')]));
        }

        user.createAccessToken(function (err, user) {
            if (err) {
                console.error(err);
                return next(new ServerErrorHttpException());
            }

            return new ResponseDto(res, HttpStatus.OK, {
                token: user.token,
                user: user
            });
        });
    });
};

/**
 * @api {POST} /logout Logout
 * @apiHeaderExample {json} Headers
 *     {
 *       'Authorization': 'Bearer TOKEN'
 *     }
 * @apiVersion 1.0.0
 * @apiName PostUserLogout
 * @apiGroup User
 *
 * @apiSuccessExample  Response success
 *     HTTP/1.1 204 No Content
 * */
UserController.prototype.actionLogout = function (req, res, next) {
    var user = req.user || {};

    User.update(
        {
            _id: user._id
        },
        {
            $unset: {
                token: 1
            }
        }, function (err, result) {
            if (err) {
                console.error(err);
                return next(new ServerErrorHttpException());
            } else if (result && result.n < 1) {
                return next(new ServerErrorHttpException());
            }

            return new ResponseDto(res, HttpStatus.NO_CONTENT);
        });
};

/**
 * @api {DELETE} /password?email=email Forgot password
 * @apiVersion 1.0.0
 * @apiName DeleteForgotPassword
 * @apiGroup User
 *
 * @apiErrorExample Response error: Not found
 *    HTTP/1.1 404 Not found
 *    {
 *      'code': 404,
 *      'message': 'Not found.'
 *    }
 *
 * @apiSuccessExample  Response success
 *     HTTP/1.1 202 Accepted
 *     {
 *       'status': 202,
 *       'name': 'ACCEPTED',
 *       'data':{
 *          'token': 'BSSRiTY7JDX730LCxT3a79R5y4asZWUZ'
 *        }
 *     }
 * */
UserController.prototype.actionForgotPassword = function (req, res, next) {
    var email = req.query.email ? String(req.query.email).toLocaleLowerCase() : null;

    User.findOne({
        email: email
    }).exec(function (err, user) {
        if (err) {
            console.error(err);
            return next(new ServerErrorHttpException());
        } else if (_.isEmpty(user)) {
            return next(new NotFoundHttpException());
        }

        user.passwordResetToken = randomstring.generate();

        user.save(function (err, user) {
            if (err) {
                console.info(err);
                return next(new ServerErrorHttpException());
            }

            var appConf = placeholder.getBySuffix('app');
            var link = util.format('%s/%s?token=%s',
                appConf.url.base,
                appConf.url.resetPass,
                user.passwordResetToken);

            Mailer.send(EmailTemplate.CHANGE_PASSWORD, user.email, {
                link: link
            }, function (err) {
                if (err) {
                    return next(new ServerErrorHttpException());
                }

                return new ResponseDto(res, HttpStatus.ACCEPTED, {token: user.passwordResetToken});
            });
        });
    });
};

/**
 * @api {POST} /password Change password
 * @apiHeaderExample {json} Headers
 *     {
 *       'Content-type': 'application/json'
 *     }
 * @apiVersion 1.0.0
 * @apiName PostUserChangePassword
 * @apiGroup User
 *
 * @apiParam {String} token the change password token
 * @apiParam {String} password the user's new password
 *
 * @apiParamExample {json} Request
 *     {
 *       'token':'token',
 *       'password':'password'
 *     }
 *
 * @apiErrorExample Response error: Not found
 *    HTTP/1.1 404 Not found
 *    {
 *      'code': 404,
 *      'message': 'Not found.'
 *    }
 *
 * @apiSuccessExample  Response success
 *     HTTP/1.1 202 Accepted
 * */
UserController.prototype.actionResetPassword = function (req, res, next) {
    var token = req.body.token ? String(req.body.token) : null;
    var password = req.body.password ? String(req.body.password) : null;

    User.findOne({
        passwordResetToken: token
    }, function (err, user) {
        if (err) {
            console.error(err);
            return next(new ServerErrorHttpException());
        } else if (_.isEmpty(user)) {
            return next(new NotFoundHttpException());
        }

        user.password = password;
        user.token = undefined;
        user.passwordResetToken = undefined;

        user.save(function (err) {
            if (err) {
                if (err.hasOwnProperty('name') && err.name === Constants.VALIDATION_ERROR.valueOf()) {
                    return next(new UnprocessableEntityHttpException(_.pluck(err.errors, 'message')));
                }
                console.error(err);
                return next(new ServerErrorHttpException());
            }

            return new ResponseDto(res, HttpStatus.ACCEPTED);

        });
    });
};

/**
 * @api {POST} /register Register user
 * @apiHeaderExample {json} Headers
 *     {
 *       'Content-type': 'application/json'
 *     }
 * @apiVersion 1.0.0
 * @apiName PostUserRegister
 * @apiGroup User
 *
 * @apiParam {String} email the user's email
 * @apiParam {String} password the user's password
 *
 * @apiParamExample {json} Request
 *     {
 *       'email':'email@example.com',
 *       'password':'password'
 *     }
 *
 * @apiErrorExample Response error: Unprocessable entity
 *    HTTP/1.1 422 Unprocessable Entity
 *    {
 *       "code": 422,
 *       "message": "user already exists",
 *       "error": {
 *         "status": 422,
 *         "message": "user already exists",
 *         "errors": []
 *       }
 *     }
 *
 * @apiSuccessExample  Response success
 *     HTTP/1.1 201 Created
 *     {
 *        "status": 201,
 *        "name": "CREATED",
 *        "data": {
 *          "token": "eyJhbGciOiJIUzI1NiJ9.MTQ2NzcxMDA0NDE3MQ.OVfOQR94_9shMnhbsPOuJm_YmV3JVNV5ln0xFWgNqI8",
 *          "user": {
 *            "updatedAt": "2016-07-05T09:14:04.182Z",
 *            "createdAt": "2016-07-05T09:14:03.859Z",
 *            "email": "vladimirlevinozinki@gmail.com",
 *            "_id": "577b7a5b87240a640260b933"
 *          }
 *        }
 *      }
 * */
UserController.prototype.actionRegister = function (req, res, next) {
    var body = req.body || {};

    return User.find({
        email: body.email
    }, function (err, user) {
        if (err) {
            return next(new ServerErrorHttpException(err));
        } else if (!_.isEmpty(user)) {
            return next(new UnprocessableEntityHttpException(null, i18n.__('user already exists')));
        }

        var model = new User();
        model.email = body.email;
        model.password = body.password;

        return model.save(function (err, user) {
            if (err) {
                return next(new ServerErrorHttpException(err));
            }

            user.createAccessToken(function (err, user) {
                if (err) {
                    console.error(err);
                    return next(new ServerErrorHttpException());
                }

                return new ResponseDto(res, HttpStatus.CREATED, {
                    token: user.token,
                    user: user
                });
            });
        });
    });
};

/**
 * @api {GET} /echo Echo action
 * @apiHeaderExample {json} Headers
 *     {
 *       'Authorization': 'Bearer TOKEN'
 *     }
 * @apiVersion 1.0.0
 * @apiName GetUserEcho
 * @apiGroup User
 *
 * @apiErrorExample Response error: Server error
 *    HTTP/1.1 500 Server error
 *    {
 *     'code': 500,
 *     'message': 'Internal server error.',
 *   }
 *
 * @apiSuccessExample  Response success
 *     HTTP/1.1 200 OK
 */
UserController.prototype.actionEcho = function (req, res, next) {
    var error = !!req.query.error;

    if (error) {
        return next(new ServerErrorHttpException());
    }

    return new ResponseDto(res, HttpStatus.OK);
};

/**
 * @return UserController instance
 * */
module.exports = new UserController();