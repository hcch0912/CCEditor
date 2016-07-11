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
              if(cue.text.match("c.")){
                cue.text=cue.text.substring(cue.text.indexOf(">")+1,cue.text.indexOf("</c>"));
              }
              cue.text ="<c."+colorArr[ui.value]+">"+cue.text+"</c>"
             
      }
    });
}

function getCurrentCue(){

      var LiLines=$(".oneline");
      var thisLi=$(".oneline.li-selected");
      var index=LiLines.index(thisLi);
      console.log(index);
      var track = video.textTracks[1];
      var cue = track.cues[index];
      console.log(cue);
      return cue;
}
 

