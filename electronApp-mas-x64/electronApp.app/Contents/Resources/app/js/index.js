


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
      console.log("here");
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
    var parentNode=document.getElementById("selectable");
    if(parentNode.hasChildNodes()){
      parentNode.innerHTML="";
    }
    var splited=file.replace(/(\.+|\:|\!|\?|\!|\;|\,)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|"); 
    var i=0;
    for(;i<splited.length;i++){
        
        parentNode.appendChild(createTextElement(splited[i]));
  }
}

$(function() {
    $( "#selectable" ).selectable();
  });



function deleteText(){
  var thisText=document.getElementsByClassName("ui-selected");
  var parentNode=thisText[0].parentNode;
  parentNode.removeChild(thisText[0]);
  

}
function editText(){
  var thisLi=document.getElementsByClassName("ui-selected");
  var thisText=thisLi[0].lastElementChild;
  thisText.setAttribute("contenteditable","true");
  placeCaretAtEnd( thisText );
  thisText.onkeypress=function(){
          if(this.onkeypress.arguments[0].charCode == 13){
            this.setAttribute("contenteditable","false");
          } 
        }
}

function createTextElement(text){

        var liLiNode=document.createElement("li");
        var timeNode=document.createElement("p");
        var textNode=document.createElement("p");

        textNode.innerHTML=text;
        textNode.className="textNode";
        liLiNode.className="ui-widget-content";
     
        timeNode.className="timeNode";
        timeNode.innerHTML="00:00:00.000 --> 00:00:00.000";
        liLiNode.appendChild(timeNode);
        liLiNode.appendChild(textNode);
        return liLiNode;
        
}

function addText(){
   var parentNode=document.getElementById("selectable");
   var thisLi=document.getElementsByClassName("ui-selected");
   if(thisLi.length!=0){
    parentNode.insertBefore(createTextElement(" "), parentNode.childNodes[0]);
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

function cancelSelect(){
         $(".ui-selected").removeClass("ui-selected");
}

function preview(){

  var parentNode=document.getElementById("selectable");
  var nodeList=parentNode.childNodes;
  var i=0;
  var fs=Server.CreateObject("Scripting.FileSystemObject") 
  var file = fso.OpenTextFile("test.vtt", 8, false, 0);
  file.WriteLine("WEBVTT"+"\n");

  // file.open("w");
  // file.write("WEBVTT"+"\n");
  for(;i<nodeList.length;i++){
    var time=nodeList[i][1].children[0].innerHTML;
    var text=nodeList[i][1].children[1].innerHTML1;
    var string=time+"\n"+text+"\n";
    file.WriteLine(string);
  }
  file.Close();

}