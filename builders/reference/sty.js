var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var my_db = require('../../mysql/database');
var logger = require('winston');
var mlutils = require('../../marklogic/marklogic-utils');
var constants = require('../../rdf/constants');
var streams = require('./../../marklogic/graph_writers');
var base = require('./base');

var n3 = require('n3');
var util = require('util');
var async = require('async');

var sty = {};
sty.graph = constants.graphs.Tui;
sty.query = 'select distinct TUI,STY from MRSTY';



/**
 * This is the only required function
 */
sty.run = function() {
	return new Promise(function(resolve,reject) {
		base.init(sty.graph,true,sty).then(function() {
			base.build(sty.graph, sty.query, sty.row_processor)
				.then(base.close)
				.then(function() {
					return resolve();
				})
				.catch(function (err) {
					logger.error(err);
					return reject(err);
				})
		});
	});
};


sty.row_processor = function(row,writer) {
	return new Promise(function(resolve,reject) {
		row.TUI = constants.resources.Tui + row.TUI;
		row.STY = '"'+row.STY+'"';

		// aui has type
		writer.addTriple(row.TUI,
			'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
			constants.classes.TUI);


		// aui has string
		writer.addTriple(row.TUI,
			constants.properties.skosPrefLabel,
			row.STY);
		return resolve();
	})
};



module.exports = sty;



