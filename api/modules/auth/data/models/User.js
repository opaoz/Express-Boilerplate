'use strict';

/**
 * This is the model class for collection "users".
 *
 * @property String _id
 * @property String token
 * @property String login
 * @property String password
 * @property Date createdAt
 * @property Date updatedAt
 *
 * @access public
 * @namespace api\modules\auth\data\models\User.js
 * */

var mongoose = require("mongoose");
var JWT = require('jsonwebtoken');
var _ = require('underscore');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');

var Validator = require("../../../../middleware/Validator");
var i18n = require("../../../../../core/i18n");
var placeholder = require("../../../../../core/placeholder");

var appConf = placeholder.getBySuffix("app");

var Schema = mongoose.Schema;

/**
 * User Schema definition
 */
var UserSchema = new Schema({
    email: {type: String, trim: true, index: true, unique: true},
    password: {type: String, trim: true},
    token: {type: String},
    passwordResetToken: {type: String, trim: true}
}, {versionKey: false, timestamps: true});

/**
 * User Schema validation rules.
 * */
UserSchema.path('email').required(true, i18n.__("%s cann't be blank", i18n.__("email")));
UserSchema.path('email').validate(function (value) {
    return Validator.isEmail(value);
}, i18n.__("invalid %s", i18n.__("email address")));

/**
 * @return User object
 * */
UserSchema.methods.toJSON = function () {
    var obj = this.toObject();

    if (!_.isEmpty(obj.token)) {
        delete obj.token;
    }

    if (!_.isEmpty(obj.password)) {
        delete obj.password;
    }

    return obj;
};

/**
 * User Schema after save action.
 * */
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(null, function (err, salt) {
        if (err) {
            console.error(err);
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                console.error(err);
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

/**
 * @return bool
 * */
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

/**
 * @return User
 * */
UserSchema.methods.createAccessToken = function (next) {
    this.token = JWT.sign(Date.now(), appConf.secret);
    this.save(function (err, user) {
        if (err) {
            console.error(err);
            next(err);
        }

        next(null, user);
    });
};

/**
 * Schema plugins
 * */
UserSchema.plugin(uniqueValidator, {message: i18n.__("%s already exist", '{PATH}')});

/**
 * Define Client model
 * */
var User = mongoose.model('User', UserSchema);

/**
 * @return Client model instance.
 * */
module.exports = User;