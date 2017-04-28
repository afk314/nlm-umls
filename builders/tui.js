var config = require('config');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var n3 = require('n3');
var util = require('util');
var streams = require('./../marklogic/graph_writers');



var tui = {};





tui.process_row = function (config, row) {


	var graph = constants.graphs.Tui;
	writer = streams.get_writer(graph);

	// writer.addTriple(row.LUI,
	// 		constants.properties.rdfType,
	// 		constants.classes.LUI);
	//
	// writer.addTriple(row.LUI,
	// 	constants.properties.hasSui,
	// 	row.SUI);
	//
	// writer.addTriple(row.LUI,
	// 	constants.properties.skosAltLabel,
	// 	row.STR);



	// Inferred relationships..


	// writer.addTriple(row.LUI,
	// 	constants.properties.belongsTo,
	// 	row.AUI);


};

module.exports = tui;