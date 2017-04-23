var config = require('config');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var n3 = require('n3');
var util = require('util');
var streams = require('./../marklogic/graph_writers');

var uutils = require('./../rdf/uri_utils');

var cui = {};

var writer;




cui.process_row = function (row) {

	var graph = constants.graphs.Cui;

	writer = streams.stream_handler.get_writer(graph);


	// aui has type
	writer.addTriple(row.CUI,
		'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
		constants.classes.CUI);

	// aui has code
	writer.addTriple(row.CUI,
		constants.properties.hasAui,
		row.AUI);

	var lui_prop = uutils.get_lui_relationship(row.TS);
	// aui has string
	writer.addTriple(row.CUI,
		lui_prop,
		row.LUI);

	// aui has sui
	writer.addTriple(row.AUI,
		constants.properties.hasSui,
		row.SUI);

};

module.exports = aui;