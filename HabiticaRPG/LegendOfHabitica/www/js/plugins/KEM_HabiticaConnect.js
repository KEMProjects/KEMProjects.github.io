
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
var $printJSON=false;
var $setRPGVar=true;
var $siteDataEn=false;

/***
MODIFY AT RISK BELOW
***/
var $sentRequests=0;
var $completeRequests=0;
var $connectionSuccess=0; //0 not tried, 1 success, -1 failure
var $siteData=null;//site wide data
var $userData = null;//user data
var $partyData = null;//party data
var $partyMemberData=[];//party member data
var $userID=null;//The user's unique identifier
var $apiToken=null;//The user's api token that must be used to authenticate requests.
var $totalRequests=4;
const https = require('https');
const fs = require('fs');
/**
FUNCTIONS to set GAME VARIABLES
**/
function setConnectionSuccess(data){
	if($setRPGVar) $gameVariables.setValue($connectionSuccessVar,data);
}
function setUserID(data){
	if($setRPGVar) $gameVariables.setValue($userIDVar, data);
}
function setApiToken(data){
	if($setRPGVar) $gameVariables.setValue($apiTokenVar, data);
}
function setSiteData(data){
	if($setRPGVar) $gameVariables.setValue($siteDataVar, data);
}
function setUserData(data){
	if($setRPGVar) $gameVariables.setValue($userDataVar, data);
}
function setPartyData(data){
	if($setRPGVar) $gameVariables.setValue($partyDataVar, data);
}
function setPartyMemberData(data){
	if($setRPGVar) $gameVariables.setValue($partyMemberDataVar, data);
}
/**
FUNCTIONS to print JSON
**/
function printJSON(printObj,fileName){
	if($printJSON){
		var json = JSON.stringify(printObj);
		fs.writeFile(fileName+'.json', json, 'utf8', function(err) {
			if (err) throw err;
			console.log(fileName+' complete');
			});
	}
}
function printSiteData(data){
	if($printJSON){
		if(data!=undefined){
			printJSON(data.itemList,'itemList');
			printJSON(data.gear.flat,'gear');
			printJSON(data.spells,'spells');
			printJSON(data.classes,'classes');
			printJSON(data.gearTypes,'gearTypes');
			printJSON(data.appearances,'appearances');
			printJSON(data.pets,'pets');
			printJSON(data.mounts,'mounts');
			printJSON(data.petInfo,'petInfo');
			printJSON(data.mountInfo,'mountInfo');
		}
		else{
			console.log("Undefined value:"+data);
		}
	}
}


/**
FUNCTIONS FOR HTTP REQUEST

getsiteData sends a "get" request via http with given options and callback
**/
function reqSent(){
	$sentRequests++;
	console.log("num sent requests:"+$sentRequests);
}
function reqComplete(){
	$completeRequests++;
	console.log("num rec requests:"+$completeRequests);
	if($completeRequests>=$sentRequests&&$completeRequests>=$totalRequests){
		connectionSuccess();
	}
}
function connectionSuccess(){
	console.log("Connection complete.");
	$connectionSuccess=1;
	setConnectionSuccess(1);
}
function connectionFail(){
	console.log("Connection failed.");
	$connectionSuccess=-1;
	setConnectionSuccess(-1);
}
function getHabiticaData(options,body,callback){
	reqSent();
	//console.log("getHabiticaData send:"+options+","+callback);
	let request = https.request(options, (response) => {
	  response.setEncoding('utf8');
	  let rawData = '';
	  response.on('data', (chunk) => { rawData += chunk; });
	  response.on('end', () =>{
		reqComplete();
		try {
		  let parsedData = JSON.parse(rawData);
		  //console.log("getHabiticaData recieve:"+parsedData);
		  
		  
		  if(parsedData!=undefined && parsedData.success==true){
			  
		  	callback(parsedData);
		  }
		  else{
			connectionFail();
		  }
		} catch (e) {
		  console.error(e.message);
		}
	  });
	});
	if(body!=undefined&&body!=null){
		request.write(body);
	}
	request.end();
	
	request.on('error', (e) => {
	  console.error(`Got error: ${e.message}`);
	});
}

/**
createRequestOptions uses given $userID and $apiToken keys plus habitica URL path extension to build GET request options
**/
function createRequestOptions(path){
	let options = {
      hostname: 'habitica.com',
	  path: '/api/v3/'+path,
	  method: 'GET', 
	  headers: {
		'x-api-user': $userID,
		'x-api-key':  $apiToken,
		'x-client': '4a058194-5751-4210-aaff-5fdf44bcb46a-RPGMaker'
	  }
	}
	return options;
}

