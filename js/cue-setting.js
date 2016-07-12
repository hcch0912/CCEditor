var video = document.querySelector('video');

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

   var colorArr=["white","red","yellow","green","blue","pink","purple","cyan","orange","lime"];
  $( "#color-input" ).slider({
      range: "min",
      value: 5,
      min: 0,
      max: 10,
      slide: function( event, ui ) {
              $( "#color-output" ).val( colorArr[ui.value] );
              var cue=getCurrentCue();
              var prefix;
              var color="txt-"+colorArr[ui.value];
              if(cue.text.match("c\.|b\.|p\.")){
                prefix=cue.text.substring(0,cue.text.indexOf(">"));
                cue.text=cue.text.substring(cue.text.indexOf(">")+1,cue.text.indexOf("</c>"));
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
               cue.text =prefix+">"+cue.text+"</c>"
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
              if(cue.text.match("c\.|b\.|p\.")){
                prefix=cue.text.substring(0,cue.text.indexOf(">"));
                cue.text=cue.text.substring(cue.text.indexOf(">")+1,cue.text.indexOf("</c>"));
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

              cue.text =prefix+">"+cue.text+"</c>"
             
      }
    });
}

function getCurrentCue(){

      var LiLines=$(".oneline");
      var thisLi=$(".oneline.li-selected");
      var index=LiLines.index(thisLi);
      var track = video.textTracks[0];
      var cue = track.cues.getCueById(index);
      return cue;
}
 

