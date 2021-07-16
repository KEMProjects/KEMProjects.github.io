//var quizList=[];
//var quizIndex=-1;
//var answerList=[];
var score=0;
function fisher_yates_shuffle(arr) {
	let x = arr.length;
	let temp, rand;

  // While there remain elements to shuffle…
  while (x) {

    // Pick a remaining element…
    rand = Math.floor(Math.random() * x);
	x--;
    // And swap it with the current element.
    temp = arr[x];
    arr[x] = arr[rand];
    arr[rand] = temp;
  }

  return arr;
}
function buildQuizList(){
	level = parseInt($('#level_select').find(":selected").val());
	flashCards=[];
	current_card=-1;
	total_cards=0;	
	
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
	
	flashCards=fisher_yates_shuffle(flashCards);
	
	total_cards=flashCards.length;
	nextCard();
}
function buildAnswers(){	
	let numAnswers=4;
	let tempList = myList.slice();
	let answerList=[];
	answerList.push(flashCards[current_card]);
	tempList.splice(myList.findIndex(x => x.ID==flashCards[current_card]["Info"]["ID"]), 1);
	tempList=fisher_yates_shuffle(tempList);
	for(var i=0;i<numAnswers-1;i++){
		//let rand =Math.floor((Math.random() * tempList.length));
		answerList.push(tempList[i]);
		//tempList.splice(rand, 1);
	}
	answerList=fisher_yates_shuffle(answerList);
	for(var i=0;i<numAnswers;i++){
		let ansrButton='#'+(i+1);
		$(ansrButton).text(answerList[i]["English"]);
	}
}

function addEndCard(){
	endCard="<h3>Final Score</h3><h4>"+score+" out of "+total_cards+"</h4>";
}

function buildQuiz(){
	//flashCards[current_card]["Vocab"]
	score=0;
	buildQuizList();
	buildAnswers();
	//addEndCard();
	$('#answrButtons').show();
}

function chooseAnswer(answrNum){
	let answer=flashCards[current_card]["English"];
	let check=$('#'+answrNum).text();
	if(answer.localeCompare(check)==0){//correct
		nextCard();
		buildAnswers();
		score++;
		$('#incorrect').hide();
		
	}
	else{
		$('#incorrect').show();
		//$('#answrButtons').hide();
	}
}