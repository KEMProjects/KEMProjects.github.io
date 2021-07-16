import {activeTasks} from './fetchHabiticaData.js';
import {acceptedTasks} from './fetchHabiticaData.js';
import {user} from './fetchHabiticaData.js';
import {content} from './fetchHabiticaData.js';
import {calcRewardStr} from './calcReward.js';
/**
 * Function to generate HTML for active quests
 */
export function showActiveQuests(){
    /*
    <div id="activeQuests" class="questViewDiv" hidden>
                <h1>
                    Active Quests
                </h1>
                <div id="activeQuestListDiv" class="questListDiv rpgui-container framed">
                    
                </div>
                <div id="activeQuestDetailDiv" class="questDetailDiv rpgui-container framed-golden-2">
                    <h2></h2>
                    <p></p>
                    <p></p>
                </div>
            </div>

    */
    $("#content").empty();
    genQuestView("#content","active",activeTasks);
    $("#questEditButtonsDiv").hide();
}
/**
 * Function to generate HTML for accepted quests
 */
export function showAcceptedQuests(){
    $("#content").empty();
    genQuestView("#content","accepted",acceptedTasks);
    $("#questEditButtonsDiv").hide();
}
/**
 * Function to generate HTML for building/creating quests
 */
export function showBuildQuests(){
    $("#content").empty();
}
/**
 * Generic function for building a quest view with list of quests on left and a detail panel on right
 * @param {*} questType 
 * @param {*} taskList 
 */
function genQuestView(parentName,questType,taskList){
    let viewDiv=document.createElement("div");
    viewDiv.id=questType+"Quests";
    viewDiv.className="questViewDiv";

    //Page name
    let title=document.createElement("h1");
    title.innerHTML=questType[0].toUpperCase()+questType.substring(1)+" Quests";
    viewDiv.append(title);

    //Task seletion list
    let listDiv=document.createElement("div");
    listDiv.id=questType+"QuestListDiv";
    listDiv.className="questListDiv rpgui-container framed";

    //Task description
    let detailDiv=document.createElement("div");
    detailDiv.id=questType+"QuestDetailDiv";
    detailDiv.className="questDetailDiv rpgui-container framed-golden-2";
    detailDiv.append(document.createElement("h2"));
    detailDiv.append(document.createElement("p"));
    detailDiv.append(document.createElement("p"));

    //Task edit buttons
    let editBtns=document.createElement("div");
    editBtns.id="questEditButtonsDiv";
    let activeBtn=document.createElement("button");
    if(questType=="active"){
        activeBtn.innerHTML="Stop Tracking";
    }
    else{
        activeBtn.innerHTML="Track";
    }
    activeBtn.className="rpgui-button";
    editBtns.append(activeBtn);

    let editButton=document.createElement("button");
    editButton.innerHTML="Edit";
    editButton.className="rpgui-button";
    editBtns.append(editButton);

    let quitBtn=document.createElement("button");
    quitBtn.innerHTML="Quit";
    quitBtn.className="rpgui-button";
    editBtns.append(quitBtn);
    detailDiv.append(editBtns);

    jQuery.each(taskList, function(i, task) {
        addQuest(listDiv,detailDiv,task);
    });
    viewDiv.append(listDiv);
    viewDiv.append(detailDiv);

    $(parentName).append(viewDiv);
}
/**
 * Determines direction string from boolean 'up' attribute in task
 * @param {*} task 
 * @returns 
 */
function getDirectionStr(task){
 if(task.up){
     return "up";
 }
 else{
     return "down";
 }
}
/**
 * Function that displays quest information on quest detail pane when the quest button is clicked
 * @param {*} parent 
 * @param {*} reward 
 * @param {*} taskName 
 * @param {*} taskDesc 
 */
function openQuestDesc(parentName,reward,taskName,taskDesc){
    let questDivChild=$(parentName).children();
    questDivChild[0].innerHTML=taskName;
    questDivChild[1].innerHTML=taskDesc;
    questDivChild[2].innerHTML=reward;
    $("#questEditButtonsDiv").show();
}
/**
 * Function to generate html tags for a quest list div with the function call that generates the details
 * @param {*} listParent 
 * @param {*} detailParent 
 * @param {*} task 
 */
function addQuest(listParent,detailParent,task){


    /*
    <div class="rpgui-center">
        <button class="rpgui-button" type="button" style="width:100%"><p>New Game</p></button>
    </div>

    */
    let reward=calcRewardStr(user,task,getDirectionStr(task),content);
    let quest = document.createElement("button");
    quest.className="rpgui-button";
    quest.innerHTML=task.text;
    quest.onclick=function(){openQuestDesc("#"+detailParent.id,reward,task.text,task.notes)};

    let questListItem=document.createElement("div");
    questListItem.append(quest);
    questListItem.className="rpgui-center";
    listParent.append(questListItem);
}
/**
 * Function to set the method for each menu button
 */
export function setMenuFunctions(){
    $("#activeMenuBtn").on('click', () => {
        showActiveQuests();
    });
    $("#acceptedMenuBtn").on('click', () => {
        showAcceptedQuests();
    });
    $("#builderMenuBtn").on('click', () => {
        showBuildQuests();
    });
      
}