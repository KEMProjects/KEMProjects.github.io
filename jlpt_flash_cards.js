var flashCards = [];
var level=0;
var current_card=-1;
var total_cards=0;
var face=1;
var saveList=[];
function cardFaceClick(){
	if(face==1)
		flipCard();
	else
		nextCard();
}
function enableFurigana(){
	if(face==1){
		face=-1;
		flipCard();
	}
		
}
function changeCard(){
	face=-1;
	$('#fc_cnt').html(current_card+1 + " out of " + total_cards);
	let audioLink=createAudioPlayer(flashCards[current_card]["Vocab"], flashCards[current_card]["Kanji"]);
	//$('#flashaudio').attr("src", audioLink);
	let id=flashCards[current_card]["Info"]["ID"];
	if(flashCards[current_card]["Info"]["Play Audio"]==false)
		$('#audio_cont').prop('disabled', true);
	else 
		$('#audio_cont').prop('disabled', false);
	changeSaveButton(id);
	flipCard();
}
function lastCard(){
	if(current_card>0){
		current_card--;
		changeCard();
	}
}
function nextCard(){
	if(current_card<total_cards){
		current_card++;
		changeCard();
	}
}

function flipCard(){
	var cardText="";
	face *=-1;
	if(face==1){
		cardText = "<ruby>"+flashCards[current_card]["Kanji"];
		if($('#furigana_en').is(':checked')||flashCards[current_card]["Info"]["Genki Kanji Level"]<2)
			cardText +="<rt>"+flashCards[current_card]["Vocab"]+"</rt>";
		
		cardText+="</ruby>";
		if ($('#autoplay').is(':checked')&&flashCards[current_card]["Info"]["Play Audio"]==true) {
			togglePlay();
		}
		/*else{
			$('#flashaudio').autoplay = false;
		}*/
	}
	else{
		cardText = flashCards[current_card]["English"];
	}
	$('#fc_text').html(cardText);
}

function changeSaveButton(id){
	if(findSavedCard(id)>-1){
		$('#save').text("Remove Card");
		$("#save").attr("onclick","removeSavedCard("+id+")");
	}
	else{
		$('#save').text("Save Card");
		$("#save").attr("onclick","saveCard("+id+")");
	}
	
}

function saveCard(id){
	if(id!=null){
		let index= findSavedCard(id);
		if(index<0){
			saveList.push(id);
			setCookie("saveList", saveList, 15);
			$('#save').text("Saved");
		}
	}
}
function findSavedCard(id){
	let found =  saveList.indexOf(id.toString());
	return found;
}
function removeSavedCard(id){
	let index= findSavedCard(id);
	saveList.splice(index,1);
	setCookie("saveList", saveList, 15);
}
function clearSaveList(){
	setCookie("saveList", [], 15);
}
function buildCards(){
	level = parseInt($('#level_select').find(":selected").val());
	flashCards=[];
	current_card=-1;
	total_cards=0;
	saveList=getCookie("saveList");
	if(level==25){
		for (var i = 0; i < saveList.length; i++) {
			flashCards.push(myList[saveList[i]]);
		}
	}
	else{
		for (var i = 0; i < myList.length; i++) {
			//let kanj_str=myList[i]["Kanji"];
			if(myList[i]["Lesson"]==level){
				flashCards.push(myList[i]);
			}
		}
	}
	total_cards=flashCards.length;
	nextCard();
}

function build_levels(){
	//change this later if you want it to be dynamic
	for(let i=1;i<24;i++){
		let option = "<option value='"+i+"'>"+i+"</option>";
		$('#level_select').append(option);
	}
	let option = "<option value='25'>Custom</option>";
	$('#level_select').append(option);
	saveList=new Array();
	//deleteCookie("saveList");//debug
	saveList=getCookie("saveList");
}

$.getJSON("jlpt_dictionary.json", function(json) {
    myList = json;//console.log(json); // this will show the info it in firebug console
	build_levels();
	/*var myJSON = JSON.stringify(myList);
	document.getElementById("json_print").innerHTML = myJSON;*/
});
