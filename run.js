var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var master_builder = require('./builders/master_builder');
var mlutils = require('./marklogic/marklogic-utils');
var inits = require('./inits');


// Fetch our query provider based on config settings..
var query_provider = require(config.get('application.query_provider'));

inits.init(config);



mlutils.list_graphs().then(function() {
	master_builder.outer_run(config, query_provider, function (err, results) {
		if (err) {
			logger.error('Oh no..', err);
		} else {
			logger.debug(results);
		}
	});
}).catch(function(err) {
	logger.error('Uh oh!',err);
});








