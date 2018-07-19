var flashCards = [];
var level=0;
var current_card=-1;
var total_cards=0;
var face=1;
function nextCard(){
	current_card++;
	face=-1;
	flipCard();
	$('#fc_cnt').html(current_card+1 + " out of " + total_cards);
	let audioLink=createAudioPlayer(flashCards[current_card]["Vocab"], flashCards[current_card]["Kanji"]);
	//$('#flashaudio').attr("src", audioLink);
	
	var newAudio=$(audioLink);
	$("#flashaudio").replaceWith(newAudio);
    // Load src of the audio file
    $("#flashaudio").load();
}

function flipCard(){
	var cardText="";
	face *=-1;
	if(face==1){
		cardText = "<p class='furigana'>"+flashCards[current_card]["Vocab"]+"</p><p>"+flashCards[current_card]["Kanji"]+"</p>";
	}
	else{
		cardText = flashCards[current_card]["English"];
	}
	$('#flashcards').html(cardText);
}

function build_cards(){
	level = parseInt($('#level_select').find(":selected").text());
	flashCards=[];
	current_card=-1;
	total_cards=0;
	for (var i = 0; i < myList.length; i++) {
		let kanj_str=myList[i]["Kanji"];
		if(myList[i]["Lesson"]==level){
			flashCards.push(myList[i]);
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
	
}

$.getJSON("jlpt_dictionary.json", function(json) {
    myList = json;//console.log(json); // this will show the info it in firebug console
	build_levels();
	/*var myJSON = JSON.stringify(myList);
	document.getElementById("json_print").innerHTML = myJSON;*/
});