/**
Functions to fetch Habitica data
**/

/**
fetchLogData logs in user
**/
function fetchLogInData(username,password){
	$totalRequests++;
	let body={
		'username':username,
		'password':password
	};
	let postData = JSON.stringify(body);
	let options = {
      hostname: 'habitica.com',
	  path: '/api/v3/user/auth/local/login',
	  method: 'POST', 
	  headers: {
		'x-client': '4a058194-5751-4210-aaff-5fdf44bcb46a-RPGMaker',
		'Content-Type': 'application/json',
		'Content-Length': postData.length
	  }
	}
	getHabiticaData(options,postData,parseLogInData);
}

function parseLogInData(returnObj){
	//console.log("parseLogInData:"+returnObj.success);
	if(returnObj==undefined){
		connectionFail();
		return;
	}
	//$userID=returnObj.data.id;
	//$apiToken=returnObj.data.apiToken;
	fetchUserAPI(returnObj.data.id,returnObj.data.apiToken);
}

function fetchUserAPI(userID,apiToken){
	console.log("Logging in with user ID and API.");
	$userID=userID;
	$apiToken=apiToken;
	setUserID($userID);
	setApiToken($apiToken);
	if($userID!=undefined&&$apiToken!=undefined){
		if($siteDataEn)fetchSiteData();
		fetchUserData();
	}
	else{
		connectionFail();
	}
}

/**
fetchSiteData GETs the data from the site
appearances
	gear
	 flat:
		<obj_name>
			con,index,int,key (obj_name in str), klass, notes, per, set, str, text (readable name), type ("armor"),value
**/
function fetchSiteData(){
	//console.log("Fetch site data");
	var options = createRequestOptions("/content");
	getHabiticaData(options,null,parseSiteData);
}
/**
parseSiteData parses the site data and sets to global variable
**/
function parseSiteData(returnObj){
	console.log("parse SiteData");
	if(typeof returnObj!=undefined && typeof returnObj.data!=undefined){
		printSiteData(returnObj.data);	
		$siteData=returnObj.data;
		setSiteData(returnObj.data);
	}
	else{
		console.log("Undefined return:"+returnObj);
	}
}

/**
fetchUserData fetches the user level data
**/
function fetchUserData(){
	//console.log("Fetch user data");
	var options = createRequestOptions("user");
	getHabiticaData(options,null,parseUserData);
}
/**
parseUserData parses the user data, adds the main player, and then GETs party members
**/
function parseUserData(returnObj){
	console.log("parse UserData");
	if(returnObj!=undefined && returnObj.data!=undefined){
		printJSON(returnObj,'user');
		$userData=returnObj.data;
		setUserData(returnObj.data);
		//addHabiticaActor($userData.profile.name,$userData.stats.class,$userData.stats, $userData.items);
		fetchPartyData($userData.party._id);
	}
	else{
		console.log("Undefined return:"+returnObj);
	}
}

/**
fetch party data grabs the names/ids of the party members from Habitica and then GETs the stats for each member
**/
function fetchPartyData(groupId){
	//console.log("Fetch party data:"+groupId);

	var options = createRequestOptions('groups/'+groupId+'/members');
	getHabiticaData(options,null, parsePartyData);
}
/**
parsePartyData parses the party data and adds new members
**/
function parsePartyData(returnObj){
	console.log("parsePartyData"+returnObj);
	printJSON(returnObj,'party');

	$partyData=returnObj.data;
	setPartyData($partyData);
	for (var user=0; user<$partyData.length;user++) {	
		if($partyData[user].id!=$userID){
			fetchPartyMemberData($partyData[user].id);
		}
	}
}
/**
fetchPartyMemberData fetches the stats for each member in the party
**/
function fetchPartyMemberData(memberId){
	var options = createRequestOptions('members/'+memberId);
	getHabiticaData(options,null,parsePartyMemberData);
}

/**
parsePartyMember data parses data for each member
**/
function parsePartyMemberData(returnObj){
	console.log("parsePartyMemberData"+returnObj);
	printJSON(returnObj,'partyppl');
	$partyMemberData.push(returnObj.data);
	setPartyMemberData($partyMemberData);//resetting to whole array
	//addHabiticaActor(memberData.profile.name,memberData.stats.class,memberData.stats, memberData.items);
}


//fetchLogInData("k-macshane@hushmail.com","@bs0lutely");
/**
 * Links:
 * https://oldgods.net/habitrpg/equipment_table_creator.html
 */