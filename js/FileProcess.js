 /*process vTT file*/
var CueStyleList=[];

function textProcessVTT(file){

  /*clear the elements for a new file*/
  var parentNode=document.getElementById("contentDiv");
  clearCue();
  clearNode();
  /*split the file by empty line*/
  var splited=file.split("\n\n");

  var i=0;
  for(;i<splited.length;i++){
    var commentTemp;
    /*Not the file head nor the style sheet*/
    if(!splited[i].match("WEBVTT")&&!splited[i].match("STYLE")){
       
        var comment;
        var startTime;
        var endTime;
        var text;

        if(splited[i].match("NOTE")){
            commentTemp=splited[i].substring(splited[i].indexOf("NOTE")+4);
        }else{
          //deals with each attribute
           var a=splited[i].indexOf("-->");
              startTime=splited[i].substring(0,a);
              endTime=splited[i].substring(a+3,a+15);
              breakLineIndex=splited[i].indexOf("\n");
              text=splited[i].substring(breakLineIndex+1);
              parentNode.appendChild(createTextElement(startTime,endTime,text,commentTemp));

           var cue=new VTTCue(reverseTime(startTime),reverseTime(endTime),text);
           var track = video.textTracks[0];
           var length=track.cues.length;
                  cue.id=length;
          splited[i].trim();
          if(splited[i].match("align")){
            var alignIndex=splited[i].indexOf("align");
            var align=splited[i].substring(alignIndex).match("\"(.*?)\"")[1];
            if(align){
              cue.align=align;
            }
          }
          if(splited[i].match("line")){
            var lineIndex=splited[i].indexOf("line");
            var line=splited[i].substring(lineIndex).match(":[a-zA-Z0-9]*")[0].substring(1);
      
            if(line.match("[0-9]")){
              cue.line=parseInt(line); 
            
            }else{
                   cue.line=line;
            }
          }
          if(splited[i].match("position")){
            var positionIndex=splited[i].indexOf("position");
            var position=splited[i].substring(positionIndex).match(":[a-zA-Z0-9]*")[0].substring(1);
            if(position.match("[0-9]")){
               cue.position=parseInt(position);
            }else{
              cue.position=position;
             
            }
          }
          if(splited[i].match("size")){
            var sizeIndex=splited[i].indexOf("size");
            var size=splited[i].substring(sizeIndex).match(":[a-zA-Z0-9]*")[0].substring(1);
            if(size.match("[0-9]")){
                 cue.size=parseInt(size);
            }else{
               cue.size=size;
           
             
            }
          }
          if(splited[i].match("vertical")){
            var verticalIndex=splited[i].indexOf("vertical");
            var vertical=splited[i].substring(verticalIndex).match("\"(.*?)\"")[1];
            if(vertical){
              cue.vertical=vertical;
            }
          }
              //add cue element to DOM
              track.addCue(cue);
              initialize_test();
          //}
        }
       
     }
  }
  
}

/* preprocess the text file to split the text by sentences*/

function textProcess(file){
  clearCue();
  clearNode();
  var splited=file.replace(/(\.+|\:|\!|\?|\!|\;|\,)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|"); 
  var i=0;
  for(;i<splited.length;i++){
        parentNode.appendChild(createTextElement("00:00:00.000","00:00:00.000",splited[i],""));
        var cue=new VTTCue(0,0,splited[i]);
        cue.id=i;
        track.addCue(cue);
  }
  initialize_test();
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

        startTimeNode.innerHTML=startTime;
        endTimeNode.innerHTML=endTime;
        commentNode.innerHTML=comment;
        liLiNode.appendChild(startTimeNode);
        liLiNode.appendChild(endTimeNode);
        liLiNode.appendChild(textNode);
        liLiNode.appendChild(commentNode);
        return liLiNode;    
}
/*extra content in container and make it vtt file format*/
function extraText(){
  var parentNode=document.getElementById("contentDiv");
  var track = video.textTracks[0];
  var nodeList=parentNode.childNodes;
  var i=0;

  var startString="WEBVTT FILE"+"\n \n";
  for(;i<track.cues.length;i++){

    var startTime=timeProcess(track.cues[i].startTime);
    var endTime=timeProcess(track.cues[i].endTime);
    var text=track.cues[i].text;
    var line=track.cues[i].line;
    var position=track.cues[i].position;
    var comment=nodeList[i].children[3].innerText;
    var string="\nNOTE "+comment+"\n\n"
                +startTime+"-->"+endTime+" line:"+line+" position:"+position+"\n"
                +text+"\n";
    startString=startString+string;
  }
  return startString;
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
