let messageArray = [];
let percent = [];
let username = [];
let botName, command, minText, minValue, maxText, maxValue, debugOption, showFor, pic, timer, index;
const titleBox = document.getElementById("titleText");
const userBox = document.getElementById("userText");
var container = document.getElementById('all');

function hideAll() { 
  $("div").fadeOut(); 
  index += 1;
  setTimeout(show, 500);
}
function showAll() { $("div").fadeIn(); }

function debugFunc() {
  console.log("debug1");
  
  showAll();
  
  if (debugOption == "min") {
    pic.attr('src', '{{minImage}}'); 
    titleBox.textContent=minText;
    userBox.textContent="vakesz // 1%";
  }
  if (debugOption == "max") {
    pic.attr('src', '{{maxImage}}');
    titleBox.textContent=maxText;
    userBox.textContent="Agi // 100%";
  }
}

function show () {  
  console.log("show " + index);
  
  if ( percent.length > 0 && index < percent.length) {
    console.log("bent");
    showAll();
    showData();
    
  	setTimeout(hideAll, showFor * 1000);
  } else {
    index = 0;
  }
}
  
function showData () {
  if (percent[index] <= minValue) {
    pic.attr('src', '{{minImage}}');
    titleBox.textContent=minText;
    userBox.textContent=username[index].toString() + " // " + percent[index] + "%";
  } else {
    pic.attr('src', '{{maxImage}}');
    titleBox.textContent=maxText;
    userBox.textContent=username[index].toString() + " // " + percent[index] + "%";
  }
}

window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj["detail"]["fieldData"];
  botName = fieldData["botName"].toLowerCase();
  command = fieldData["command"].toLowerCase();
  minValue = fieldData["minValue"];
  minText = fieldData["fontText"];
  maxValue = fieldData["maxValue"];
  maxText = fieldData["titleText"];
  debugOption = fieldData["debugOption"];
  showFor = fieldData["showFor"];
  pic = $("#pic");
  
  $("div").hide();
  index = 0;
  if (debugOption == "off") {
    timer = setInterval(show, (fieldData["period"] * 1000));
  } else {
    debugFunc();
  }
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
