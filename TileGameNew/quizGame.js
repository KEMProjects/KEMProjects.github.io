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
function clickQuizFindOne(word,displayType){
    //play audio
    if(gameData==null){
        displayError("Empty game data!");
    }
    else{
        //if correct...
        if(gameData.currWord[wordDefine.Vocab]==word[wordDefine.Vocab]){
            if(gameData.counter<gameData.total){
                nextQuizFindOne(displayType);
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
function nextQuizFindOne(displayType){
    gameData.prevAnswers.push(gameData.currWord[wordDefine.Vocab]);//add last answer to saved list
    gameData.counter+=1;

    var numGameCards=3;
    let vocabList=genRandList(gameData.vocabList);  //shuffle vocab list
    let displayList=vocabList.slice(0,numGameCards);    //get 9 cards
    gameData.currWord=getRandomWord(displayList);   //get random word from those 9
    let counter=0;
    while(gameData.prevAnswers.includes(gameData.currWord[wordDefine.Vocab])&&counter<10){    //check not already used as quiz question
        vocabList=genRandList(gameData.vocabList);  //shuffle vocab list
        displayList=vocabList.slice(0,numGameCards);    //get 9 cards
        gameData.currWord=getRandomWord(displayList);   //get random word from those 9
        counter++;
    }

    //generate card view
    let cards = genCardList(displayList,displayType,clickQuizFindOne);

    displayCards(cards);
    updateNextQuizWordDisplay(displayType);
}


/**
 * Start a new game where it quizzes you and all cards are shown
 */
function newQuizFindOne(displayType,totalQuestions){
    var numGameCards=3;
    if(vocab!=null){
        let vocabList=genRandList(vocab);   //shuffle vocab list
        vocabList=vocabList.slice(0,totalQuestions); //get list size matching max # questions
        let displayList=vocabList.slice(0,numGameCards); //get subarray for display
        gameData={
            vocabList:vocabList,
            currWord:getRandomWord(displayList),
            counter:0,
            prevAnswers:[],
            total:totalQuestions          
        };
        let cards = genCardList(displayList,displayType,clickQuizFindOne);

        displayCards(cards);
        updateNextQuizWordDisplay(displayType);
    }
    else{
        displayError("Could not load vocab list.");
    }
}
function newQuizFindOneImage(){
    newQuizFindOne("image",10);
}
function newQuizFindOneWord(){
    newQuizFindOne("text",10);
}