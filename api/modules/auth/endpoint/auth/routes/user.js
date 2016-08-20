'use strict';

/**
 * User routes
 *
 * @access public
 * @namespace api\modules\auth\endpoint\auth\routes\user
 * */

var express = require('express');
var passport = require('passport');

var UserController = require('../controllers/UserController');

var router = express.Router();

router
    .post('/login',
        UserController.actionLogin)
    .post('/logout',
        passport.authenticate('bearer', {session: false}),
        UserController.actionLogout)
    .post('/password',
        UserController.actionResetPassword)
    .post('/register',
        UserController.actionRegister)
    .delete('/password',
        UserController.actionForgotPassword)
    .get('/echo',
        passport.authenticate('bearer', {session: false}),
        UserController.actionEcho);

module.exports = router;
