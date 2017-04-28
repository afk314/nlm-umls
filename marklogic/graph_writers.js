var logger = require('winston');
var mlutils = require('./marklogic-utils');
var async = require('async');
var marklogic = require('marklogic');
var N3 = require('n3');
var my = require('./my-connection.js');
var constants = require('../rdf/constants');
var uutils = require('./../rdf/uri_utils');

var db = marklogic.createDatabaseClient(my.connInfo);


// var streams = {};
//
// streams.stream_handler = {
//
// 	in_use_writers: {},
//
// 	get_writer: function(graph_name) {
// 		if (Object.keys(this.in_use_writers).includes(graph_name)) {
// 			//logger.debug('Returning previously used writer')
// 			return this.in_use_writers[graph_name]['n3'];
// 		} else {
// 			var mwriter = new require('stream').Writable({ objectMode: true });
// 			mlutils.merge_data(graph_name, "text/turtle", mwriter);
// 			//var mwriter = mlutils.get_write_stream(graph_name,"text/turtle");
// 			//var n3writer = n3.Writer(mwriter, { format: "text/turtle" });
// 			var n3writer = n3.Writer(mwriter, { format: "text/turtle" });
//
// 			this.in_use_writers[graph_name] = {};
// 			this.in_use_writers[graph_name]['n3'] = n3writer;
// 			this.in_use_writers[graph_name]['ml'] = mwriter;
// 			//logger.debug('Created loggers and cached them');
// 			return n3writer;
// 		}
// 	},
// 	close_all_writers: function() {
// 		var writers = Object.keys(this.in_use_writers);
// 		for (var i = 0; i < writers.length; i++) {
// 			var graph_name = writers[i];
// 			var writer_obj = this.in_use_writers[graph_name];
// 			try {
// 				writer_obj['n3'].end();
// 				writer_obj['ml'].end();
// 			} catch (err) {
// 				//logger.error('Failed closing..',err)
// 			}
// 			streams.in_use_writers = {};
//
// 			//logger.debug('Closed writer for graph: '+writers[i]);
// 		}
// 	}
// };

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
							db.graphs.merge(graph, 'text/turtle', result).result(function (response) {
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