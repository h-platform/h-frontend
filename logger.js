/**
 * This module provides a configured Winston logger. Should
 * be used for all logging activities throughout the application.
 *
 * @module logger
 */


// Import module dependencies
var winston = require("winston");
var mkdirp = require('mkdirp');
var config = require('config');
var path = require('path');


// Recursively create log directory if it does not exist
mkdirp.sync(config.get('logging.directory'));


/**
 * Returns instance of Winston's Logger configured to print 
 * debug level logs to console, and to save warning level
 * logs to file.
 *
 * @property
 * @type winston.Logger
 */
module.exports = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      handleExceptions: true,
      json: false,
      colorize: true
    }),
    new(winston.transports.File)({
      filename: path.resolve(config.get('logging.directory'), 'server.log'),
      level: 'debug',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 10,
      colorize: false
    })
  ]
});