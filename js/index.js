
var fs = require('fs');

function uploadText(){

   $('#uploadFile').trigger('click');
   $('#uploadFile').on('change',function(){
         
         var file = document.getElementById('uploadFile').files[0];
         var all   = $.when(file);
         all.done(function(){
      
         if (file) {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(e) {
            textProcess(e.target.result);
          };
        }
    });
  });

}

var URL = window.URL || window.webkitURL
var displayMessage = function (message, isError) {
    alert("Can't play this file");
   }

function addVideo(){
  
    $('#uploadVideo').trigger('click');
    $('#uploadVideo').on('change',function(){
     
          var file = this.files[0]
          var type = file.type
          var videoNode = document.getElementById('video')
          var canPlay = videoNode.canPlayType(type)
          if (canPlay === '') canPlay = 'no'
          var message = 'Can play type "' + type + '": ' + canPlay
          var isError = canPlay === 'no'
          //displayMessage(message, isError)

          if (isError) {
            return
          }
          var fileURL = URL.createObjectURL(file)
          videoNode.src = fileURL;
  });   
}

function updateTime(event){
            var showTime=document.getElementById("showTime");
            showTime.innerHTML=event.currentTime;
          };

function drawTimeLine(videoNode){
    var length=videoNode.duration;

    var canvas = document.getElementById('timeCanvas'),
    ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var x = 3,
        y = 3,
        w = 2,
        h = 40;
    var vx = 0.1;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      x += vx;
      ctx.fillRect(x, y, w, h);
    }setInterval(draw,length);

}

function textProcess(file){
    var parentNode=document.getElementById("contentDiv");
    if(parentNode.hasChildNodes()){
      parentNode.innerHTML="";
    }
    var splited=file.replace(/(\.+|\:|\!|\?|\!|\;|\,)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|"); 
    var i=0;
    for(;i<splited.length;i++){
        
        parentNode.appendChild(createTextElement(splited[i]));
  }
}



function deleteText(){
  var thisText=document.getElementsByClassName("li-selected");
  var parentNode=thisText[0].parentNode;
  parentNode.removeChild(thisText[0]);
  

}
function editText(){
  var thisLi=document.getElementsByClassName("li-selected");
  var thisText=thisLi[0].children[2];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
          } 
        }
}
function editStartTime(){
  var thisLi=document.getElementsByClassName("li-selected");
  var thisText=thisLi[0].children[0];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
          } 
        }
}

function editEndTime(){
  var thisLi=document.getElementsByClassName("ui-selected");
  var thisText=thisLi[0].children[1];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
          } 
        }
}


function createTextElement(text){

        var liLiNode=document.createElement("div");
        var startTimeNode=document.createElement("p");
        var startTimeHide=document.createElement("span");
        var endTimeNode=document.createElement("p");
        var endTimeHide=document.createElement("span");
        var textNode=document.createElement("p");

        textNode.innerHTML=text;
        textNode.className="textNode";
        liLiNode.className="oneline";
        startTimeNode.className="startTimeNode";
        endTimeNode.className="endTimeNode";
        startTimeNode.onclick=function(){
            
              if(video.paused==false){
                startTimeHide.innerText=video.currentTime;
                var startTime= timeProcess(video.currentTime);
                    this.innerText=startTime;
              }else{
                  video.currentTime=startTimeHide.innerText;
              }
        };
        endTimeNode.onclick=function(){
         
              if(video.paused==false){
                 endTimeHide.innerText=video.currentTime;
                  var endTime= timeProcess(video.currentTime);
                    this.innerText=endTime;
               }else{
                  video.currentTime=endTimeHide.innerText;
               }
        };
        startTimeNode.innerHTML="00:00:00.000";
        endTimeNode.innerHTML="00:00:00.000"
        startTimeHide.hidden=true;
        endTimeHide.hidden=true;
        liLiNode.appendChild(startTimeNode);
        liLiNode.appendChild(endTimeNode);
        liLiNode.appendChild(textNode);
        
        return liLiNode;
        
}
function timeProcess(time){
    if(time==0){
      time="0.0"
    }
    var strings=time.toString().split(".");
    var left=strings[0];
    var right=strings[1].substring(0,3);
    var hourString="00";
    var minuteStirng="00";
    var secondString="00";
    var rightStirng="000";

    var hours=0;
    var minutes=0;
    var seconds=0;
    if(left>60){
      hours=left/3600;
      var reminder=left-hours*3600;
      minutes=reminder/60;
      reminder=reminder-minutes*60;
      seconds=reminder;
    }else{
      seconds=left;
    }
    if(hours!=0){
        if(hours>=10){
          hourString=hours;
        }else{
          hourString="0"+hours;
        }
    }
    if(minutes!=0){
      if(minutes>10){
        minuteStirng=minutes;
      }else{
        minuteStirng="0"+minutes;
      }
    }
    if(seconds!=0){
      if(seconds>=10){
        secondString=seconds;
      }else{
        secondString="0"+seconds;
      }
    }
    if(right<100){
        if(right<10){
          rightStirng=right+"00";
        }else{
          rightStirng=right+"0";
        }
    }else{
      rightStirng=right;
    }
    time=hourString+":"+minuteStirng+":"+secondString+"."+rightStirng;
    return time;
}


function addLine(){

   var parentNode=document.getElementById("contentDiv");
   var thisLi=document.getElementsByClassName("li-selected");
   if(thisLi.length!=0){
    parentNode.insertBefore(createTextElement(" "), thisLi[0]);
   }else{
    parentNode.appendChild(createTextElement(" "));
   }
   
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function preview(){

  var parentNode=document.getElementById("contentDiv");
  var nodeList=parentNode.childNodes;
  var i=0;

  var startString="WEBVTT FILE"+"\n \n";

  for(;i<nodeList.length;i++){
    var startTime=nodeList[i].children[0].innerText;
    var endTime=nodeList[i].children[1].innerText;
    var text=nodeList[i].children[2].innerText;
    
    var string=startTime+"-->"+endTime+"\n"+text+"\n";
    startString=startString+string;
  }
  fs.writeFile("test.vtt", startString, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 
  var videoParent=document.getElementById("video");
  var newTrack=document.createElement("track");
  newTrack.src="test.vtt";
  newTrack.kind="subtitiles";
  newTrack.srclang="en";
  newTrack.lable="English";
  videoParent.appendChild(newTrack);
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {

  console.log(event.target);

  if (!event.target.matches('#edit')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  if(!event.target.matches(".oneline")&&
    !event.target.matches("#edit")&&
    !event.target.matches("#de lete")&&
    !event.target.matches("#addText")){

   $(".li-selected").removeClass("li-selected");
  }
 
 if(event.target.matches(".startTimeNode")
  ||event.target.matches(".endTimeNode")
  ||event.target.matches(".textNode")){
    if($(".li-selected")){
      $(".li-selected").removeClass("li-selected");
    }
     var parentNode=event.target.parentNode;
     parentNode.className+=" li-selected";
     
 }


}




