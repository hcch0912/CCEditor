/*Access file system*/
var fs = require('fs');
const {dialog} = require('electron').remote;

 var  video=document.getElementById("video");
        track = video.addTextTrack("captions", "English", "en");
        track.mode="showing";


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
  initialize_test();
}

 /*process vTT file*/
function textProcessVTT(file){
  var parentNode=document.getElementById("contentDiv");
  if(parentNode.hasChildNodes()){
      parentNode.innerHTML="";
  }
  var splited=file.split("\n\n");
  var i=0;
  var commentTemp;

  for(;i<splited.length;i++){
    if(!splited[i].match("WEBVTT")&&!splited[i].match("STYLE")){
        var comment;
        var startTime;
        var endTime;
        var text;
        if(splited[i].match("NOTE")){
            commentTemp=splited[i].substring(splited[i].indexOf("NOTE")+4);
        }else{
          if(!splited[i].match("line")&&!splited[i].match("position")){
            //TODO attributes
              var a=splited[i].indexOf("-->");
              startTime=splited[i].substring(0,a);
              endTime=splited[i].substring(a+3,a+15);
              text=splited[i].substring(a+16);
              parentNode.appendChild(createTextElement(startTime,endTime,text,commentTemp));
              //add cue element to DOM
              //track.addCue(new VTTCue(reverseTime(startTime),reverseTime(endTime),text));
              initialize_test();
          }
        }
       
     }
  }
  
}
/* transform formatted time to seconds*/
function reverseTime(time){
    var timeArr=time.split(":");
    var right=timeArr[2].split(".")[1];
    var second=timeArr[2].split(".")[0];
    time=timeArr[0]*3600+timeArr[1]*60+second+"."+right;
    return time;
}


function createTextElement(startTime,endTime,text,comment){

        var liLiNode=document.createElement("div");
        var startTimeNode=document.createElement("p");
        var endTimeNode=document.createElement("p");
        var textNode=document.createElement("p");
        var commentNode=document.createElement("p");

        textNode.innerHTML=text;
        textNode.className="textNode";
        liLiNode.className="oneline";
        startTimeNode.className="startTimeNode";
        endTimeNode.className="endTimeNode";
        commentNode.className="commentNode"
        startTimeNode.onclick=function(){
               if($(".li-selected")){
                  $(".li-selected").removeClass("li-selected");
                }
                 var parentNode=this.parentNode;
                 parentNode.className+=" li-selected";
                  //console.log(this.innerText);
              if(video.paused==false){
                    this.innerText= timeProcess(video.currentTime);
                    var cue=getCurrentCue();
                    //console.log(cue.text);
                    cue.startTime=video.currentTime;
                    //console.log("start"+cue.startTime);
              }else{
                    video.currentTime=reverseTime(startTimeNode.innerText);

              }
        };
        endTimeNode.onclick=function(){
                if($(".li-selected")){
                  $(".li-selected").removeClass("li-selected");
                }
                 var parentNode=this.parentNode;
                 parentNode.className+=" li-selected";
                 console.log(this.innerText);
               if(video.paused==false){
                    this.innerText=timeProcess(video.currentTime);
                    var cue=getCurrentCue();
                    console.log(cue.text);
                    cue.endTime=video.currentTime;
                     console.log("end"+cue.endTime);
               }else{
                    video.currentTime=reverseTime(endTimeNode.innerText);
                    //console.log("start"+cue.endTime);
                    //var cue=getCurrentCue();
                    //cue.endTime=video.currentTime;
               }
        };
        startTimeNode.innerHTML=startTime;
        endTimeNode.innerHTML=endTime;
        commentNode.innerHTML=comment;
        liLiNode.appendChild(startTimeNode);
        liLiNode.appendChild(endTimeNode);
        liLiNode.appendChild(textNode);
        liLiNode.appendChild(commentNode);
        track.addCue(new VTTCue(reverseTime(startTime),reverseTime(endTime),text));
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
  //initialize_test();
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
            var LiLines=$(".oneline");
            var thisLi=$(".oneline.li-selected");
            var index=LiLines.index(thisLi);
            var track = video.textTracks[1];
            var cue = track.cues[index];
            var prefix;
            var postfix="</c>";
             if(cue.text.match("c.")){
               prefix=cue.text.substring(0,cue.text.indexOf(">")+1);
              }
            cue.text=prefix+thisText.innerText+postfix;
            initialize_test(cue);
          } 
        }
}
/*Edit selected line start time */
function editStartTime(){
  var thisLi=document.getElementsByClassName("li-selected");
  var thisText=thisLi[0].children[0];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  initialize_test();
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
  initialize_test();
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
          } 
        }
}
/*Edit comment*/
function editComment(){
  var thisLi=document.getElementsByClassName("li-selected");
  var thisText=thisLi[0].children[3];
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  initialize_test();
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


function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
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

   
window.onclick = function(event) {

 
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
    !event.target.matches("#delete")&&
    !event.target.matches("#addText")&&
    !event.target.matches(".selectee")){

   $(".li-selected").removeClass("li-selected");
  }
 
 if(event.target.matches(".startTimeNode")
  ||event.target.matches(".endTimeNode")
  ||event.target.matches(".textNode")
  ||event.target.matches(".commentNode")){
    if($(".li-selected")){
      $(".li-selected").removeClass("li-selected");
    }
     var parentNode=event.target.parentNode;
     parentNode.className+=" li-selected";

 }

}



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



/*extra content in container and make it vtt file format*/
function extraText(){
  var parentNode=document.getElementById("contentDiv");
  var track = video.textTracks[1];
  var nodeList=parentNode.childNodes;
  var i=0;

  var startString="WEBVTT FILE"+"\n \n";
  for(;i<track.cues.length;i++){

    var startTime=track.cues[i].startTime;
    var endTime=track.cues[i].endTime;
    var text=track.cues[i].text;
    var line=track.cues[i].line;
    var position=track.cues[i].position;
    var comment=nodeList[i].children[3].innerText;
    // if(style){
    //   text=style+text+"</c>"
    // }
    var string="\nNOTE "+comment+"\n\n"
                +startTime+"-->"+endTime+" line:"+line+" position:"+position+"\n"
                +text+"\n";
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