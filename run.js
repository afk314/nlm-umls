var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var master_builder = require('./builders/master_builder');

var mlutils = require('./marklogic/marklogic-utils');


var database = require('./mysql/database');
var inits = require('./inits');

logger.debug("We are running!");
database.init(config);
inits.init(config);
mlutils.init(config);

mlutils.list_graphs();


master_builder.outer_run(function(err,results) {
	database.end();
	if (err) {
		logger.error('Oh no..',err);
	} else {
		logger.debug(results);
	}
});





