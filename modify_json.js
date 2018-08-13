var genki_kanji = ["一","七","万","三","上","下","不","世","両","中","主","乗","九","事","二","五","京","人","今","仕","代","以","休","会","住","体","何","作","使","供","信","借","働","元","兄","先","入","全","八","六","内","円","写","冬","出","分","切","初","別","前","力","勉","動","化","北","医","十","千","午","半","卒","南","去","友","口","古","台","右","同","名","味","品","員","問","四","回","図","国","土","地","堂","場","声","売","変","夏","夕","外","多","夜","大","天","女","好","妹","姉","始","婚","子","字","学","守","安","室","家","宿","寺","対","小","少","屋","山","川","工","左","市","帰","年","幸","広","店","度","建","弟","強","当","彼","待","後","心","忘","怒","思","急","悪","悲","情","意","感","所","手","払","持","授","教","文","料","新","方","旅","族","日","早","明","昔","映","春","昼","時","曜","書","最","月","有","服","朝","木","末","本","来","東","枚","果","査","校","案","業","楽","様","横","次","歌","止","正","歩","歳","死","残","母","毎","比","気","水","注","洋","活","海","港","漢","火","無","父","牛","物","特","犬","理","生","用","田","男","町","画","界","留","番","病","痛","発","白","百","的","皿","目","相","真","着","知","研","社","神","私","秋","究","空","立","笑","答","紙","終","経","結","絶","続","習","考","者","聞","肉","自","色","花","若","英","茶","行","表","西","見","親","言","計","記","試","話","語","説","読","調","買","貸","質","赤","走","起","足","車","転","近","送","通","連","週","遅","運","道","違","部","配","重","野","金","銀","長","開","間","院","集","雨","雪","電","青","音","題","顔","風","食","飯","飲","館","駅","験","高","魚","鳥","黒","々"];
//later could change genki_kanji to a json object that includes link to kanji page
var myList=[];
function getJLPTKanji(){
	for (var i = 0; i < myList.length; i++) {
		let kanj_str=myList[i]["Kanji"];
		//delete myList[i]["Play Audio"];
		myList[i]["Genki Kanji"]=[];
		if (typeof kanj_str === 'undefined' || kanj_str === null) {
		// variable is undefined or null
		//myList[i]["Audio Clip"]=myList[i]["Audio Clip"]=createAudioPlayer(myList[i]["Vocab"],"");
		}
		else{
			let regexp = /[\u4e00-\u9faf]/g;
			let matches_array = kanj_str.match(regexp);
			if(typeof matches_array !== 'undefined' && matches_array !== null){
				let jlpt_array=[];
				for(var j=0;j<matches_array.length; j++){
					if(genki_kanji.indexOf(matches_array[j])>=0){	//may need to change this later if changing genki_kanji to an object list
						jlpt_array.push(matches_array[j]);//jlpt_array.push("<a href='https://jisho.org/search/"+matches_array[j]+"%23kanji'>"+matches_array[j]+"</a>");
					}
				}
				if(jlpt_array.length>=matches_array.length)
					myList[i]["Info"]["Genki Kanji Level"]=2;
				else if(jlpt_array.length>0)
					myList[i]["Info"]["Genki Kanji Level"]=1;
				else
					myList[i]["Info"]["Genki Kanji Level"]=0;
				myList[i]["Genki Kanji"]=jlpt_array;
				//myList[i]["Audio Clip"]=createAudioPlayer(myList[i]["Vocab"],kanj_str);
			}
		}
	}
}

function infoToCols(){
	for (var i = 0; i < myList.length; i++) {
		myList[i]["Genki Kanji Level"]=myList[i]["Info"]["Genki Kanji Level"];
		myList[i]["ID"]=myList[i]["Info"]["ID"];
		myList[i]["Play Audio"]=myList[i]["Info"]["Play Audio"];
	
		delete myList[i]["Info"]["Genki Kanji Level"];
		delete myList[i]["Info"]["ID"];
		delete myList[i]["Info"]["Play Audio"];
		delete myList[i]["Info"];
	}
}


// Builds the HTML Table out of tableList.
function buildHtmlTable(tableList,selector) {
  var columns = addAllColumnHeaders(tableList, selector);

  for (var i = 0; i < tableList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
	  var cellValue=tableList[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
	  if(colIndex!=5&&colIndex!=9){//don't add input for 'Audio' or 'Genki Kanji', they already have html
		let inptId=i+"-"+columns[colIndex];
		let inputObjt = $('<input/>').attr({ type: 'text', value: cellValue, id:inptId});
		$(inputObjt).change(function(e){
			let rowCol = this.id.split("-");
			updateList(rowCol[0],rowCol[1],this.value);
		});
		row$.append($('<td/>').append(inputObjt));
	  }
	  else{
		row$.append($('<td/>').html(cellValue));
	  }
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

function updateJSONList(){
	for(var i=0;i<myList.length;i++){
		if (typeof myList[i]["Kanji"] === 'undefined' || myList[i]["Kanji"] === null) {
			let x=1;
		}
		else{
			/*for(var j=0;j<myList[i]["Genki Kanji"].length;j++){
				let kanj_str=myList[i]["Genki Kanji"][j];
				if (typeof kanj_str === 'undefined' || kanj_str === null) {
					let x=1;
				}
				else{
					myList[i]["Genki Kanji"][j]="<a href='https://jisho.org/search/"+kanj_str+"%23kanji'>"+kanj_str+"</a>";
				}
			}*/
			myList[i]["Audio"]="<button onclick='playAudioClip(\""+myList[i].Vocab+"\",\""+myList[i].Kanji+"\")'>Play</button>";
		}
	}
}

function playAudioClip(kana,kanji){
	createAudioPlayer(kana,kanji);
	$('#flashaudio').autoplay = true;
	$('#flashaudio').controls=true;
	 $('#flashaudio')[0].play();
}

function convertToJSON(){
	//make updates before final JSON
	for (var i = 0; i < myList.length; i++) {
		if(myList[i]["ID"]=="d"){
			myList.splice(i,1);
			i--;
			continue;
		}
		myList[i]["Info"]=new Object();
		myList[i]["Info"]["Genki Kanji Level"]=myList[i]["Genki Kanji Level"];
		myList[i]["Info"]["ID"]=myList[i]["ID"];
		myList[i]["Info"]["Play Audio"]=myList[i]["Play Audio"];
	
		delete myList[i]["Genki Kanji Level"];
		delete myList[i]["ID"];
		delete myList[i]["Play Audio"];
		delete myList[i]["Audio"];
	}
	
	let myJSON = JSON.stringify(myList, null, '\n');
	document.getElementById("output").innerHTML = myJSON;
}

function updateList(row,col,val){
	myList[row][col]=val;
}

function modifyJson(){
	/*for (var i = 0; i < myList.length; i++) {
		myList[i]["ID"]=i;
		//delete myList[i]["Kanji, Katakana, or Hiragana"];
	}*/
	getJLPTKanji(myList);
	//changeInfoParam(myList);
	infoToCols(myList);
	myList = myList.slice();
	updateJSONList(myList);
	buildHtmlTable(myList,'#outputTable');
	/*let myJSON = JSON.stringify(myList, null, '\n');
	document.getElementById("output").innerHTML = myJSON;*/
}

$.getJSON("jlpt_dictionary.json", function(json) {
    myList = json;//console.log(json); // this will show the info it in firebug console
	modifyJson();
});