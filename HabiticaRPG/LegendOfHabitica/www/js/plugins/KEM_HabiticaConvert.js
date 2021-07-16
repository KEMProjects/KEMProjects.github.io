/***
CUSTOMIZE FOR GAME

Instructions:
First log in with fetchLogInData(username,password)
This will start other fetches for habitica data
***/
//set game variable ids for Habitica data

var $userIDVar=3;//The user's unique identifier
var $apiTokenVar=4;//The user's api token that must be used to authenticate requests.
var $siteDataVar=5;//site wide data
var $userDataVar =6;//user data
var $partyDataVar =7;//party data
var $partyMemberDataVar=8;//party member data
var $connectionSuccessVar=9;
/***
MODIFY AT RISK BELOW
Game variables save the just the "data" object

***/

/**
FUNCTIONS to get GAME VARIABLES
**/
/*function getSiteData(){
	return $gameVariables.value($siteDataVar);
}*/
function getUserData(){
	return $gameVariables.value($userDataVar);
}
function getPartyData(){
	return $gameVariables.value($partyDataVar);
}
function getPartyMemberData(){
	return $gameVariables.value($partyMemberDataVar);
}
/**
RPG MAKER MV functions to convert Habitica data to RPG Maker
How to use: call convertHabiticaData() from RPG MAKER MV
**/
function convertHabiticaData(){
	//let siteData=getSiteData();//site wide data
	//addGearaddGearData(siteData.gear.flat);
	let userData=getUserData();//user data
	addHabiticaActor(userData.profile.name,userData.stats,userData.items);
	let partyData=getPartyData();//party data
	let partyMemberData=getPartyMemberData();//party member data
	addPartyMembers(partyMemberData);
}
/**
 * Creates party members from list
 * @param {*} partyMemberList 
 */
function addPartyMembers(partyMemberList){
	for(var key in partyMemberList){
		if(partyMemberList.hasOwnProperty(key)){
			//console.log(partyMemberList[key]);
			let name=partyMemberList[key].profile.name;
			let stats=partyMemberList[key].stats;
			let items=partyMemberList[key].items;
			addHabiticaActor(name,stats,items);
		}
	}
}

/**
Given Habitica name, class, stats, and items, adds a new actor to RPG Maker MV
**/                                                     
function addHabiticaActor(name, stats, items){
	//console.log("new actor: "+name+",stats: "+stats+", items:" +items);
	var newActor = InstanceManager.addActor();
	var actorId=newActor.id;
	$gameActors.actor(actorId).setName(name);
	setClass(actorId,stats.class,name);
	setActorParams(actorId,stats);
	setActorItems(actorId,items);
	$gameParty.addActor(actorId);
	$gamePlayer.refresh();
}
/**
setClass takes actorID and habitica class to convert to rpg maker class
**/
function setClass(actorId,habitClass,name){
	var classId=0;
	var characterName="";
	var characterIndex=0;
	var battlerName="";
	var equipId=0;
	if(habitClass=="rogue"){
		classId=4;
		characterName="Actor1";
		characterIndex=3;
		battlerName="Actor1_4";
		equipId=4;
	}
	else if(habitClass=="wizard"){
		classId=2;
		characterName="Actor2";
		characterIndex=4;
		battlerName="Actor2_6";
		equipId=2;
	}
	else if(habitClass=="healer"){
		classId=3;
		characterName="Actor2";
		characterIndex=2;
		battlerName="Actor2_3";
		equipId=3;
	}
	else{
		classId=1;
		characterName="Actor1";
		characterIndex=0;
		battlerName="Actor1_1";
		equipId=1;
	}
	
	$gameActors.actor(actorId).changeClass(classId,false);
	$gameActors.actor(actorId).setFaceImage(characterName,characterIndex);
	$gameActors.actor(actorId).setBattlerImage(battlerName);
	$gameActors.actor(actorId).setCharacterImage(characterName,characterIndex);
}

