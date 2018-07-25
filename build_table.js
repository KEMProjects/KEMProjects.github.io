
// Builds the HTML Table out of tableList.
function buildHtmlTable(tableList,selector) {
  var columns = addAllColumnHeaders(tableList, selector);

  for (var i = 0; i < tableList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = tableList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
    }
	//row$.append($('<button/>'.attr("id","save").text("Save");
    $(selector).append(row$);
  }

}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(tableList, selector) {
  var columnSet = [];
  var headerTr$ = $('<thead/>');//$('<tr/>');

  for (var i = 0; i < tableList.length; i++) {
    var rowHash = tableList[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);

  return columnSet;
}

function clearTable(selector){
	$(selector+" tr").remove();
	$(selector+" thead").remove();
}