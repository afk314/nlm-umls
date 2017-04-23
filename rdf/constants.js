var rdfconst = {};


rdfconst.basename_graph = 'http://akimball.org/graphs/umls#';

rdfconst.namespaces = {
	UMLS_BASE_DATA: 'http://akimball.org/umls/data',
	UMLS_SCHEMA: 'http://akimball.org/umls/schema#',
	RDF: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	RDFS: 'http://www.w3.org/2000/01/rdf-schema#',
	SKOS: 'http://www.w3.org/2004/02/skos/core#',
	DCT: 'http://purl.org/dc/terms/'
};

rdfconst.resources = {
	Aui: rdfconst.namespaces.UMLS_BASE_DATA+'/aui#',
	Cui: rdfconst.namespaces.UMLS_BASE_DATA+'/cui#',
	Lui: rdfconst.namespaces.UMLS_BASE_DATA+'/lui#',
	Sui: rdfconst.namespaces.UMLS_BASE_DATA+'/sui#',
	Sab: rdfconst.namespaces.UMLS_BASE_DATA+'/sab#',
}


rdfconst.classes = {
	CUI: rdfconst.namespaces.UMLS_SCHEMA + "CuiConcept",
	LUI: rdfconst.namespaces.UMLS_SCHEMA + "LuiConcept",
	SUI: rdfconst.namespaces.UMLS_SCHEMA + "SuiConcept",
	AUI: rdfconst.namespaces.UMLS_SCHEMA + "AuiConcept",
	SAB: rdfconst.namespaces.UMLS_SCHEMA + "SabConcept",

};

rdfconst.properties = {
	// my terminologies
	belongsTo: rdfconst.namespaces.UMLS_SCHEMA + "belongsTo",
	hasAui: rdfconst.namespaces.UMLS_SCHEMA + "hasAui",
	hasSui: rdfconst.namespaces.UMLS_SCHEMA + "hasSui",
	hasPreferredLui: rdfconst.namespaces.UMLS_SCHEMA + "hasPreferredLui",
	hasNonPreferredLui: rdfconst.namespaces.UMLS_SCHEMA + "hasNonPreferredLui",
	hasSuppressiblePreferredLui: rdfconst.namespaces.UMLS_SCHEMA + "hasSuppressiblePreferredLui",
	hasSuppressibleNonPreferredLui: rdfconst.namespaces.UMLS_SCHEMA + "hasSuppressibleNonPreferredLui",
	hasTermStatus: rdfconst.namespaces.UMLS_SCHEMA + "hasTermStatus",
	hasSource: rdfconst.namespaces.UMLS_SCHEMA + "hasSourceVocabulary",
	hasLanguage: rdfconst.namespaces.UMLS_SCHEMA + "hasLanguage",
	hasCode: rdfconst.namespaces.UMLS_SCHEMA + "hasCode",
	hasStringType: rdfconst.namespaces.UMLS_SCHEMA + "hasStringType",

	// Other terminologies
	rdfType: rdfconst.namespaces.RDF + "type",
	skosPrefLabel: rdfconst.namespaces.SKOS + "prefLabel",
	skosAltLabel: rdfconst.namespaces.SKOS + "altLabel"
};

rdfconst.graphs = {
	Sab: rdfconst.basename_graph+'sab',
	//Aui: rdfconst.basename_graph+'Aui',
	Cui: rdfconst.basename_graph+'cui',
	Lui: rdfconst.basename_graph+'lui',
	Sui: rdfconst.basename_graph+'sui',
}

module.exports = rdfconst;