var myList = [
  { "name": "abc", "age": 50 },
  { "age": "25", "hobby": "swimming" },
  { "name": "xyz", "hobby": "programming" }
];
var genki_kanji = ["一","七","万","三","上","下","不","世","両","中","主","乗","九","事","二","五","京","人","今","仕","代","以","休","会","住","体","何","作","使","供","信","借","働","元","兄","先","入","全","八","六","内","円","写","冬","出","分","切","初","別","前","力","勉","動","化","北","医","十","千","午","半","卒","南","去","友","口","古","台","右","同","名","味","品","員","問","四","回","図","国","土","地","堂","場","声","売","変","夏","夕","外","多","夜","大","天","女","好","妹","姉","始","婚","子","字","学","守","安","室","家","宿","寺","対","小","少","屋","山","川","工","左","市","帰","年","幸","広","店","度","建","弟","強","当","彼","待","後","心","忘","怒","思","急","悪","悲","情","意","感","所","手","払","持","授","教","文","料","新","方","旅","族","日","早","明","昔","映","春","昼","時","曜","書","最","月","有","服","朝","木","末","本","来","東","枚","果","査","校","案","業","楽","様","横","次","歌","止","正","歩","歳","死","残","母","毎","比","気","水","注","洋","活","海","港","漢","火","無","父","牛","物","特","犬","理","生","用","田","男","町","画","界","留","番","病","痛","発","白","百","的","皿","目","相","真","着","知","研","社","神","私","秋","究","空","立","笑","答","紙","終","経","結","絶","続","習","考","者","聞","肉","自","色","花","若","英","茶","行","表","西","見","親","言","計","記","試","話","語","説","読","調","買","貸","質","赤","走","起","足","車","転","近","送","通","連","週","遅","運","道","違","部","配","重","野","金","銀","長","開","間","院","集","雨","雪","電","青","音","題","顔","風","食","飯","飲","館","駅","験","高","魚","鳥","黒","々"];
//later could change genki_kanji to a json object that includes link to kanji page

function getJLPTKanji(){
	for (var i = 0; i < myList.length; i++) {
		let kanj_str=myList[i]["Kanji"];
		if (typeof kanj_str === 'undefined' || kanj_str === null) {
		// variable is undefined or null
		//myList[i]["Audio Clip"]=myList[i]["Audio Clip"]=createAudioPlayer(myList[i]["Vocab"],"");
		}
		else{
			let regexp = /[\u4e00-\u9faf]/g;
			let matches_array = kanj_str.match(regexp);
			if(typeof matches_array !== 'undefined' && matches_array !== null){
				let jlpt_array=[];
				for(var j=0;j<matches_array.length; j++){
					if(genki_kanji.indexOf(matches_array[j])>0){	//may need to change this later if changing genki_kanji to an object list
						jlpt_array.push("<a href='https://jisho.org/search/"+matches_array[j]+"%23kanji'>"+matches_array[j]+"</a>");
					}
				}
				myList[i]["Genki Kanji"]=jlpt_array;
				//myList[i]["Audio Clip"]=createAudioPlayer(myList[i]["Vocab"],kanj_str);
			}
		}
		//delete myList[i]["Kanji, Katakana, or Hiragana"];
		
	}
}

$.getJSON("jlpt_dictionary.json", function(json) {
    myList = json;//console.log(json); // this will show the info it in firebug console
	getJLPTKanji();
	
	/*var myJSON = JSON.stringify(myList);
	document.getElementById("json_print").innerHTML = myJSON;*/
});