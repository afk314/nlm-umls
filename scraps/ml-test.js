var fs = require('fs');
var marklogic = require('marklogic');
var my = require('../marklogic/my-connection.js');
var N3 = require('n3');

var db = marklogic.createDatabaseClient(my.connInfo);

// var streamParser = N3.StreamParser();
// var file_reader = fs.createReadStream('/Users/akimball/dev/52workspace/concept.data/HW_Concept.ttl');
// file_reader.pipe(streamParser);
// streamParser.pipe(new SlowConsumer());


var streamParser = new N3.StreamParser();
var inputStream = fs.createReadStream('/Users/akimball/dev/52workspace/concept.data/HW_Content_Asset.ttl');
var streamWriter = new N3.StreamWriter( );


inputStream.pipe(streamParser);
streamParser.pipe(streamWriter);

db.graphs.merge('mygraph', 'text/turtle', streamWriter).result(
	function(response) {
		if (response.defaultGraph) {
			console.log('Loaded into default graph');
		} else {
			console.log('Loaded into graph ' + response.graph);
		};
	},
	function(error) { console.log(JSON.stringify(error)); }
);

function SlowConsumer() {
	var writer = new require('stream').Writable({ objectMode: true });

	writer._write = function (triple, encoding, done) {

		db.graphs.write('text/turtle', triple).result(
			function(response) {
				if (response.defaultGraph) {
					console.log('Loaded into default graph');
				} else {
					console.log('Loaded into graph ' + response.graph);
				};
			},
			function(error) { console.log(JSON.stringify(error)); }
		);
	};
	return writer;
}


