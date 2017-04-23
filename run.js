var mysql = require('mysql');
var config = require('config');
var Promise = require('bluebird');
var logger = require('winston');
var icd10cm = require('./builders/master_builder');

var mlutils = require('./marklogic/marklogic-utils');


var database = require('./mysql/database');
var inits = require('./inits');

logger.debug("We are running!");
database.init(config);
inits.init(config);
mlutils.init(config);

mlutils.list_graphs();

try {
	icd10cm.build().then(() => {
		logger.debug('Done!')
		database.end();
	}).catch(err => logger.error(err));
} catch(err) {
	logger.error('Dang..',err);
}





