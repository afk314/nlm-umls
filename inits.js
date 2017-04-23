var logger = require('winston');

var config;

exports.init = function(configuration) {
	config = configuration;
	init_logging();
};

function init_logging() {
	logger.configure({
		transports: [
			new (logger.transports.Console)({ level: "debug" })
		]
	});
}