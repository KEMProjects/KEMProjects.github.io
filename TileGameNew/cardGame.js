var vocabSource;//="data/visualVocab.json";
var imgSource="media/";
var audioSource="media/"
var wordDefine={
    Vocab: "Simplified"
};

var gameDisplay;
var currentWordDisplay;
var scoreDisplay;
var vocab;  //defined by each game
var masterVocab; //all available vocab
var gameData; //defined by each game

$( document ).ready(function() {
    gameDisplay=$("#cardGameContent");
    currentWordDisplay=$("#currWord");
    scoreDisplay=$("#score");
});

function loadVocab(sourceName){
    vocabSource="data/"+sourceName;
    $.getJSON( vocabSource, function( data ) {
        vocab=data;
        masterVocab=data;
        genTopicDropDown();
        genLessonDropDown();
    });
}
/**
 * Remove duplicate words
 * @param {*} arr 
 * @returns 
 */
function removeDuplicates(arr) {
    let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
    // JS by default uses a crappy string compare.
    // (we use slice to clone the array so the
    // original array won't be modified)
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1][wordDefine.Vocab] != sorted_arr[i][wordDefine.Vocab]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  }
/**
 * Fisher yates shuffle
 * @param {*} arr 
 * @returns 
 */
function genRandList(arr) {
    arr=removeDuplicates(arr);
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
/**
 * Display cards in gameDisplay div
 * @param {*} cards 
 */
function displayCards(cards){
    gameDisplay.empty();
    let maxPerRow=3;
    var row=$('<div class="w3-row-padding w3-margin-top">');//w3-cell-row 
    for(let i=0;i<cards.length;i++){
        if(i%maxPerRow==0&&i!=0){
            gameDisplay.append(row);
            row=$('<div class="w3-row-padding w3-margin-top">');
        }
        let cardWrapper=$('<div class="w3-third">');//$('<div class="w3-third w3-cell-middle">');
        let card=cards[i];
        card.addClass("w3-cell-middle w3-card w3-container");
        cardWrapper.append(card);
        //card.addClass("w3-third");//w3-cell w3-container
        row.append(cardWrapper);
    }
    if(row.children().length>0){
        gameDisplay.append(row);
    }
}
function displayDisabledCard(word){
    $("#"+word).addClass("w3-opacity-max w3-grayscale-max disabled");
    $("#"+word).children().attr('disabled','disabled');
}
function displayError(gameDisplay,errorMsg){
    gameDisplay.empty();
    gameDisplay.append($("<p>Error:"+errorMsg+"</p>"));
}
function displayGameOver(){
    gameDisplay.empty();
    gameDisplay.append($("<h1>Game Over!</h1>"));
    currentWordDisplay.empty();
}
function displayCurrWord(word){
    currentWordDisplay.text(word);
}
function displayScore(score){
    scoreDisplay.text(score);
}
function loadAudio(audioURL){
    var audio = $("#audioPlayer");      
    $("#mp3Source").attr("src", audioSource+audioURL);
    /****************/
    audio[0].pause();
    audio[0].load();//suspends and restores all audio element

    //audio[0].play(); changed based on Sprachprofi's comment below
    audio[0].oncanplaythrough = audio[0].play();
}
function getRandomWord(vocabList){
    return vocabList[Math.floor(Math.random()*vocabList.length)];
}
function genTopicDropDown(){
    var topicList=[];
    masterVocab.forEach((word)=>{
        if(jQuery.inArray(word.Topic,topicList)<0){
            topicList.push(word.Topic);
            let option = "<option value='"+word.Topic+"'>"+word.Topic+"</option>";
		    $('#topicSelector').append(option);
        }
    });
}
function changeTopic(){
    let topic=$('#topicSelector').find(":selected")[0].value();
    if(topic=="0"){
        vocab=masterVocab;
    }
    else{
        var tempVocab=[];
        masterVocab.forEach((word)=>{
           if(word.Topic==topic){
               tempVocab.push(word);
           }
        });
        vocab=tempVocab;
    }
}
function genLessonDropDown(){
    let lessonData={};
    masterVocab.forEach((word)=>{
        let lessonName=word.Lesson.split("-")[1];
        if(lessonData[lessonName]==null){            
            lessonData[lessonName]=1;
        }
        else{
            lessonData[lessonName]+=1;
        }
    });

    let accumCount=0;
    let firstLesson=0;
    let lastLesson=0;
    $.each( lessonData, function( lesson, count ){
        accumCount+=count;
        if(accumCount>=20){
            lastLesson=lesson;
            if(lastLesson!=firstLesson){
                let option = "<option value='"+firstLesson+"-"+lastLesson+"'>Lesson "+firstLesson+" to "+lastLesson+"</option>";
                $('#lessonSelector').append(option);
            }
            else{
                let option = "<option value='"+firstLesson+"'>Lesson "+firstLesson+"</option>";
		        $('#lessonSelector').append(option);
            }
            
            accumCount=0;
            firstLesson=0;
        }
        else if(firstLesson==0){
            firstLesson=lesson;
        }
    });
    console.log(lessonData);
}
function changeLesson(){
    let lessonRange=$('#lessonSelector').find(":selected").val();
    if(lessonRange=="0"){
        vocab=masterVocab;
    }
    else{
        let lessonArr=lessonRange.split("-");
        var tempVocab=[];
        if(lessonArr.length>1){
            let firstLesson=parseInt(lessonArr[0]);
            let lastLesson=parseInt(lessonArr[1]);
            masterVocab.forEach((word)=>{
                let lessonNum=parseInt(word.Lesson.split("-")[1]);
                if(lessonNum>=firstLesson && lessonNum<=lastLesson){
                    tempVocab.push(word);
                }
             });
        }
        else{
            let lesson =lessonArr[0];
            masterVocab.forEach((word)=>{
                if(word.Lesson==lesson){
                    tempVocab.push(word);
                }
             });
        }
        
        vocab=tempVocab;
    }
}

