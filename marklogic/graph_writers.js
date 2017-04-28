var logger = require('winston');
var mlutils = require('./marklogic-utils');
var async = require('async');
var marklogic = require('marklogic');
var N3 = require('n3');
var constants = require('../rdf/constants');
var uutils = require('./../rdf/uri_utils');



var streams = {};
var writers = {};

streams.get_writer = function(graph) {
	if (writers[graph]) {
		return writers[graph];
	} else {
		//logger.debug('Creating a writer for graph: '+graph);
		var writer = N3.Writer({ format: 'test/turtle' });
		writers[graph] = writer;
		return writer;
	}
};

function get_array_of_writers() {
	var keys = Object.keys(writers);
	var writers = [];
	for (var i = 0; i<keys.length; i++) {
		var key = keys[i];
		var writer = writers[key];
		writers.push(writer);
	}
	return writers;
}

function get_array_of_keys() {
	return Object.keys(writers);
}

function clear_writers() {
	writers = {};
}

streams.commit = function() {
	return new Promise(function(resolve,reject) {
		async.eachLimit(get_array_of_keys(), 2, function(graph, callback) {
				writer = writers[graph];
				//logger.debug('Closing writer for graph: '+graph);
				writer.end(function(err,result) {
					if (err) {
						return callback(err);
					} else {
						try {
							logger.debug('About to merge graph: '+graph)
							if (graph.endsWith('nci_data')) {
								//console.log(result);
							}
							mlutils.get_db().graphs.merge(graph, 'text/turtle', result).result(function (response) {
								// console.log('Written to ml');
								return callback();
							})
						} catch(err) {
							logger.error('Uh oh..', err);
							return callback(err);
						}
					}
				})

			},
			function(err) {
				if (err) {
					return reject(err);
				} else {
					//logger.debug('All writers closed!');
					clear_writers();
					return resolve();
				}
			}
		);
	});
};


module.exports = streams;