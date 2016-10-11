d = document;w = window;
////////*********************RADIO*****************************/
radio = {
    RadioState: 0,
    ActiveStation: 0,
  //Init Function
    Init: function(){
      d.getElementById("stationname").innerHTML = radio.Stations[radio.ActiveStation].name;
      d.getElementById("stationArt").src = radio.Stations[radio.ActiveStation].img;
      radio.populateStationList();
      radio.GetMetaData();
    },
  //Stations
    "Stations": [
      {
        name: "Kiss",
        audioLink: "http://icy-e-ba-08-boh.sharp-stream.com/kissnational.mp3",
        img: "https://i3.radionomy.com/radios/400/a8cfb367-07df-4950-8ed1-94c8fba01cf2.jpg"
      },
      {
        name: "Capital",
        audioLink: "http://media-ice.musicradio.com/CapitalSouthWalesMP3",
        img: "https://static-media.streema.com/media/object-images/752a3c726d10c96acbbd52a8292aef0a.jpg"
      },
      {
        name: "Heart",
        audioLink: "http://media-ice.musicradio.com/HeartSouthWalesMP3",
        img: "https://lh3.googleusercontent.com/eOwS8p5wy1Q7NXTq2jU1Rb_OxxnddW0m1VQ12azg9opDJvsQKiu7JP7VIo0ptuNg4A=w300"
      },
      {
        name: "Nation",
        audioLink: "http://icy-e-03-boh.sharp-stream.com/tcnation.aac",
        img: "https://pbs.twimg.com/profile_images/772822174017187840/FbDGHub5.jpg"
      },
      {
        name: "Hive365",
        audioLink: "http://stream.hive365.co.uk:8088/live",
        img: "http://hive365.co.uk/img/footer-logo.png"
      }
    ],
  //Play And Pause Function
    PlayState: function(){
      if (radio.RadioState == 0){
        radio.RadioState = 1;
        d.getElementById("playPause").className = "fa fa-pause";
        radio.StationChange(radio.ActiveStation);
      }else if (radio.RadioState == 1) {
        radio.RadioState = 0;
        d.getElementById("playPause").className = "fa fa-play";
        var audio = d.getElementById('audiotag');
        var audioSource = d.getElementById('audiosourcetag');
        audioSource.src = "";
        audio.load();
        Radio_Power_State = 0;
      }else{
        SAM.ErrorOutput("1");
      }
    },
  //Change Station Function
    StationChange: function(stationID){
      d.getElementById("stationname").innerHTML = radio.Stations[radio.ActiveStation].name;
      d.getElementById("stationArt").src = radio.Stations[radio.ActiveStation].img;
      var audio = d.getElementById('audiotag');
      var audioSource = d.getElementById('audiosourcetag');
      audioSource.src = radio.Stations[stationID].audioLink;
      audio.load();
      radio.GetMetaData();
    },

    StationSeek: function(direction){
      if (radio.RadioState == 0){return;};
      if (direction == "up"){
        radio.ActiveStation = radio.ActiveStation + 1;
        if (radio.ActiveStation > (radio.Stations.length - 1)){
          radio.ActiveStation = 0;
        };
        radio.StationChange(radio.ActiveStation);
      } else if (direction == "down"){
        radio.ActiveStation = radio.ActiveStation - 1;
        if (radio.ActiveStation < 0){
          radio.ActiveStation = (radio.Stations.length - 1);
        };
        radio.StationChange(radio.ActiveStation);
      }else{
        SAM.ErrorOutput("2");
      };
    },
    populateStationList: function(){
      stationList = d.getElementById("stations");

      for (var i = 0; i < radio.Stations.length; i++) {
        if (stationList.children[0].children[0].children < 19)
        {
          stationList.children[0].children[0].innerHTML += "<li data-snum="+i+" onclick='radio.ActiveStation = this.dataset.snum; radio.StationChange(radio.ActiveStation);'>"+radio.Stations[i].name+"</li>";
        } else {
          stationList.children[1].children[0].innerHTML += "<li data-snum="+i+" onclick='radio.ActiveStation = this.dataset.snum; radio.StationChange(radio.ActiveStation);'>"+radio.Stations[i].name+"</li>";
        }
      }
    },
    ErrorOutput: function(code){
      console.log('Error Code: '+code);
      console.log('Please contact the web administrator or a developer at radio@samdjames.uk with this error code!');
    },
    AddStation: function(){
      sname = prompt("Whats the name of the station?");
      slink = prompt("Whats the link of the station?");
      newStation = {name: sname, audioLink: slink};
      radio.Stations.push(newStation);
      alert("New Station Added!");
    },
    EditStation: function(){
      station = prompt("Name of station to edit?");
      if (SAM.InArray(station)){
        if (SAM.ian > -1){
          if (confirm("Do you want to edit the name?")){
            radio.Stations[SAM.ian].name = prompt("New name of the station?");
          };
          if (confirm("Do you want to edit the url?")){
            radio.Stations[SAM.ian].audioLink = prompt("New URL of the station?");
          }
        }
      }else{
        alert("No such station!");
      }
    },
    RemoveStation: function(){
      station = prompt("Station Name To Remove?");
      if (SAM.InArray(station)){
        if (SAM.ian > -1){
          radio.Stations.splice(SAM.ian, 1);
        };
      }else{
        radio.ErrorOutput("No such station!");
      };
    },
    GetMetaData: function(){
      //d.getElementById('prxy').src = 'http://127.0.0.1/radio/10_Dev_Code/proxy.php?streamurl='+d.getElementById('audiosourcetag').src;
      d.getElementById('prxy').src = 'http://127.0.0.1/radio/10_Dev_Code/proxy.php?streamurl='+radio.Stations[radio.ActiveStation].audioLink;
      if (d.getElementById('prxy').contentWindow.document.body.children.length == 1){
        //Do Good Stuff
        console.log(d.getElementById('prxy').contentWindow.document.body.children[0].children[2].innerHTML);
        var Meta = d.getElementById('prxy').contentWindow.document.body.children[0].children[2].innerHTML.split(" - ");
        if (Meta[0].length == 2){
          //No Track/Artist
          d.getElementById('track').innerHTML = "Could not find track information!!";
          d.getElementById('artist').innerHTML = "";
        }else{
          d.getElementById('artist').innerHTML = Meta[0].split("'")[1];
          d.getElementById('track').innerHTML = Meta[1].split("'")[0];
        }
      }else{
        console.log('I might have broke!!');
        d.getElementById('track').innerHTML = "An Error Occured?";
        d.getElementById('artist').innerHTML = "Maybe?";
      };
      console.log("Queried: "+d.getElementById('prxy').src);
    }
};
/*******************SAM******************/
SAM = {
  ian: 0,
  ErrorOutput: function(code){
    console.log('Error Code: '+code);
    console.log('Please contact the web administrator or a developer at radio@samdjames.uk with this error code!');
  },
  InArray: function(s){
    for (var i = 0; i < radio.Stations.length; i++) {
      if (s == radio.Stations[i].name){
        SAM.ian = i;
        return true;
      }else{
      }
    }
    return false;
  }
};
/***********INIT STUFF**************/
radio.Init();
$( function() {
    $( "#VolumeSlider" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: 50,
      slide: function( event, ui ) {
        d.getElementById('audiotag').volume = ui.value/100;
      }
    });
  } );
