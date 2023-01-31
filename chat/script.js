// PS! Replace this with your own channel ID
// If you use this channel ID your app will stop working in the future
const CLIENT_ID = 'm3BAnyjnCGqgWZye';
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
  if (name == null) {
	name=prompt("what is your username?");
	document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	  
  }
  document.cookie="name="+name+"; expires=Thu, 18 Dec 9013 12:00:00 UTC"; 	  
  return name;
}

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
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
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
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
(function(){var me=document.createElement('div');var body=document.getElementsByTagName('body')[0];body.appendChild(me);me.style.position='fixed';me.style.bottom='0px';me.style.left='0px';me.style.margin='10px';me.style.paddingTop='15px';me.style.width='50px';me.style.height='50px';me.style.zIndex=10000;me.style.opacity=0.8;me.style.color='white';me.style.backgroundColor='black';me.style.border='0px solid black';me.style.textAlign='center';me.style.cursor='pointer';me.id='me';me.style.display='circle';me.innerText='username change-in progress';document.getElementById('me').addEventListener('click',function(){getRandomName();});}());
