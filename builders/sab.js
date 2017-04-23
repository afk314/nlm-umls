var config = require('config');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var n3 = require('n3');
var util = require('util');
var streams = require('./../marklogic/graph_writers');



var sab = {};



var seen = [];

sab.process_row = function (row) {

	if (!seen.includes(row.SAB)) {
		var graph = uutils.graph_for_sab(row.SAB);
		writer = streams.stream_handler.get_writer(graph);
		writer.addTriple(constants.resources.Sab + row.SAB,
			constants.properties.rdfType,
			constants.classes.SAB);
		seen.push(row.SAB);
	}

};

module.exports = sab;