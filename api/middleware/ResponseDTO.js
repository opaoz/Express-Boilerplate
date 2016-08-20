'use strict';

/**
 * @access public
 * @namespace api\middleware\ResponseDTO
 * */

var _ = require('underscore');

/**
 * @params res Application http response instance
 * @params httpStatus response status enumeration
 * @params data response data transfer object
 * @params message response transfer message
 * @return ResponseDto object
 */
module.exports = function (res, httpStatus, data, message) {

    var response = _.pick({
        status: httpStatus.valueOf(), name: httpStatus.key, message: message, data: data
    }, function (value) {
        return _.isNumber(value) || !_.isNull(value);
    });

    return res.status(httpStatus.valueOf()).json(response);
};