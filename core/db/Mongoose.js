"use strict";

/**
 * Application mongoose connection class.
 *
 * @access public
 * @namespace core\db\Mongoose
 *
 * @see <a href="http://mongoosejs.com/">Mongoose</a>
 * */

var mongoose = require('mongoose');

/**
 * @params uri Mongoose connection url e.g [ mongodb://localhost:27017/DB_NAME]
 * @return Mongoose db instance
 * */
module.exports = function (uri) {

    mongoose.connect(uri);

    var db = mongoose.connection;

    db.on('error', function (err) {
        console.error(err);
    });

    db.once('open', function () {
        console.info("Connected to db %s", uri);
    });

    return db;
};

