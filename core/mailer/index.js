"use strict";

/**
 * Mailer configuration.
 *
 * @access public
 * @namespace core\\mailer
 * */

var app = require('express')();
var mailer = require('express-mailer');
var path = require('path');
var _ = require('underscore');

var placeholder = require("../placeholder");
var alias = require("../alias");
var mailConf = placeholder.getBySuffix('mail');

/* Set up mail templates*/
app.set('views', path.join(alias.path("@root"), 'resources', mailConf.dir || 'mail'));
app.set('view engine', mailConf.viewEngine || 'ejs');

if (!_.isEmpty(mailConf)) {
    mailer.extend(app, mailConf);
} else {
    console.info("Mail configuration not set.");
}

/**
 * Initialize Mailer object
 * @constructor
 * */
function Mailer() {
    this.from = mailConf.from;
}

/**
 * @params emailTemplate
 * @params to receiver email address
 * @params data mail template data
 * @params next callback function
 * @return boolean
 * */
Mailer.prototype.send = function (emailTemplate, to, data, next) {

    emailTemplate = emailTemplate.valueOf();

    app.mailer.send(emailTemplate.view, {
        to: to,
        subject: emailTemplate.subject,
        data: data || {}
    }, function (err) {
        if (err) {
            console.error(err);
            return next(err);
        }
        console.info("Email successfully sent to user " + to);
        return next(null, true);
    });
};

/**
 * @return Mailer instance
 * */
module.exports = new Mailer();


