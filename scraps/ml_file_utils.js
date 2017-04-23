var fs = require('fs');
var marklogic = require('marklogic');
var my = require('./my-connection.js');
var n3 = require('n3');
var logger = require('winston');


var db = marklogic.createDatabaseClient(my.connInfo);


function file_to_marklogic(abs_path_to_file, graph_name) {
	return new Promise(function(resolve,reject) {
		var streamParser = new n3.StreamParser();
		var inputStream = fs.createReadStream(abs_path_to_file);
		var streamWriter = new n3.StreamWriter({ prefixes: { hwcv_data: 'http://metadata.healthwise.org/concept/concept_data#' } });
		inputStream.pipe(streamParser);
		streamParser.pipe(streamWriter);

		var writer =
			db.graphs.createWriteStream(graph_name, 'text/turtle');

		streamWriter.pipe(writer);

		writer.result(
			function(response) {
				return resolve(response);
			},
			function(error) {
				return reject(error)
			}
		);
	})
}

