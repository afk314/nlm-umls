var logger = require('winston');
var mlutils = require('./marklogic-utils');
var n3 = require('n3');


var streams = {};

streams.stream_handler = {

	in_use_writers: {},

	get_writer: function(graph_name) {
		if (Object.keys(this.in_use_writers).includes(graph_name)) {
			//logger.debug('Returning previously used writer')
			return this.in_use_writers[graph_name]['n3'];
		} else {
			var mwriter = new require('stream').Writable({ objectMode: true });
			mlutils.merge_data(graph_name, "text/turtle", mwriter);
			//var mwriter = mlutils.get_write_stream(graph_name,"text/turtle");
			//var n3writer = n3.Writer(mwriter, { format: "text/turtle" });
			var n3writer = n3.Writer(mwriter, { format: "text/turtle" });

			this.in_use_writers[graph_name] = {};
			this.in_use_writers[graph_name]['n3'] = n3writer;
			this.in_use_writers[graph_name]['ml'] = mwriter;
			//logger.debug('Created loggers and cached them');
			return n3writer;
		}
	},
	close_all_writers: function() {
		var writers = Object.keys(this.in_use_writers);
		for (var i = 0; i < writers.length; i++) {
			var graph_name = writers[i];
			var writer_obj = this.in_use_writers[graph_name];
			try {
				writer_obj['n3'].end();
				writer_obj['ml'].end();
			} catch (err) {
				//logger.error('Failed closing..',err)
			}
			streams.in_use_writers = {};

			//logger.debug('Closed writer for graph: '+writers[i]);
		}
	}
};

module.exports = streams;