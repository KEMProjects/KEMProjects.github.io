//http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=%E3%81%84%E3%81%88&kanji=%E5%AE%B6

function japaneseAudio(kana, kanji){
	let audiolink="http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana="+kana;
	if(kanji!="")
		audiolink +="&amp;kanji="+kanji;
	return audiolink;
}
function createAudioPlayer(kana, kanji){
	let link = japaneseAudio(kana,kanji);
	return "<audio id='flashaudio' controls preload='none'><source src='"+link+"' type='audio/mp3' /></audio>";	
}
