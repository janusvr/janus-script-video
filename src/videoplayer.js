room.registerElement('videoplayer', {
  seeking: false,
  seekrate: 1000,
  buttoncolor_play: V(0,1,0),
  buttoncolor_pause: V(1,0,0),
  
  createChildren: function() {
    this.createControls();
  },
  createControls: function() {
    this.button = room.createObject('PushButton', {
      pos: V(-.75,-.85,.15),
      ydir: V(0,0,1),
      zdir: V(0,-1,0),
      width: .1,
      length: .15,
      height: .125,
      onactivate: this.play,
      ondeactivate: this.pause
    }, this);
    this.slider = room.createObject('Slider', {
      length: 1.5,
      width: .1,
      height: .125,
      ydir: V(0,0,1),
      zdir: V(0,-1,0),
      pos: V(.15,-.85,.15),
      onbegin: this.seekstart,
      onchange: this.seek,
      onend: this.seekend,
    }, this);

    // FIXME - bug with spawning objects with an orientation
    setTimeout(function() {
      this.button.ydir = V(0,0,1);
      this.button.zdir = V(0,-1,0);
      this.slider.ydir = V(0,0,1);
      this.slider.zdir = V(0,-1,0);
    }.bind(this), 10);

    this.video.addEventListener('playing', this.updatePlayButton);
    this.video.addEventListener('play', this.updatePlayButton);
    this.video.addEventListener('pause', this.updatePlayButton);
    this.video.addEventListener('ended', this.updatePlayButton);
    this.video.addEventListener('timeupdate', this.updateTimeSlider);
  },
  updatePlayButton: function(ev) {
    var playing = this.isPlaying();
    this.button.setActive(playing);
    this.button.col = (playing ? this.buttoncolor_play : this.buttoncolor_pause);
  },
  updateTimeSlider: function(ev) {
    if (!this.seeking) {
      this.slider.max = this.video.duration;
      this.slider.setValue(this.video.currentTime, true);
      this.updatePlayButton();
    }
  },
  seekstart: function() {
    this.seeking = true;
  },
  seekend: function() {
    this.seeking = false;
  },
  seek: function(ev) {
    var now = performance.now(),
        lastseek = this.lastseek || 0;
    if (!this.lastseek || now - lastseek > this.seekrate) {
      this.lastseek = now;
      this.seekInstantly();
    } else {
      if (!this.seektimer) {
        var nextseek = Math.min(this.seekrate, now - lastseek);
        this.seektimer = setTimeout(this.seekInstantly, nextseek);
      }
    }
  },
  seekInstantly: function() {
      this.video.currentTime = this.slider.value;
    this.seektimer = false;
  }
}, 'video');

