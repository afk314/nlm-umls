var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var master_builder = require('./builders/master_builder');

var mlutils = require('./marklogic/marklogic-utils');


var database = require('./mysql/database');
var query_provider = require('./mysql/query_provider');

var inits = require('./inits');

logger.debug("We are running!");
database.init(config);
inits.init(config);
mlutils.init(config);

mlutils.list_graphs();

try {
	master_builder.outer_run(config,query_provider, function (err, results) {

		if (err) {
			logger.error('Oh no..', err);
		} else {
			logger.debug(results);
		}
		database.end();
	})
} catch (err) {
	logger.error('Oh no..', err);
}





