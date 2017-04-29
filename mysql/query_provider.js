

var queries = {};
module.exports = queries;

var mrconso_query =  "SELECT * FROM MRCONSO mrcon where  \n" +

	"      (mrcon.SAB='MSH' OR mrcon.SAB='ICD9CM' OR mrcon.SAB='ICD10CM' OR mrcon.SAB='SNOMEDCT_US' OR mrcon.SAB='CHV' OR \n" +
	"         mrcon.SAB='LNC' OR mrcon.SAB='CPT' OR mrcon.SAB='ICD10PCS' OR mrcon.SAB='MEDLINEPLUS' OR mrcon.SAB='MSH' OR \n" +
	"         mrcon.SAB='NCI' OR mrcon.SAB='RXNORM'\n" +
	"      ) ORDER BY AUI,SUI LIMIT %OFFSET%,%LIMIT%";

var mrrel_query = "SELECT * FROM MRREL WHERE  " +
	" (SAB='MSH' OR SAB='ICD9CM' OR SAB='ICD10CM' OR SAB='SNOMEDCT_US' OR SAB='CHV' OR " +
	" SAB='LNC' OR SAB='CPT' OR SAB='ICD10PCS' OR SAB='MEDLINEPLUS' OR SAB='MSH' OR " +
	" SAB='NCI' OR SAB='RXNORM') LIMIT %OFFSET%,%LIMIT%";


queries.get_mrconso_query = function (offset, limit) {
	return mrconso_query.replace('%OFFSET%', offset).replace('%LIMIT%', limit);
};

queries.get_mrrel_query = function(offset, limit) {
	return mrrel_query
};
