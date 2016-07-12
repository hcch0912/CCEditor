 /*process vTT file*/

var styleList=[];

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