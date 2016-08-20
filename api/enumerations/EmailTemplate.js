'use strict';

/**
 * Application enumeration of Mail templates.
 *
 * @access public
 * @namespace api\enumerations\EmailTemplate
 *
 * @see <a href='https://github.com/adrai/enum'>Node js enumeration</a>
 * */

var Enum = require('enum');

module.exports = new Enum({

    /*
     * @var object CHANGE_PASSWORD email template
     * */
    CHANGE_PASSWORD: {
        view: 'forgot-password',
        subject: 'Forgot your password ?'
    }
});