/**
Given habitica stats and RPG Maker actor id, converts habitica stats to game stats
MV=Habitica
maxHP=mhp
maxMP=mmp
atk=str
def=con
mat=int
mdf=con
agi=per
luk=per
**/
function setActorParams(actorId,stats){
	$gameActors.actor(actorId).changeExp(stats.exp,false);	//stats. hp,mp,exp,gp,lvl,points,str,con,int,per	
	$gameActors.actor(actorId).changeLevel(stats.lvl);
 	var maxHP=$gameActors.actor(actorId).mhp;
	var maxMP=$gameActors.actor(actorId).mmp;
	var atk=$gameActors.actor(actorId).param(2);
	var def=$gameActors.actor(actorId).param(3);
	var mat=$gameActors.actor(actorId).param(4);
	var mdf=$gameActors.actor(actorId).param(5);
	var agi=$gameActors.actor(actorId).param(6);
	var luk=$gameActors.actor(actorId).param(7);

	$gameActors.actor(actorId).addParam(0, parseInt(stats.maxHealth)-maxHP);
	$gameActors.actor(actorId).addParam(1, parseInt(stats.maxMP)-maxMP);
	console.log("actor "+actorId+", rpg stats:"+maxHP+","+maxMP+","+atk+","+def+","+mat+","+mdf+","+agi+","+luk);
	//stats are lvl/2+stat_base+stat_buff
	$gameActors.actor(actorId).addParam(2, parseInt(stats.lvl)/2+parseInt(stats.str)+parseInt(stats.buffs.str)-atk);
	$gameActors.actor(actorId).addParam(3, parseInt(stats.lvl)/2+parseInt(stats.con)+parseInt(stats.buffs.con)-def);
	$gameActors.actor(actorId).addParam(4, parseInt(stats.lvl)/2+parseInt(stats.int)+parseInt(stats.buffs.int)-mat);
	$gameActors.actor(actorId).addParam(5, parseInt(stats.lvl)/2+parseInt(stats.con)+parseInt(stats.buffs.con)-mdf);
	$gameActors.actor(actorId).addParam(6, parseInt(stats.lvl)/2+parseInt(stats.per)+parseInt(stats.buffs.per)-agi);
	$gameActors.actor(actorId).addParam(7, parseInt(stats.lvl)/2+parseInt(stats.per)+parseInt(stats.buffs.per)-luk);
	maxHP=$gameActors.actor(actorId).mhp;
	maxMP=$gameActors.actor(actorId).mmp;
	atk=$gameActors.actor(actorId).param(2);
	def=$gameActors.actor(actorId).param(3);
	mat=$gameActors.actor(actorId).param(4);
	mdf=$gameActors.actor(actorId).param(5);
	agi=$gameActors.actor(actorId).param(6);
	luk=$gameActors.actor(actorId).param(7);
	console.log(stats);
	console.log("actor "+actorId+", rpg stats:"+maxHP+","+maxMP+","+atk+","+def+","+mat+","+mdf+","+agi+","+luk);
}
/**
Given habitica items assign gear/items
items.gear.equipped
	armor, head, shield, eyewear, weapon, back
the variable names equate to site data

Equip slots:
Weapon
Armor
Head
Shield
Body
Back
Head Acc
Eyewear
**/
var equipTypeList={
    "weapon":1,
    "armor":2,
    "head":3,
    "shield":4,
    "body":5,
    "back":6,
    "headAccessory":7,
    "eyewear":8
};
function addEquip(actorId,mvEquip,equipTypeId,itemId){
	$gameParty.gainItem(mvEquip, 1);
	$gameActors.actor(actorId).changeEquipById(equipTypeId, itemId);
}
/**
 * TODO: the armors that are not type "armor" are not being loaded.
 * @param {*} actorId 
 * @param {*} items 
 */
function setActorItems(actorId,items){
	$gameActors.actor(actorId).clearEquipments();
	//console.log($gameActors.actor(actorId).equipSlots());
	for(var i=1;i<$dataWeapons.length;i++){
		let weapon = $dataWeapons[i];
		if(weapon.note==items.gear.equipped.weapon){
			//console.log(actorId+","+weapon.note+","+$gameActors.actor(actorId).canEquipWeapon(weapon));
			addEquip(actorId,weapon,equipTypeList.weapon,i);
			break;
		}
	}
	//console.log($dataArmors);
	var numFound=0;
	var maxEquip=7;
	for(var i=1;i<$dataArmors.length;i++){
		let armor = $dataArmors[i];
		let equip = items.gear.equipped;
		if(armor.note==equip.armor){
			//console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.armor,i);
			numFound++;
		}
		else if(armor.note==equip.head){
			//console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.head,i);
			numFound++;
		}
		else if(armor.note==equip.shield){
			//console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.shield,i);
			numFound++;
		}
		else if(armor.note==equip.body){
			//console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.body,i);
			numFound++;
		}
		else if(armor.note==equip.back){
			//console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.back,i);
			numFound++;
		}
		else if(armor.note==equip.headAccessory){
		//	console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.headAccessory,i);
			numFound++;
		}
		else if(armor.note==equip.eyewear){
			//console.log(actorId+","+armor.note+","+$gameActors.actor(actorId).canEquipArmor(armor));
			addEquip(actorId,armor,equipTypeList.eyewear,i);
			numFound++;
		}
		if(numFound>=maxEquip){
			break;
		}
	}
}





/**
TODO:
Save user/password
	DataManager.saveGlobalInfo
	DataManager.loadGlobalInfo
	
	
	
Get class algorithms for stats->add to classes
Get data for armor
	$gameActor.actor(actorId).changeEquipId(etypeId,itemId)
Get online buffs
	$gameActor.actor(actorId).actor(actorId).addNewState(stateId)
	$gameActor.actor(actorId).addParam(paramId, value)
	$gameActor.actor(actorId).addState(stateId)
Get class information
	$gameActor.actor(actorId).changeClass(classId, true)
	$gameActor.actor(actorId).changeExp(number,true)
Get name
	$gamePlayer.characterName
	$gameActor.actor(actorId).setName(name)
	
How should the health/mp/Habitica skills link to the game?
	Take the skills but not the health/mp/Habitica
	
Habitic Energy-used to unlock dungeon floors or build something cool
Negative task looses you energy, positive task gains you energy

Quest creator form

**/