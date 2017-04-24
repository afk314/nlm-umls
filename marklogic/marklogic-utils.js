var marklogic = require('marklogic');
var my = require('./my-connection.js');

var db, config, mlutils;

var mlutils = {};

mlutils.init = function(configuration) {
	config = configuration;
	db = marklogic.createDatabaseClient(my.connInfo);
};

mlutils.get_db = function() {
	return db;
};


mlutils.get_write_stream = function(graph, mimetype) {
	return db.graphs.createWriteStream(graph, mimetype);
};

mlutils.merge_data = function(graph, mimetype, writer) {
	db.graphs.merge(graph,mimetype,writer);
}

mlutils.list_graphs = function() {
	db.graphs.list('text/uri-list')
		.result(
			function (response) {
				for (var uri of response.split('\n')) {
					console.log(uri);
				}
			},
			function (error) {
				console.log(JSON.stringify(error));
			}
		);
}

module.exports = mlutils;