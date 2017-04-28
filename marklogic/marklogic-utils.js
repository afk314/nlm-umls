var marklogic = require('marklogic');
var logger = require('winston');

var ml_db, config;

var mlutils = {};

mlutils.init = function(configuration) {
	config = configuration;
	var default_instance = config.get('marklogic.default');
	var ml_config = config.get('marklogic.'+default_instance);
	ml_db = marklogic.createDatabaseClient(ml_config);
	logger.debug('Connection established to MarkLogic: '+ml_config.host)
};

mlutils.get_db = function() {
	return ml_db;
};


mlutils.merge_data = function(graph, mimetype, writer) {
	ml_db.graphs.merge(graph,mimetype,writer);
};

mlutils.list_graphs = function() {
	return new Promise(function(resolve,reject) {
		//logger.debug('----------------Existing Graphs--------------------')
		ml_db.graphs.list('text/uri-list')
			.result(
				function (response) {
					for (var uri of response.split('\n')) {
						console.log(uri);
					}
					//logger.debug('----------------------------------------------------')
					return resolve();
				},
				function (error) {
					console.log(JSON.stringify(error));
					return reject(error);
				}
			);
	})


};

module.exports = mlutils;