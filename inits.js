var logger = require('winston');
var mlutils = require('./marklogic/marklogic-utils');
var database = require('./mysql/database');

var config;

exports.init = function(configuration) {
	config = configuration;
	init_logging();
	mlutils.init(config);
	database.init(config);

};

function init_logging() {
	logger.configure({
		transports: [
			new (logger.transports.Console)({ level: "debug" })
		]
	});
}