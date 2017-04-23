var config = require('config');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var n3 = require('n3');
var util = require('util');
var streams = require('./../marklogic/graph_writers');



var sui = {};


sui.process_row = function (row) {


	var graph = constants.graphs.Sui;
	writer = streams.stream_handler.get_writer(graph);


	writer.addTriple(row.SUI,
		constants.properties.rdfType,
		constants.classes.SUI);

	// sui has string - this is redundant but nice to have
	writer.addTriple(row.SUI,
		constants.properties.skosPrefLabel,
		row.STR);


	// Inferred relationships..

	writer.addTriple(row.SUI,
		constants.properties.belongsTo,
		row.LUI);


};

module.exports = sui;