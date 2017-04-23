var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var my_db = require('../mysql/database');
var logger = require('winston');
var mlutils = require('../marklogic/marklogic-utils');
var constants = require('../rdf/constants');
var streams = require('./../marklogic/graph_writers');
var n3 = require('n3');
var util = require('util');


var aui = require('./aui');
var sab = require('./sab');
var sui = require('./sui');
var lui = require('./lui');


var query = "SELECT * FROM MRCONSO mrcon where  \n" +

	"      (mrcon.SAB='MSH' OR mrcon.SAB='ICD9CM' OR mrcon.SAB='ICD10CM' OR mrcon.SAB='SNOMEDCT_US' OR mrcon.SAB='CHV' OR \n" +
	"         mrcon.SAB='LNC' OR mrcon.SAB='CPT' OR mrcon.SAB='ICD10PCS' OR mrcon.SAB='MEDLINEPLUS' OR mrcon.SAB='MSH' OR \n" +
	"         mrcon.SAB='NCI' OR mrcon.SAB='RXNORM'\n" +
	"      ) ORDER BY AUI,SUI LIMIT %OFFSET%,%LIMIT%";

var builder = {};

var count = 0;

mlutils.init();

function get_query(offset, limit) {
	return query.replace('%OFFSET%', offset).replace('%LIMIT%', limit);
}


builder.build = function() {
	var conn;
	var seen = 0;
	return new Promise(function(resolve,reject) {
		my_db.get_connection().then(connection => {
			conn = connection;
			var q = connection.query(get_query(seen, '5000000'));
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
					if (seen % 250 === 0) {
						logger.debug(seen+' rows seen');
					}



					if (seen % 5000 === 0) {
						setTimeout(function() {
							builder.process_row(row, function() {
								connection.resume();
							});
						},1000)
					} else {
						builder.process_row(row, function() {
							connection.resume();
						});
					}




				})
				.on('end', function() {
					// all rows have been received
					logger.debug('Done streaming mrconso rows..');
					streams.stream_handler.close_all_writers();
					conn.release();
					return resolve(true);
				});

		});
	})
};



function gw(graph) {
	return streams.stream_handler.get_writer(graph);
}


function transform_row(row) {

	if (row.LAT = 'ENG') {
		row.LAT = 'en';
	} else if (row.LAT = 'FRE') {
		row.LAT = "fr";
	} else if (row.LAT = 'SPA') {
		row.LAT = "es";
	}

	row.CUI = constants.resources.Cui + row.CUI;
	row.AUI = constants.resources.Aui + row.AUI;
	row.LUI = constants.resources.Lui + row.LUI;
	row.SUI = constants.resources.Sui + row.SUI;
	row.STR = '"'+row.STR+'"@'+row.LAT;
	row.CODE = uutils.get_uri_for_code(row.SAB, row.CODE);
	return row;
}

builder.process_row = function (row, cb) {

	row = transform_row(row);

	//logger.debug(util.inspect(row));
	aui.process_row(row);
	sab.process_row(row);
	sui.process_row(row);
	lui.process_row(row);



	return cb();
};

module.exports = builder;

