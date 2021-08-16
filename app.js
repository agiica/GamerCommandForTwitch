let messageArray = [];
let percent = [];
let username = [];
let botName, command, minText, minValue, maxText, maxValue, debugOption, showFor, pic, animationIn, animationOut;
const titleBox = document.getElementById("titleText");
const userBox = document.getElementById("userText");
const picContainer = document.getElementById("all");

function fadeIn(el, time) {
  el.style.opacity = 0;

  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / time;
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
  };

  tick();
}

function fadeOut(fadeTarget, time) {
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.05;
    } else {
      clearInterval(fadeEffect);
    }
  }, time);
}

function debugFunc() {
  console.log("debug");
  picContainer.style.visibility = "visible";
  fadeIn(picContainer, 1000);
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

function show() {  
  console.log("show");
  let idx, length;
  length = percent.length;
  picContainer.style.visibility = "visible";
  fadeIn(picContainer, 1000);
  for (idx = 0; idx < length; idx++) {
    if (percent[idx] <= minValue) {
      pic.attr('src', '{{minImage}}');
      titleBox.textContent=minText;
      userBox.textContent=username[idx].toString() + " // " + percent[idx] + "%";
    } else {
      pic.attr('src', '{{maxImage}}');
      titleBox.textContent=maxText;
      userBox.textContent=username[idx].toString() + " // " + percent[idx] + "%";
    }
    setTimeout(hide,showFor*1000);
  }
}

function hide() {
  console.log("hide");
  fadeOut(picContainer, 50);
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
  animationIn = fieldData["animationIn"];
  animationOut = fieldData["animationOut"];
  pic = $("#pic");
  picContainer.style.visibility = "hidden";
  
  if (debugOption == "off") {
    setInterval(show, (fieldData["period"] * 1000));
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
