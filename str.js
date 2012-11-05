String.prototype.CSV = function(strDelimiter) {
	//I wouldn't extend a prototype in a browser but
	// in a short-lived build script it's harmless

	//via http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
     strDelimiter = (strDelimiter || ",");
     var objPattern = new RegExp(
     (
     "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
     "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
     "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
     var arrData = [
         []
     ];
     var arrMatches = null;
     while (arrMatches = objPattern.exec(this)) {
         var strMatchedDelimiter = arrMatches[1];
         if(strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
             arrData.push([]);
         }
         if (arrMatches[2]) {
             var strMatchedValue = arrMatches[2].replace(
             new RegExp("\"\"", "g"), "\"");
         } else {
             var strMatchedValue = arrMatches[3];
         }
         if(strMatchedValue.length !== 0){
         	arrData[arrData.length - 1].push(strMatchedValue);
         } else {
         	//process.stdout.write("There was an empty row\n");
         }
     }

     //process.stdout.write(JSON.stringify(arrData) + "\n\n\n");
     if(arrData[arrData.length - 1].length === 0 ) {
     	arrData[arrData.length - 1].pop();
     }
     //process.stdout.write(JSON.stringify(arrData) + "\n\n\n");
     return (arrData);
}

String.prototype.CSVMap = function(strDelimiter) {
	//I wouldn't extend a prototype in a browser but
	// in a short-lived build script it's harmless
	
 	//presumes that first line is are the keys
 	var csv_array = this.CSV(strDelimiter),
 		first_row = csv_array[0],
 		keyed_map = [],
 		keyed_row,
 		row;
 	for(var i = 1; i < csv_array.length; i++){ //start from row 1 not 0
 		row = csv_array[i];
 		keyed_row = {}
 		for(var x = 0; x < row.length; x++){
			keyed_row[first_row[x]] = row[x];
 		}
 		keyed_map.push(keyed_row);
 	}
 	return keyed_map;
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};