//http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=%E3%81%84%E3%81%88&kanji=%E5%AE%B6

function japaneseAudio(kana, kanji){
	let audiolink="http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana="+kana;
	if(kanji!="")
		audiolink +="&amp;kanji="+kanji;
	return audiolink;
}
function createAudioPlayer(kana, kanji){
	let regexp = /[^\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]/g;
	let newKana = kana.replace(regexp,"");
	let newKanji= kanji.replace(regexp,"");

	let link = japaneseAudio(newKana,newKanji);
	return "<audio id='flashaudio' preload='none'><source src='"+link+"' type='audio/mp3' /></audio>";		
}
function togglePlay() {
	if ($('#flashaudio').paused === false) {
	  $('#flashaudio')[0].pause();

	} else {
	  $('#flashaudio')[0].play();

	}
}
