/*
code modified from: https://oldgods.net/habitrpg/habitrpg_user_data_display.html
*/

import {showActiveQuests} from './contentGen.js';
import {setMenuFunctions} from './contentGen.js';
/*Global Variables*/
export var content;  // holds site-wide content (gear names and stats, quests, etc)
var tavern;   // holds tavern data
var party;    // holds party data
export var user;     // holds user's data
var tasksFromDb;          // holds user's tasks except for ...
var completedTodosFromDb; // completed To Do's
export var activeTasks =[];
export var acceptedTasks =[];

var serverName               = 'Habitica'; // used in "loading" message
var serverUrl                = 'https://habitica.com/api/v3';
var serverPathContent        = '/content?language=en';
var serverPathTavern         = '/groups/habitrpg';
var serverPathParty          = '/groups/party';
var serverPathGuildBase      = '/groups?type=guilds';
var serverPathUser           = '/user';
var serverPathTasks          = '/tasks/user';
var serverPathCompletedTodos = '/tasks/user?type=_allCompletedTodos';
var clientId                 = '4a058194-5751-4210-aaff-5fdf44bcb46a-TaskManager';
var userId                   = '';
var apiToken                 = '';
var debug                    = false;


/*Log in*/

/*fetch data*/
export function fetchData(userId,apiToken) {
    // test that the User ID and API Token are UUIDs
    var uuidPattern = /^\s*[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}\s*$/i;
    if (! uuidPattern.test(userId)) {
        fetchFailure({ responseJSON: { message: "The User ID you have entered is not a valid User ID." }}, 'checkCredentials');
    }
    else if (! uuidPattern.test(apiToken)) {
        fetchFailure({ responseJSON: { message: "The API Token you have entered is not a valid API Token." }}, 'checkCredentials');
    }
    else {  // attempt to fetch data
        var text = document.createTextNode("Loading Data...");
        $("#dataFetchResults").append(text);
        var ajaxRunningCount = 6; // drops to 0 when all calls have succeeded

        // fetch the user's own content (gear owned, etc):
        $.ajax({
            url: serverUrl + serverPathUser,
            type: 'GET',
            dataType: 'json',
            cache: false,
            beforeSend: function(xhr){
                    xhr.setRequestHeader('x-client',   clientId);
                    xhr.setRequestHeader('x-api-user', userId);
                    xhr.setRequestHeader('x-api-key',  apiToken);
                },
            success: fetchUserSuccess,
            error: fetchFailure
        });

        // fetch the user's tasks (except completed To Do's):
        $.ajax({
            url: serverUrl + serverPathTasks,
            type: 'GET',
            dataType: 'json',
            cache: false,
            beforeSend: function(xhr){
                    xhr.setRequestHeader('x-client',   clientId);
                    xhr.setRequestHeader('x-api-user', userId);
                    xhr.setRequestHeader('x-api-key',  apiToken);
                },
            success: fetchTasksSuccess,
            error: fetchFailure
        });

        // fetch the user's completed To Do's:
        $.ajax({
            url: serverUrl + serverPathCompletedTodos,
            type: 'GET',
            dataType: 'json',
            cache: false,
            beforeSend: function(xhr){
                    xhr.setRequestHeader('x-client',   clientId);
                    xhr.setRequestHeader('x-api-user', userId);
                    xhr.setRequestHeader('x-api-key',  apiToken);
                },
            success: fetchCompletedTodosSuccess,
            error: fetchFailure
        });

        // fetch the site-wide content (gear names and stats, etc):
        $.ajax({
            url: serverUrl + serverPathContent,
            type: 'GET',
            dataType: 'json',
            cache: true,
            beforeSend: function(xhr){
                    xhr.setRequestHeader('x-client',   clientId);
                },
            success: fetchContentSuccess,
            error: fetchFailure
        });

        // fetch tavern-specific content
        $.ajax({
            url: serverUrl + serverPathTavern,
            type: 'GET',
            dataType: 'json',
            cache: false,
            beforeSend: function(xhr){
                    xhr.setRequestHeader('x-client',   clientId);
                    xhr.setRequestHeader('x-api-user', userId);
                    xhr.setRequestHeader('x-api-key',  apiToken);
                },
            success: fetchTavernSuccess,
            error: fetchFailure,
        });

        // fetch party-specific content
        $.ajax({
            url: serverUrl + serverPathParty,
            type: 'GET',
            dataType: 'json',
            cache: false,
            beforeSend: function(xhr){
                    xhr.setRequestHeader('x-client',   clientId);
                    xhr.setRequestHeader('x-api-user', userId);
                    xhr.setRequestHeader('x-api-key',  apiToken);
                },
            success: fetchPartySuccess,
            error: function() { // assume no party
                party = {}; // no party
                ajaxRunningCount--;
                if (ajaxRunningCount === 0) { // all ajax calls have finished
                    parseData();
                }
            },
        });

    }


    function fetchFailure(jqXHR, textStatus, errorThrown) {
        $("#dataFetchResults").append(jqXHR.responseJSON.message);
        console.log("Fetch Failure");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    }
    function fetchContentSuccess(data) {
        if (debug) console.log('debug parseData Content success start');
        content = data.data;
        ajaxRunningCount--;
        if (ajaxRunningCount === 0) { // all ajax calls have finished
            parseData();
        }
    }
    function fetchTavernSuccess(data) {
        if (debug) console.log('debug parseData Tavern success start');
        tavern = data.data; // XXX_LATER test for world boss
        ajaxRunningCount--;
        if (ajaxRunningCount === 0) { // all ajax calls have finished
            parseData();
        }
    }
    function fetchPartySuccess(data) {
        if (debug) console.log('debug parseData Party success start');
        party = data.data;
        ajaxRunningCount--;
        if (ajaxRunningCount === 0) { // all ajax calls have finished
            parseData();
        }
    }
    function fetchUserSuccess(data) {
        if (debug) console.log('debug parseData User success start');
        user = data.data;
        ajaxRunningCount--;
        if (ajaxRunningCount === 0) { // all ajax calls have finished
            parseData();
        }
    }
    function fetchTasksSuccess(data) {
        if (debug) console.log('debug parseData Tasks success start');
        tasksFromDb = data.data;
        ajaxRunningCount--;
        if (ajaxRunningCount === 0) { // all ajax calls have finished
            parseData();
        }
    }
    function fetchCompletedTodosSuccess(data) {
        if (debug) console.log('debug parseData CompletedTodos success start');
        completedTodosFromDb = data.data;
        ajaxRunningCount--;
        if (ajaxRunningCount === 0) { // all ajax calls have finished
            parseData();
        }
    }
    function parseData(){
        let taskOrderList = user.tasksOrder.todos;
        let topThreeTasks = taskOrderList.slice(0,3);
        jQuery.each(tasksFromDb, function(i, task) {
            if(topThreeTasks.includes(task.id)){
                activeTasks.push(task);
            }
            else{
                acceptedTasks.push(task);
            }
        });
        $("#habiticaFetchForm").hide();
        setMenuFunctions();
        showActiveQuests();
        $("#menu").show();
        $("#content").show();
    }
}

