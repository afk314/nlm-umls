var mysql = require('mysql');
var Promise = require('bluebird');
var logger = require('winston');

var pool;
var config;

exports.init = function(configuration) {
	config = configuration;
	pool = mysql.createPool(config.mysql);
};

exports.get_connection = function() {
	return new Promise(function(resolve,reject) {
		if (!pool) {
			return reject(new Error('Pool is not initialized...'));
		}
		pool.getConnection(function(err,connection) {
			if (err) {
				return reject(err);
			} else {
				return resolve(connection);
			}
		})
	})
};

exports.end = function() {
	pool.end(function(err) {
		if (err) {
			logger.error('Something bad..',err);
			console.log(err);
		} else {
			logger.debug('DB Pool is closed..');
		}
	})
};

