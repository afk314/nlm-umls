var fs = require('fs');
var marklogic = require('marklogic');
var my = require('../marklogic/my-connection.js');
var N3 = require('n3');

var db = marklogic.createDatabaseClient(my.connInfo);


var writer = N3.Writer({ format: 'test/turtle' });
// var streamParser = N3.StreamParser();
// writer.pipe(streamParser);
// streamParser.pipe(MlConsumer);

// function MlConsumer() {
// 	var writer = new require('stream').Writable({ objectMode: true });
// 	writer._write = function (triple, encoding, done) {
// 		db.graphs.merge('mygraph', 'text/turtle', triple)
// 			.result(function(response) {
// 				console.log('Marklogic: Got it!');
// 			}
//
// 		)};
// 	return writer;
// }



// db.graphs.merge('mygraph', 'text/turtle', writer).result(
// 	function(response) {
// 		if (response.defaultGraph) {
// 			console.log('Loaded into default graph');
// 		} else {
// 			console.log('Loaded into graph ' + response.graph);
// 		};
// 	},
// 	function(error) { console.log(JSON.stringify(error)); }
// );

writer.addTriple('http://example.org/cartoons#Tom',
	'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
	'http://example.org/cartoons#Cat');
writer.addTriple({
	subject:   'http://example.org/cartoons#Tom',
	predicate: 'http://example.org/cartoons#name',
	object:    '"Tom"'
});

writer.end(function (error, result) {
	db.graphs.merge('mygraph', 'text/turtle', result).result(
		function(response) {
			if (response.defaultGraph) {
				console.log('Loaded into default graph');
			} else {
				console.log('Loaded into graph ' + response.graph);
			};
		},
		function(error) { console.log(JSON.stringify(error)); }
	);
	console.log(result);
});


// var streamParser = new N3.StreamParser();
// var inputStream = fs.createReadStream('/Users/akimball/dev/52workspace/concept.data/HW_Content_Asset.ttl');
// var streamWriter = new N3.StreamWriter( );
//
//
// inputStream.pipe(streamParser);
// streamParser.pipe(streamWriter);
//
// db.graphs.merge('mygraph', 'text/turtle', streamWriter).result(
// 	function(response) {
// 		if (response.defaultGraph) {
// 			console.log('Loaded into default graph');
// 		} else {
// 			console.log('Loaded into graph ' + response.graph);
// 		};
// 	},
// 	function(error) { console.log(JSON.stringify(error)); }
// );

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


