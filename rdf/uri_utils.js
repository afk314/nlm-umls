var constants = require('./constants');

uutils = {};

var sabs = {
	MSH: {
		data_name: 'msh_data',
		enabled: true
	},
	ICD9CM: {
		data_name: 'icd9cm_data',
		enabled: true
	},
	ICD10CM: {
		data_name: 'icd10cm_data',
		enabled: true
	},
	SNOMEDCT_US: {
		data_name: 'snomedct_us_data',
		enabled: true
	},
	CHV: {
		data_name: 'chv_data',
		enabled: true
	},
	LNC: {
		data_name: 'lnc_data',
		enabled: true
	},
	CPT: {
		data_name: 'cpt_data',
		enabled: true
	},
	ICD10PCS: {
		data_name: 'icd10pcs',
		enabled: false
	},
	MEDLINEPLUS: {
		data_name: 'medlineplus_data',
		enabled: true
	},
	NCI: {
		data_name: 'nci_data',
		enabled: true
	},
	RXNORM: {
		data_name: 'rxnorm_data',
		enabled: true
	}
};

uutils.graph_for_sab = function(sab) {
	if (uutils.is_valid_sab(sab)) {
		var ext = sabs[sab].data_name;
		return constants.basename_graph+ext;
	}
}

uutils.get_lui_relationship = function(termstatus) {
	if (termstatus === 'P') {
		return constants.properties.hasPreferredLui;
	} else if (termstatus === 'S') {
		return constants.properties.hasNonPreferredLui;
	} else if (termstatus === 'p') {
		return constants.properties.hasSuppressiblePreferredLui;
	} else if (termstatus === 's') {
		return constants.properties.hasSuppressibleNonPreferredLui;
	} else {
		logger.error('Dunno this term status: '+termstatus);
		return constants.properties.hasNonPreferredLui;
	}
}

uutils.get_base_uri = function(sab) {
	return "http://akimball.org/umls/"+uutils.uri_name_for(sab)
};

uutils.get_uri_for_aui = function(sab, aui) {
	return uutils.get_base_uri(sab)+'#'+aui;
};

uutils.get_uri_for_code = function(sab, code) {
	return uutils.get_base_uri(sab)+'#'+code;
};

uutils.uri_name_for = function(sab) {
	if (sabs.hasOwnProperty(sab)) {
		return sabs[sab].data_name;
	} else {
		throw new Error('Dunno this SAB: '+sab);
	}
};

uutils.is_valid_sab = function(sab) {
	if (sabs.hasOwnProperty(sab)) {
		return true;
	} else {
		return false;
	}
};

module.exports = uutils;

