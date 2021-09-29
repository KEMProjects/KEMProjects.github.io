function clickMemory(word,displayType){
    //play audio
    if(gameData==null){
        displayError("Empty game data!");
    }
    else{
        if(gameData.currWord==null){ //first word
            //show card, save ID
            gameData.currWord=word;
            
        }
        else if(gameData.currWord[wordDefine.Vocab]==word[wordDefine.Vocab]){ //match
            //show both cards, disable
            displayDisabledCard(word[wordDefine.Vocab]);
        }
        else{ //mismatch
            //hide both cards
            
            //set currword to null
            gameData.currWord=null;

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
            currWord:null         
        };
        let cards = genCardList(vocabList,"hidden",clickMemory);

        displayCards(cards);
    }
    else{
        displayError("Could not load vocab list.");
    }
}