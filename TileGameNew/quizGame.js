/**Play audio, check if correct answer for game */
function clickCard(word){
    //play audio
    displayDisabledCard(word);
}
/**
 * Create object with vocab word and display attribuate (image or word)
 * @param {*} word 
 */
function genCard(word,displayType,callback){
    var wordID=word[wordDefine.Vocab];
    var card = $('<div>',{
        id: wordID,
        class: 'card'
        //class: 'card w3-container w3-cell w3-cell-middle w3-mobile w3-card'
    });
    var cardDisplay;
    if(displayType=="image"){
        //<input type="image" src="http://example.com/path/to/image.png" />
        cardDisplay= $('<input />',
        { type: 'image',
          src: imgSource+word.Image, 
          class: 'imageCard',
          value: ''
        });
    }
    else{
        cardDisplay= $('<input />',
        { type: 'button',
          value: wordID, 
          class: 'textCard',
        });
    }
    cardDisplay.click(function(){callback(word,displayType)});
    card.append(cardDisplay);
    return card;
}
/**
 * Generate list of cards
 * @param {*} vocabList 
 * @returns 
 */
function genCardList(vocabList,type,callback){
    let cardList=[];
    vocabList.forEach(element => {
        cardList.push(genCard(element,type,callback));
    });
    return cardList;
}
function updateNextQuizWordDisplay(displayType){
    var displayWord;
    if(displayType=="image"){
        displayWord=gameData.currWord[wordDefine.Vocab];
    }
    else{
        displayWord=gameData.currWord.Definition;//show english because "text" will show lang vocab as input
    }
    displayCurrWord(displayWord);
    loadAudio(gameData.currWord.Audio);
}
function clickQuizFindAll(word,displayType){
    //play audio
    if(gameData==null){
        displayError("Empty game data!");
    }
    else{
        //if correct...
        if(gameData.currWord[wordDefine.Vocab]==word[wordDefine.Vocab]){
            displayDisabledCard(word[wordDefine.Vocab]);
            //remove word from list
            let index=gameData.vocabList.map(function(e) { return e[wordDefine.Vocab]; }).indexOf(word[wordDefine.Vocab]);
            gameData.vocabList.splice(index,1);
            if(gameData.vocabList.length>0){
                //continue game
                gameData.currWord=getRandomWord(gameData.vocabList);
                updateNextQuizWordDisplay(displayType);
            }
            else{
                //game over!
                displayGameOver();
            }
        }
        else{
            //play "wrong" sound
            loadAudio(gameData.currWord.Audio);
        }
    }
}
/**
 * Start a new game where it quizzes you and all cards are shown
 */
function newQuizFindAll(numGameCards,displayType){
    if(vocab!=null){
        let vocabList=genRandList(vocab);
        vocabList=vocabList.slice(0,numGameCards);
        gameData={
            vocabList:vocabList,
            currWord:getRandomWord(vocabList)            
        };
        let cards = genCardList(vocabList,displayType,clickQuizFindAll);

        displayCards(cards);
        updateNextQuizWordDisplay(displayType);
    }
    else{
        displayError("Could not load vocab list.");
    }
}
function newQuizFindAllImages(){
    newQuizFindAll(9,"image");
}
function newQuizFindAllWords(){
    newQuizFindAll(9,"text");
}