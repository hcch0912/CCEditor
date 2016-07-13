 var video = document.querySelector('video');
 var colorArr=["white","red","yellow","green","blue","pink","purple","cyan","orange","lime","black"];


function initialize_test(){

  $( "#line-position-input" ).slider({
      range: "min",
      value: 8,
      min: 0,
      max: 16,
      slide: function( event, ui ) {
        $( "#line-position-output" ).val( ui.value );
          var line = ui.value;
          var cue=getCurrentCue();         
          cue.line = parseInt(line);
      }
    });
  $( "#line-position-output" ).val( $( "#line-position-input" ).slider( "value" ) );
  $( "#cue-position-input" ).slider({
      range: "min",
      value: 50,
      min: 0,
      max: 100,
      slide: function( event, ui ) {
        $( "#cue-position-output" ).val( ui.value );
            var position = ui.value;
            var cue=getCurrentCue();
            cue.position = parseInt(position);
      }
    });
  $( "#cue-position-output" ).val( $( "#cue-position-input" ).slider( "value" ) );

  
  $( "#color-input" ).slider({
      range: "min",
      value: 5,
      min: 0,
      max: 10,
      slide: function( event, ui ) {
              $( "#color-output" ).val( colorArr[ui.value] );
              var cue=getCurrentCue();
              var prefix;
              var text=cue.text;
              var color="txt-"+colorArr[ui.value];
              if(cue.text.match("<")){
                prefix=cue.text.substring(0,cue.text.indexOf(">"));
                text=cue.text.substring(cue.text.indexOf(">")+1,cue.text.lastIndexOf("<"));
                    if(prefix.match("txt-")){
                        var bgprefixIndex=prefix.indexOf("txt-");
                        var before=prefix.substring(0,bgprefixIndex);
                        var temp=prefix.substring(bgprefixIndex);
                        var after;
                        var bgText;
                        if(temp.indexOf(".")!=-1){
                            bgText=temp.substring(0,temp.indexOf("."));
                            after=temp.substring(temp.indexOf("."));
                        }else{
                            after="";
                        }
                        prefix=before+"txt-"+colorArr[ui.value]+after;
                    }else{
                        prefix=prefix+".txt-"+colorArr[ui.value];
                    }
              }else{
                prefix="<c.txt-"+colorArr[ui.value];
              }
              cue.text =prefix+">"+text+"</c>";

      }
    });
    $( "#bg-color-input" ).slider({
      range: "min",
      value: 5,
      min: 0,
      max: 10,
      slide: function( event, ui ) {
              $( "#bg-color-output" ).val( colorArr[ui.value] );
              var cue=getCurrentCue();
              var prefix;
              var text=cue.text;
              if(cue.text.match("<")){
                prefix=cue.text.substring(0,cue.text.indexOf(">"));
                text=cue.text.substring(cue.text.indexOf(">")+1,cue.text.lastIndexOf("<"));
                    if(prefix.match("bg-")){
                        var bgprefixIndex=prefix.indexOf("bg-");
                        var before=prefix.substring(0,bgprefixIndex);
                        var temp=prefix.substring(bgprefixIndex);
                        var after;
                        var bgText;
                        if(temp.indexOf(".")!=-1){
                            bgText=temp.substring(0,temp.indexOf("."));
                            after=temp.substring(temp.indexOf("."));
                        }else{
                            after="";
                        }
                        prefix=before+"bg-"+colorArr[ui.value]+after;
                    }else{
                        prefix=prefix+".bg-"+colorArr[ui.value];
                    }
              }else{
                prefix="<c.bg-"+colorArr[ui.value];
              }
              cue.text =prefix+">"+text+"</c>";           
      }
    });
}
/*select a new line ,call this to update the global var*/

function getCurrentCue(){

      var LiLines=$(".oneline");
      var thisLi=$(".oneline.li-selected");
      var index=LiLines.index(thisLi);
      var track = video.textTracks[0];
      var cue = track.cues.getCueById(index);
      return cue;
}

function getColorNo(currnetcue){
  var txtColorNo=0;
  var bgColorNo=0;
  var txtColor="white";
  var bgColor="black";
  if(currnetcue){
      var cueText=currnetcue.text;
      /*if it has style tags*/
      if(cueText.match("<*\.txt-.*|bg-.*")){
        var prefix=cueText.substring(0,cueText.indexOf('>'));
        if(prefix.match("\.txt-[a-z]*(\.|>)")){
             txtColor=prefix.match("\.txt-[a-z]*(\.|>)")[0].substring(5);
        }
        if(prefix.match("bg-[a-z]*(\.|>)")){
             bgColor=prefix.match("bg-[a-z]*(\.|>)")[0].substring(3);
        }
      }
  }
  var i=0;
  for(;i<colorArr.length;i++){
    if(txtColor.includes(colorArr[i])||txtColor==colorArr[i]){
      txtColorNo=i;
    }
    if(bgColor.includes(colorArr[i])||bgColor==colorArr[i]){
      bgColorNo=i;
    }
  }
  return {"txtColor":txtColorNo,"bgColor":bgColorNo};
}

function updateSetting(cue){
    var colors=getColorNo(cue);
    var line=8;
    var position=50;
    if(Number.isInteger(cue.line)){
      line=cue.line;
    }
    if(Number.isInteger(cue.position)){
      position=cue.position;
    }
    $("#line-position-input").slider({
      value:line
    });
    $("#cue-position-input").slider({
      value:position
    });
    $("#color-input").slider({
      value:colors.txtColor
    });
    $("#bg-color-input").slider({
      value:colors.bgColor
    });
}

function clearCue(){
     var track = video.textTracks[0];
     var length=track.cues.length;
     var i=0;
     for(;i<length;i++){
        track.removeCue(track.cues[0]);
     }  
}
function clearNode(){
  var parentNode=document.getElementById("contentDiv");
  if(parentNode.hasChildNodes()){
      parentNode.innerHTML="";
  }
}
