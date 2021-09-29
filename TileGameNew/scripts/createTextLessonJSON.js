'use strict';

const fs = require('fs');

let textbookJSON = fs.readFileSync('./data/ChineseTextbook.json');
//{"Simplified": "你", "Traditional": "", "Pinyin": "nǐ", "Definition": "Pr: You", "Tags": "lesson-1"},
let textbook = JSON.parse(textbookJSON);

let dictionaryJSON = fs.readFileSync('./data/ChineseVisual.json');
//{"Id": "503981018-01", "Term": "花束", "Pinyin": "huā shù", "Definition": "bouquet", "Image": "hmx-0AYEBgwsQuii87ZBYQ.jpg", 
//"Term Audio": "r9dq8E4J2AZPXacY.mp3", "Definition Audio": "Ym91cXVldA.en.mp3", "Topic": "Mandarin Chinese: Celebrations and festivals"}
let dictionary = JSON.parse(dictionaryJSON);

let visualLessonList=[];
textbook.forEach(element => {
    var visualWord = dictionary.find(word => word.Term === element.Simplified);
    
    if(visualWord!=null){
        let mediaNameArr=visualWord.Image.split(/\.jpg/);
        let fixMediaName=mediaNameArr[0].replace(/\./g,"_")+".jpg";
        let newWord={
            Simplified: element.Simplified,
            Traditional: element.Traditional,
            Pinyin: element.Pinyin,
            Definition: element.Definition,
            Lesson: element.Tags,
            Image: fixMediaName,
            Audio: visualWord["Term Audio"],
            Topic: visualWord.Topic
        };
        visualLessonList.push(newWord);
    }
    else{
        let newWord={
            Simplified: element.Simplified,
            Traditional: element.Traditional,
            Pinyin: element.Pinyin,
            Definition: element.Definition,
            Lesson: element.Tags,
            Image: null,
            Audio: visualWord["Term Audio"],
            Topic: null
        };
        visualLessonList.push(newWord);
    }
});

let visualLessonJSON = JSON.stringify(visualLessonList);
fs.writeFileSync('./data/visualVocab.json', visualLessonJSON);