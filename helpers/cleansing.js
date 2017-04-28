var constants = require('../rdf/constants');

function replace_all(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}

module.exports.transform_row = function(row) {

	if (row.LAT = 'ENG') {
		row.LAT = 'en';
	} else if (row.LAT = 'FRE') {
		row.LAT = "fr";
	} else if (row.LAT = 'SPA') {
		row.LAT = "es";
	}



	row.CODE = replace_all(row.CODE, " ", "_");
	row.CODE = replace_all(row.CODE, '"', "'");
	row.CODE = replace_all(row.CODE, ';', "_");
	row.CODE = replace_all(row.CODE, '>', "&gt;");
	row.CODE = replace_all(row.CODE, '<', "&lt;");

	row.CUI = constants.resources.Cui + row.CUI;
	row.AUI = constants.resources.Aui + row.AUI;
	row.LUI = constants.resources.Lui + row.LUI;
	row.SUI = constants.resources.Sui + row.SUI;
	row.STR = '"'+row.STR+'"@'+row.LAT;
	row.CODE = uutils.get_uri_for_code(row.SAB, row.CODE);
	return row;
}