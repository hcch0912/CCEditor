/*Access file system*/
var fs = require('fs');
const {dialog} = require('electron').remote;

 var  video=document.getElementById("video");
      track = video.addTextTrack("captions", "English", "en");
      track.mode="showing";

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
     updateSetting(getCurrentCue());
 }

 if(event.target.matches(".startTimeNode")){
    var cue=getCurrentCue();
    if(cue){
        if(video.paused==false){
           event.target.innerText= timeProcess(video.currentTime);
          cue.startTime=video.currentTime;
        }else{
           video.currentTime=reverseTime(event.target.innerText);
        }
    }
 }
 if(event.target.matches(".endTimeNode")){
    var cue=getCurrentCue();
    if(cue){
        if(video.paused==false){
           event.target.innerText= timeProcess(video.currentTime);
          cue.endTime=video.currentTime;
        }else{
           video.currentTime=reverseTime(event.target.innerText);
        }
    }
}

}

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




/* transform formatted time to seconds*/
function reverseTime(time){
    var timeArr=time.split(":");
    var right=timeArr[2].split(".")[1];
    var second=timeArr[2].split(".")[0];
    time=timeArr[0]*3600+timeArr[1]*60+second+"."+right;
    return time;
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

/*Delete selected Text line */
function deleteText(){

  var thisLi=$(".oneline.li-selected");
  track.removeCue(getCurrentCue());
  thisLi.remove();
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
            var cue=getCurrentCue();
             if(cue.text.match("<")){
                var text=cue.text.match("(?=>).*(?=<)").substring(1);
                var prefix=cue.text.split(text)[0];
                var postfix=cue.text.split(text)[2];
                cue.text=prefix+thisText.innerText+postfix;
              }else{
                cue.text=thisText.innerText
              }
            initialize_test();
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
            var cue=getCurrentCue();
            cue.startTime=reverseTime(thisText.innerText);
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
            var cue=getCurrentCue();
            cue.endTime=reverseTime(thisText.innerText);
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
}

/*Add a new line to the container*/
function addLine(){

   var parentNode=document.getElementById("contentDiv");
   var thisLi=document.getElementsByClassName("li-selected");
    parentNode.appendChild(createTextElement("00:00:00.000","00:00:00.000"," "," "));
    var cue=new VTTCue(0,0,"");
    cue.id=track.cues.length;
    track.addCue(cue);
    initialize_test();
}




/*Utility functions*/

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
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
/*selectable*/
$('#contentDiv').nuSelectable({
  items: '.oneline',
  selectionClass: 'nu-selection-box',
  selectedClass: 'li-selected',
  autoRefresh: true
});