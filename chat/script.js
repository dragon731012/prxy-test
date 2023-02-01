// PS! Replace this with your own channel ID
// If you use this channel ID your app will stop working in the future
const CLIENT_ID = 'm3BAnyjnCGqgWZye';
const banlist=["bannednametest123456"];
const adminlist=["Matteo","Chickin_Butt"];
function get_cookie(cookie_name) { const value = "; " + document.cookie; const parts = value.split("; " + cookie_name + "="); if (parts.length === 2) return parts.pop().split(";").shift(); }
const drone = new ScaleDrone(CLIENT_ID, {
  data: { // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on('close', event => {
  console.log('Connection was closed', event);
});

drone.on('error', error => {
  console.error(error);
});

function getRandomName() {
    var name=get_cookie("name");
    var banned=banlist.includes(name);
    if (banned==true){
	document.cookie="banned=yes; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	  
  }
   else{	
	   document.cookie="banned=no; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	  
   }
  var bannedcookie=get_cookie("banned");
  if (bannedcookie=="yes"){
        history.back();
        function spam(){
            alert("you have been banned.");
        }
        setInterval(spam,5);
  }
  else{
	  var change=prompt("do you want to change your username? 0=no 1=yes");
	  if (change==0){
		  var name=get_cookie("name");
		
		  if (name == null) {
			name=prompt("what is your new username?");
			    var admin=adminlist.includes(name);
			    if (admin==true){
				var try1=prompt("what is the password for this account?");
				var pass="thisisagreatpassword12130183113098313108913098313113293923";
				if (try1==pass){
					name="admin: "+name;
				} 
			    }
			    else{
				name="member: "+name;
			    }
		  }
		  document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	
		  var admin=adminlist.includes(name);
		    if (admin==true){
			document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	
			name="admin: "+name;
		    } 
		    else{
			document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	
			name="member: "+name;
		    }
		  return name;
	  }
	  if (change==1){
	    name=prompt("what is your new username?");
            var admin=adminlist.includes(name);
  	    if (admin==true){
		var try1=prompt("what is the password for this account?");
		var pass="thisisagreatpassword12130183113098313108913098313113293923";
		if (try1==pass){
			document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	
	    		name="admin: "+name;
		} 
	    }
	    else{
		document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	
	    	name="member: "+name;
	    }
	    return name;
	  }
	}
}

function getRandomColor() {
  var name=get_cookie("name");
  var admin=adminlist.includes(name);
  if (admin==true){
	  return '#0000FF';
  }
  return '#808080';
}

//------------- DOM STUFF

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
  const swearlist=["sex","fuck","bitch","balls","cock","penis","porn","ass","dumbass","retard","cubs","pussy","segs","puusy","cub","dickhead","dick"];
  const value = DOM.input.value;
  const hasWord = (str, word) => 
  	str.replace(/[ .,\/#!$%\^&\*@;:{}=\-_`~()]/g,"").split(/\s+/).includes(word);
  
  var x=0;
  var xmax=17;
  var swearing=false;
  while (x<xmax){
  	var swear=hasWord(value,swearlist[x]);
	if (swear==true){
		alert("no swearing or bad words!");
		x=xmax;
		swearing=true;
	}
	x=x+1;
  }

  if (swearing != true){
	  if (value === '') {
	    return;
	  }
	  DOM.input.value = '';
	  drone.publish({
	    room: 'observable-room',
	    message: value,
	  });
  }
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}
