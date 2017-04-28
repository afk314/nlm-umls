var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var my_db = require('../mysql/database');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var streams = require('./../marklogic/graph_writers');
var cleansing = require('./../helpers/cleansing');

var n3 = require('n3');
var util = require('util');
var async = require('async');


var aui = require('./aui');
var sab = require('./sab');
var sui = require('./sui');
var lui = require('./lui');
var cui = require('./cui');

mlutils.init();


var builder = {};
var total_seen = 0;
var _config;
var query_provider;

const limit = 15000;

builder.outer_run = function(config, queryprovider, cb) {
	var offset = 0;
	_config = config;
	query_provider = queryprovider;
	async.doUntil(function(callback) {
		builder.build(offset,limit).then(function(returned) {
			offset = offset + returned;
			return callback(null,returned);
		})
	},
	function(returned) {
		if (returned < limit) {
			offset = offset+returned;
			return true;
		} else {
			return false;
		}
	}, function (err, args) {
		if (err) {
			logger.error('Uh oh..',err);
			return cb(err);
		} else {
			logger.debug('Done with outer..');

			return cb(null);
		}
	});
};

builder.build = function(offset,limit) {
	var conn;
	var seen = 0;
	var start = new Date();
	return new Promise(function(resolve,reject) {
		my_db.get_connection().then(connection => {
			conn = connection;
			logger.debug('Offset: '+offset);
			var q = connection.query(query_provider.get_query(offset, limit));
			q
				.on('error', function(err) {
					// Handle error, an 'end' event will be emitted after this as well
					logger.error('Some error occurred..',err);
					return reject(err);
				})
				.on('fields', function(fields) {
					// the field packets for the rows to follow
					//logger.debug('Fields..'+fields);
				})
				.on('result', function(row) {

					connection.pause();
					seen++;
					if (seen % limit === 0) {
						builder.process_row(row, function() {
							connection.resume();
						});
					} else if (seen % 500000 === 0 ) {
						builder.process_row(row, function() {
							connection.resume();
						});
					} else {

						builder.process_row(row, function() {
							connection.resume();
						});
					}
				})
				.on('end', function() {

					// all rows have been received
					connection.release();
					//logger.debug('Release db pool object');
					streams.commit().then(function(result) {
						//logger.debug('Committed!');
						var now = new Date();
						var dif = (now.getTime() - start.getTime()) / 1000;
						logger.debug(dif + ' seconds');
						return resolve(seen);
					}).catch(function(err) {
						logger.error(err);
						return reject(err);
					})

				});

		});
	})
};





builder.process_row = function (row, cb) {

	row = cleansing.transform_row(row);

	//logger.debug(util.inspect(row));
	aui.process_row(config, row);
	sab.process_row(config, row);
	sui.process_row(config, row);
	lui.process_row(config, row);
	cui.process_row(config, row);


	return cb();
};

module.exports = builder;

