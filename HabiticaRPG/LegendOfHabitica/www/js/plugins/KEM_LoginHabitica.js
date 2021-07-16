function logIn(){
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
	console.log(username+","+password);
	//fetchLogInData(username,password);
   document.getElementById('outputDiv').innerHTML=username+","+password;
}
function createLogInDisplay(){
    var styles = `
    body {
        background-color:#5B30A9;
        color: white;
        font-family: sans-serif;
    }
    input[type="text"],[type="password"] {
        background-color : #432874; 
        color: white;
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 0px solid #ccc;
        box-sizing: border-box;
    }
    input[type=button] {
        width: 100%;
        background-color: #46A7D9;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight:bold;
    }

    input[type=button]:hover {
        background-color: #68B3D8;
    }
    label{
        font-weight:bold;
        color:white;
    }
    `
    //other purple: 6f42c1
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    var header= document.createElement("h1");
    header.innerHTML="Log In to Habitica";

    var div = document.createElement("div");
    div.setAttribute('id','logInForm');
    div.innerHTML='<form>'+
    '<label for="username">Email or Username (case-sensitive)</label><br>'+
    '<input type="text" id="username" name="username"><br>'+
    '<label for="password">Password</label><br>'+
    '<input type="password" id="password" name="password"><br><br>'+
    '<input type="button" onclick="logIn()" value="Log In">'+
    '</form> ';
    //and some more input elements here
    //and dont forget to add a submit button
    var outputDiv = document.createElement("div");
    outputDiv.setAttribute('id','outputDiv');
	
	var field = document.createElement('div');
    field.id = 'field_1';
    field.style.position = 'absolute';
    field.style.left = '0';
    field.style.top = '0';
    field.style.right = '0';
    field.style.bottom = '0';
    field.style.width = '100%';
    field.style.height = '100%';
    field.style.zIndex = "0";
    field.style.display = "none"; // there is a bug occurs in nwjs 0.33.4
	
	field.appendChild(header);
	field.appendChild(div);
	field.appendChild(outputDiv);
    document.body.appendChild(field);
}