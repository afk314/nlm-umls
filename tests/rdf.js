var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var uutils = require('../rdf/uri_utils');




describe('rdf-utils', function() {
	before(function () {
		// no impl for now
	});

	it('#sabs', function (done) {
		expect(uutils.is_valid_sab("snomedct_us")).to.be.false;
		expect(uutils.is_valid_sab("SNOMEDCT_US")).to.be.true;
		expect(uutils.is_valid_sab("ICD9CM")).to.be.true;
		expect(uutils.is_valid_sab("ICD9XX")).to.be.false;
		expect(uutils.get_base_uri('ICD10CM')).to.equal('http://metadata.healthwise.org/umls/icd10cm_data');
		expect(uutils.get_uri_for_code('ICD10CM', 'E11.1')).to.equal('http://metadata.healthwise.org/umls/icd10cm_data#E11.1');
		expect(uutils.get_base_uri('SNOMEDCT_US')).to.equal('http://metadata.healthwise.org/umls/snomedct_us_data');
		done();
	});

});