/*Access file system*/
var fs = require('fs');
const {dialog} = require('electron').remote;

/*upload Txt into container panel*/

function uploadText(){

   $('#uploadFile').trigger('click');
   $('#uploadFile').on('change',function(){
         
         var file = document.getElementById('uploadFile').files[0];
         var all   = $.when(file);
         all.done(function(){
      
         if (file) {

          var reader = new FileReader();
          reader.readAsText(file);
          if(file.name.match("vtt")){
            reader.onload = function(e) {
              textProcessVTT(e.target.result);
           }
                
           }else if(file.name.match("txt")){
            reader.onload = function(e) {
              textProcess(e.target.result);
           }
          };
        }
    });
  });
}

/* preprocess the text file to split the text by sentences*/

function textProcess(file){
  var parentNode=document.getElementById("contentDiv");
  if(parentNode.hasChildNodes()){
      parentNode.innerHTML="";
    }
  var splited=file.replace(/(\.+|\:|\!|\?|\!|\;|\,)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|"); 
  var i=0;
  for(;i<splited.length;i++){
        parentNode.appendChild(createTextElement("00:00:00.000","00:00:00.000",splited[i],""));
  }
}

function textProcessVTT(file){
  var parentNode=document.getElementById("contentDiv");
  if(parentNode.hasChildNodes()){
      parentNode.innerHTML="";
  }
  var splited=file.split("\n\n");
  var i=0;
  var commentTemp;
  var  video=document.getElementById("video");
        track = video.addTextTrack("captions", "English", "en");
        track.mode="showing";
  for(;i<splited.length;i++){
    if(!splited[i].match("WEBVTT")&&!splited[i].match("STYLE")){
        var comment;
        var startTime;
        var endTime;
        var text;
        if(splited[i].match("NOTE")){
            commentTemp=splited[i].substring(splited[i].indexOf("NOTE")+4);
        }else{

         var a=splited[i].indexOf("-->");
         startTime=splited[i].substring(0,a);
         endTime=splited[i].substring(a+3,a+15);
         text=splited[i].substring(a+16);
         parentNode.appendChild(createTextElement(startTime,endTime,text,commentTemp));

         track.addCue(new VTTCue(startTime.substring(startTime.length-6),endTime.substring(endTime.length-6),text));

        }
       
     }
  }
  
}
function createTextElement(startTime,endTime,text,comment){
        var liLiNode=document.createElement("div");
        var startTimeNode=document.createElement("p");
        var startTimeHide=document.createElement("span");
        var endTimeNode=document.createElement("p");
        var endTimeHide=document.createElement("span");
        var textNode=document.createElement("p");
        var textHide=document.createElement("span");
        var commentNode=document.createElement("p");

        textNode.innerHTML=text;
        textNode.className="textNode";
        liLiNode.className="oneline";
        startTimeNode.className="startTimeNode";
        endTimeNode.className="endTimeNode";
        commentNode.className="commentNode"
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
        startTimeNode.innerHTML=startTime;
        endTimeNode.innerHTML=endTime;
        startTimeHide.hidden=true;
        endTimeHide.hidden=true;
        textHide.hidden=true;
        commentNode.innerHTML=comment;
        liLiNode.appendChild(startTimeNode);
        liLiNode.appendChild(startTimeHide);
        liLiNode.appendChild(endTimeNode);
        liLiNode.appendChild(endTimeHide);
        liLiNode.appendChild(textNode);
        liLiNode.appendChild(textHide);
        liLiNode.appendChild(commentNode);
        
        return liLiNode;
        
}
/*add video to the page and alter error if the file is not playable*/
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

/*Delete selected Text line */
function deleteText(){
  var thisText=document.getElementsByClassName("li-selected");
  var parentNode=thisText[0].parentNode;
  parentNode.removeChild(thisText[0]);
  

}
/*Edit selected Text line */
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
/*Edit selected line start time */
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
/*Edit selected line end time */
function editEndTime(){
  var thisLi=document.getElementsByClassName("li-selected");
  var thisText=thisLi[0].children[1];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
          } 
        }
}
/*Edit comment*/
function editComment(){
  var thisLi=document.getElementsByClassName("li-selected");
  var thisText=thisLi[0].children[6];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
}

/*Add a new line to the container*/
function addLine(){

   var parentNode=document.getElementById("contentDiv");
   var thisLi=document.getElementsByClassName("li-selected");
   if(thisLi.length!=0){
    parentNode.insertBefore(createTextElement(" "), thisLi[0]);
   }else{
    parentNode.appendChild(createTextElement(" "));
   }
   
}

/*save the text and time into VTT file and add to the video */
function preview(){

  fs.writeFile("test.vtt", extraText(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  }); 
  var videoParent=document.getElementById("video");
  var newTrack=document.createElement("track");
  newTrack.src="test.vtt";
  newTrack.kind="captions";
  newTrack.srclang="en";
  newTrack.lable="English";
  videoParent.appendChild(newTrack);
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}


window.onclick = function(event) {

  console.log(event.target);
  // Close the dropdown if the user clicks outside of it
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
  // Unselecte the line if the user clicks outside of all line elements
  if(!event.target.matches(".oneline")&&
    !event.target.matches("#edit")&&
    !event.target.matches("#de lete")&&
    !event.target.matches("#addText")&&
    !event.target.matches(".selectee")){

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

function saveFile(){

   dialog.showSaveDialog(function (fileName) {
    if (fileName === undefined) return;
    fs.writeFile(fileName,extraText(), function (err) { 
        if (err === undefined) {
           dialog.showMessageBox({ message: "The file has been saved! :-)",
            buttons: ["OK"] });
         } else {
           dialog.showErrorBox("File Save Error", err.message);
         }  
    });
  });
}

function editStyle(){
   $("#setting").removeClass("settingDisabled");
}

function saveEditing(){
   var thisLi=document.getElementsByClassName("li-selected");

   var eColor = document.getElementById("color");
   var selectedColor= eColor.options[eColor.selectedIndex].text;
   var eFont = document.getElementById("font");
   var selectedFont= eFont.options[eFont.selectedIndex].text;
   var eSize = document.getElementById("size");
   var selectedSize= eSize.options[eSize.selectedIndex].text;
   var ePosition = document.getElementById("position");
   var selectedPosition= ePosition.options[ePosition.selectedIndex].text;

   thisLi[0].children[5].innerText="<c."+
                              selectedColor+"."
                              +selectedFont+".size"+
                              +selectedSize+
                              ">";
   $("#setting").addClass("settingDisabled");
}

/*Utilitied functions */


/*transform the time in seconds into the format that VTT file needs*/
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

/*create a new line Element*/

/*extra content in container and make it vtt file format*/
function extraText(){
  var parentNode=document.getElementById("contentDiv");
  var nodeList=parentNode.childNodes;
  var i=0;

  var startString="WEBVTT FILE"+"\n \n";
  for(;i<nodeList.length;i++){
    var startTime=nodeList[i].children[0].innerText;
    var endTime=nodeList[i].children[2].innerText;
    var text=nodeList[i].children[4].innerText;
    var style=nodeList[i].children[5].innerText;
    var comment=nodeList[i].children[6].innerText;
    if(style){
      text=style+text+"</c>"
    }
    var string="\nNOTE "+comment+"\n\n"+startTime+"-->"+endTime+"\n"+text+"\n";
    startString=startString+string;
  }
  return startString;
}
/*When click the edit button,place the caret to the end of the text element */
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

$('#contentDiv').nuSelectable({
  items: '.oneline',
  selectionClass: 'nu-selection-box',
  selectedClass: 'li-selected',
  autoRefresh: true

});