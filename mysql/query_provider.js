


var query = "SELECT * FROM MRCONSO mrcon where  \n" +

	"      (mrcon.SAB='MSH' OR mrcon.SAB='ICD9CM' OR mrcon.SAB='ICD10CM' OR mrcon.SAB='SNOMEDCT_US' OR mrcon.SAB='CHV' OR \n" +
	"         mrcon.SAB='LNC' OR mrcon.SAB='CPT' OR mrcon.SAB='ICD10PCS' OR mrcon.SAB='MEDLINEPLUS' OR mrcon.SAB='MSH' OR \n" +
	"         mrcon.SAB='NCI' OR mrcon.SAB='RXNORM'\n" +
	"      ) ORDER BY AUI,SUI LIMIT %OFFSET%,%LIMIT%";


module.exports.get_query = function (offset, limit) {
	return query.replace('%OFFSET%', offset).replace('%LIMIT%', limit);
}
