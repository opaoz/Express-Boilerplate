'use strict';

/**
 * Application enumeration of constants.
 *
 * @access public
 * @namespace api\enumerations\Constants
 *
 * @see <a href='https://github.com/adrai/enum'>Node js enumeration</a>
 * */

var Enum = require('enum');

module.exports = new Enum({

    /**
     * Api auth namespace.
     * @type String
     * */
    AUTH_ROUTE: '/auth',

    /**
     * Key for user saving for request
     * @type String
     * */
    AUTH_USER: 'user',

    /**
     * Validation rules error name.
     * @type String
     * */
    VALIDATION_ERROR: 'ValidationError',

    /**
     * Error code for resource duplicate.
     * @type Number
     * */
    MONGODB_DUPLICATE_ERROR_CODE: 11000,

    /**
     * Sort index for MongoDb
     * @type Number
     * */
    MONGODB_SORT_ASC: 1,

    /**
     * Desc sort index for MongoDb
     * @type Number
     * */
    MONGODB_SORT_DESC: -1
});