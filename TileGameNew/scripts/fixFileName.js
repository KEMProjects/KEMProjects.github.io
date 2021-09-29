var fs = require('fs');

const testFolder = './media/';

fs.readdir(testFolder, (err, files) => {
    let regex = /\.jpg/;
    console.log(files);
    files.forEach(file => {
        if(regex.test(file)){
            let fileNameArr=file.split(regex);
            let searchRegex=/\./g;
            if(searchRegex.test(fileNameArr[0])){
                let result=fileNameArr[0].replace(/\./g,"_");
                console.log(file+","+result+".jpg");
                fs.rename(testFolder+file, testFolder+result+".jpg", function(err) {
                    if ( err ) console.log('ERROR: ' + err);
                });
            }
            
        }
    });
});

let fixVisualJSON = fs.readFileSync('./data/visualVocab.json');
let visualVocab = JSON.parse(fixVisualJSON);
let fixMediaArr=[];
visualVocab.forEach((element)=>{
    let imageName=element.Image;
    let regex = /\.jpg/;
    let fileNameArr=imageName.split(regex);
    let fixMediaName=fileNameArr[0].replace(/\./g,"_")+".jpg";
    let newWord={
        Simplified: element.Simplified,
        Traditional: element.Traditional,
        Pinyin: element.Pinyin,
        Definition: element.Definition,
        Lesson: element.Lesson,
        Image: fixMediaName,
        Audio: element.Audio,
        Topic: element.Topic
    };
    fixMediaArr.push(newWord);
});
let visualLessonJSON = JSON.stringify(fixMediaArr);
fs.writeFileSync('./data/visualVocab.json', visualLessonJSON);