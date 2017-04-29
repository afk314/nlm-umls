var mysql = require('mysql');
var async = require('async');
var Promise = require('bluebird');
var logger = require('winston');
var sty = require('./builders/reference/sty');
var db = require('./mysql/database');
var inits = require('./inits');
var config = require('config');


inits.init(config);


// Manager of reference data runners


async.waterfall([

	function(callback) {
		sty.run().then(function() {
			return callback();
		}).catch(function(err) {
			return callback(err);
		})
	}],

	function(err) {
		if (err) {
			logger.error('Uh oh..', err);
		} else {
			db.end();
		}
	}
);













