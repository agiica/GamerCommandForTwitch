let messageArray = [];
let percent = [];
let username = [];
let botName;
let command;
let minValue;
let maxValue;

function show() {  
  console.log("show");
  let pic = $("#pic");
  let i;
  
  for (i = 0; i < percent.length; i++) {
    if (percent[i] <= minValue) {
      pic.attr('src', '{{minImage}}');  
      document.getElementById("titleText").textContent="Napi noob";
      document.getElementById("userText").textContent=username[i].toString() + " // " + percent[i] + "%";
    } else {
      pic.attr('src', '{{maxImage}}');
      document.getElementById("titleText").textContent="Napi gamer";
      document.getElementById("userText").textContent=username[i].toString() + " // " + percent[i] + "%";
    }
    setTimeout(hide,5000);
  }
}

function hide() {
  console.log("hide");
  let pic = $("#pic");
  pic.attr('src', '');
  document.getElementById("titleText").textContent="";
  document.getElementById("userText").textContent="";
}


window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj["detail"]["fieldData"];
  botName = fieldData["botName"].toLowerCase();
  command = fieldData["command"].toLowerCase();
  minValue = fieldData["minValue"];
  maxValue = fieldData["maxValue"];
  
  setInterval(show, (fieldData["period"] * 1000));
});

window.addEventListener('onEventReceived', function (obj) {
  if (obj.detail.listener !== 'message') return;
  let data = obj.detail.event.data;
  let temp;
  let idx;

  if (data['nick'].toLowerCase() != botName) return;
  messageArray = data['text'].toLowerCase().split(" ",3);

  if ((messageArray.length < 3)) return;
  if (!(messageArray[2].includes(command))) return;
  temp = messageArray[1].match(/(\d+)/);
  
  if ((temp[0] <= minValue) || (temp[0] >= maxValue)) {
    idx = username.indexOf(messageArray[0].toString());
    if ( idx == -1 ){
      percent.push(temp[0]);
      username.push(messageArray[0].toString());
    } else {
      percent[idx] = temp[0];
      username[idx] = messageArray[0].toString();
    }
  }  
});