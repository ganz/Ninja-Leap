var sounds = {
  "dash" : {
    url : "sounds/dash.mp3"
  },
  "enemydeath" : {
    url : "sounds/enemydeath.mp3",
  },
  "villagerdeath" : {
    url : "sounds/villagerdeath.mp3"
  },
  "arrow" : {
    url : "sounds/arrow.mp3"
  },
  "playerdeath" : {
    url : "sounds/playerdeath.mp3"
  },
  "arrowhit" : {
    url : "sounds/arrowhit.mp3"
  },
  "barbarhit" : {
    url : "sounds/barbarhit.mp3"
  },
  "youwin" : {
    url : "sounds/youwin.mp3"
  },
};


var soundContext;
if ('AudioContext' in window) {
    soundContext = new AudioContext();
} else if ('webkitAudioContext' in window) {
    soundContext = new webkitAudioContext();
}

for(var key in sounds) {
  loadSound(key);
}

function loadSound(name){
  var sound = sounds[name];

  var url = sound.url;
  var buffer = sound.buffer;

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    soundContext.decodeAudioData(request.response, function(newBuffer) {
      sound.buffer = newBuffer;
    });
  }

  request.send();
}

function playSound(name, options){
  var sound = sounds[name];
  var soundVolume = sounds[name].volume || 1;

  var buffer = sound.buffer;
  if(buffer){
    var source = soundContext.createBufferSource();
    source.buffer = buffer;

    var volume = soundContext.createGain();

    if(options) {
      if(options.volume) {
        volume.gain.value = soundVolume * options.volume;
      }
    } else {
      volume.gain.value = soundVolume;
    }

    volume.connect(soundContext.destination);
    source.connect(volume);
    source.start(0);
  }
}
