var video = document.querySelector('video');
var track_elem = document.querySelector('track');

track_elem.addEventListener('loaded',initialize_test,false); // Bug in FF31 MAC: wrong event name
track_elem.addEventListener('load',initialize_test,false);

function create_sample_cue(cue){
    var vtt_cue;
   
    timestamps=cue.startTime+" --> "+cue.endTime;
    var settings = " line:" + cue.line;
    settings += " position:" + cue.position + "%";
    //settings += " align:" + cue.align;
    //settings += " size:" + cue.size + "%";
    // if (cue.vertical != "") {
    //   settings += " vertical:" + cue.vertical;
    // }
    var timing = timestamps + settings;
    //var styleClass="<c."+
    vtt_cue = timing + "\n" + cue.text;
    //$('#sample_cue').html(vtt_cue);
  }

function initialize_test(cue_num){
  var track = video.textTracks[1];
  var cue = track.cues[cue_num];
  
  // Set some of these values initially
  cue.line = 13;
  cue.position = 50;
  cue.align = 'middle';
  cue.size = 100;
  cue.vertical = '';

  $('div#contentDiv p#textNode').on('keyup', function(e){
    cue.text = $(this).val();
    create_sample_cue(cue);
  });

  $( "#line-position-input" ).slider({
      range: "min",
      value: 8,
      min: 0,
      max: 16,
      slide: function( event, ui ) {
        $( "#line-position-output" ).val( ui.value );
          var line = ui.value;
          cue.line = parseInt(line);
          //$('#line-position-output')[0].innerText = line;
          create_sample_cue(cue);  
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
            cue.position = parseInt(position);
            //$('#cue-position-output')[0].innerText = position;
            create_sample_cue(cue);
      }
    });
  $( "#cue-position-output" ).val( $( "#cue-position-input" ).slider( "value" ) );

  // $('form#caption-change-form .align-radio input').on('change input', function(e){
  //   cue.align = $(this).val();
  //   create_sample_cue(cue);
  // });
  // $('form#caption-change-form input#input-change-size').on('change input', function(e){
  //   var size = $(this).val();
  //   cue.size = parseInt(size);
  //   $('#size-setting')[0].value = size;
  //   create_sample_cue(cue);
  // });
  // $('form#caption-change-form .vertical-radio input').on('change input', function(e){
  //   cue.vertical = $(this).val();
  //   create_sample_cue(cue);
  // });
  // $('form#style-change-form textarea').on('keyup', function(){
  //   $('#extra-textarea-styles').html('::cue{' + $(this).val() + '}');
  //   create_sample_cue(cue);
  // });

  create_sample_cue(cue);
}

// video.pause();
// setTimeout(function(){
//   video.play();
//   // initialize_test();
// }, 2000);

