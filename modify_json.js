function modifyJson(myList){
	for (var i = 0; i < myList.length; i++) {
		myList[i]["ID"]=i;
		//delete myList[i]["Kanji, Katakana, or Hiragana"];
	}
	var myJSON = JSON.stringify(myList);
	document.getElementById("output").innerHTML = myJSON;
}

$.getJSON("jlpt_dictionary.json", function(json) {
    let myList = json;//console.log(json); // this will show the info it in firebug console
	modifyJson(myList);
});