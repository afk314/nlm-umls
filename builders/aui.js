var config = require('config');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var n3 = require('n3');
var util = require('util');
var streams = require('./../marklogic/graph_writers');

var uutils = require('./../rdf/uri_utils');

var aui = {};

var writer;




aui.process_row = function (row) {

	var graph = uutils.graph_for_sab(row.SAB);

	writer = streams.stream_handler.get_writer(graph);


	// aui has type
	writer.addTriple(row.AUI,
		'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
		constants.classes.AUI);

	// aui has code
	writer.addTriple(row.AUI,
		constants.properties.hasCode,
		row.CODE);

	// aui has string
	writer.addTriple(row.AUI,
		constants.properties.skosPrefLabel,
		row.STR);

	// aui has sui
	writer.addTriple(row.AUI,
		constants.properties.hasSui,
		row.SUI);


	// Inferred relationships..

	// belongs to (INFERRED)
	writer.addTriple(row.AUI,
		constants.properties.belongsTo,
		row.CUI);

};

module.exports = aui;