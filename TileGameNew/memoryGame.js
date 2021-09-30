function showCard(word,displayType){
    var wordID=word[wordDefine.Vocab];
    var card=$("#"+wordID+"_"+displayType);
    card.empty();
    var cardDisplay;
    if(displayType=="image"){
        //<input type="image" src="http://example.com/path/to/image.png" />
        cardDisplay= $('<input />',
        { type: 'image',
          src: imgSource+word.Image, 
          class: 'shown imageCard',
          value: ''
        });
    }
    else{
        cardDisplay= $('<input />',
        { type: 'button',
          value: wordID, 
          class: 'shown textCard',
        });
    }
    card.append(cardDisplay);
    loadAudio(word.Audio);
}
function hideCard(word,displayType,callback){
    var wordID=word[wordDefine.Vocab];
    var card=$("#"+wordID+"_"+displayType);
    card.empty();
    var cardDisplay;
    cardDisplay= $('<input />',
    { type: 'image',
        src: imgSource+"tileBack.jpg", 
        class: 'hidden imageCard',
        value: ''
    });
    cardDisplay.click(function(){callback(word,displayType)});
    card.append(cardDisplay);
}
/**
 * Create object with vocab word and display attribuate (image or word)
 * @param {*} word 
 */
 function genCard(word,displayType,callback){
    var wordID=word[wordDefine.Vocab];
    var card = $('<div>',{
        id: wordID+"_"+displayType,
        class: 'card'
        //class: 'card w3-container w3-cell w3-cell-middle w3-mobile w3-card'
    });
    var cardDisplay;
    cardDisplay= $('<input />',
    { type: 'image',
        src: imgSource+"tileBack.jpg", 
        class: 'hidden imageCard',
        value: ''
    });
    cardDisplay.click(function(){callback(word,displayType)});
    card.append(cardDisplay);
    return card;
}
/**
 * Generate list of cards
 * @param {*} vocabList 
 * @returns 
 */
 function genCardList(vocabList,callback){
    let cardList=[];
    vocabList.forEach(element => {
        cardList.push(genCard(element,"text",callback));
        cardList.push(genCard(element,"image",callback));
    });
    return cardList;
}

function clickMemory(word,displayType){
    //play audio
    if(gameData==null){
        displayError("Empty game data!");
    }
    else{
        showCard(word,displayType);   
        if(gameData.saveWord.word==null){ //first word
            //show card, save ID
            gameData.saveWord.word=word;
            gameData.saveWord.displayType=displayType;
        }
        else if(gameData.saveWord.word[wordDefine.Vocab]==word[wordDefine.Vocab]){ //match
            //show both cards, disable
            setTimeout(function(){
                displayDisabledCard(word[wordDefine.Vocab]+"_image");
                displayDisabledCard(word[wordDefine.Vocab]+"_text");
                gameData.saveWord={word:null,displayType:null};
                gameData.counter+=1;
                if(gameData.counter>=gameData.total){
                    displayGameOver();
                }
            },1000);
        }
        else{ //mismatch
            //hide both cards
            setTimeout(function(){
                hideCard(gameData.saveWord.word,gameData.saveWord.displayType,clickMemory);
                hideCard(word,displayType,clickMemory);
                //set saveWord to null
                gameData.saveWord={word:null,displayType:null};
            }, 1000);
        }
    }
}
/**
 * Start a new game where it quizzes you and all cards are shown
 */
 function newMemory(numGameCards){
    if(vocab!=null){
        let vocabList=genRandList(vocab);
        vocabList=vocabList.slice(0,numGameCards);
        gameData={
            vocabList:vocabList,
            saveWord:{word:null,displayType:null},   
            counter:0,
            total:numGameCards
        };
        let cards = genCardList(vocabList,clickMemory);
        cards=genRandList(cards);
        displayCards(cards);
    }
    else{
        displayError("Could not load vocab list.");
    }
}
function newMemoryGame(){
    newMemory(6);
}