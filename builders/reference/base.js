var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var my_db = require('../../mysql/database');
var logger = require('winston');
var mlutils = require('../../marklogic/marklogic-utils');
var constants = require('../../rdf/constants');
var streams = require('./../../marklogic/graph_writers');
var cleansing = require('./../../helpers/cleansing');
var n3 = require('n3');
var util = require('util');
var async = require('async');


var ref_data = {};
module.exports = ref_data;

var writer;


/**
 * Any necessary cleanup.  Right now this often involves dropping a reference
 * graph.
 *
 * @param graph - the graph we will be working with
 * @param drop - A bool the declares whether we want to first drop the graph
 * @param obj - the whole module exports, just in case we need to dig
 */
ref_data.init = function(graph, drop, obj) {
	writer = streams.get_writer(graph);
	this.graph = graph;
	return new Promise(function(resolve,reject) {
		if (drop) {
			mlutils.remove_graph(graph).then(function (response) {
				logger.debug('Response from dropping: ' + util.inspect(response));
				return resolve();
			})
		}
	});
};

/**
 * Get a connection to db, execute query, loop over results and call the
 * row processor
 *
 * @param graph - The graph to operate on
 * @param query - The mysql query to execute
 * @param row_processor_func - a func that will build triples for each row
 */
ref_data.build = function(graph, query, row_processor_func) {
	var conn;
	var seen = 0;
	var start = new Date();


	return new Promise(function(resolve,reject) {

		my_db.get_connection().then(connection => {
			conn = connection;
			var q = connection.query(query);
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
					row_processor_func(row,writer).then(function(){
						connection.resume();
					});

				})
				.on('end', function() {
					// all rows have been received
					connection.release();
					//logger.debug('Release db pool object');
					streams.commit_graph(graph, writer)
					.then(function(result) {
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


