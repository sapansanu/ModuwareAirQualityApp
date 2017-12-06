var RadialProgress = function(size, barSize, barColor, backgroundColor, textColor, zIndex) { // jshint ignore:line
  this.radialProgress = document.createElement('div');
  this.style = document.createElement('style');
  this.progress = 0;
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  barSize = (barSize % 2 === 1) ? (barSize + 1) : barSize;
  var innerSize = size - barSize;
  var innerMargin = barSize / 2;

  this.radialProgress.className = 'radial-progress';
  this.radialProgress.innerHTML = '<div class="inner-circle">' +
    '<div class="progress">0%<' + '/div>' +
    '</div>' +
    '<div class="outer-circle">' +
    '<div class="mask full">' +
    '<div class="fill"></div>' +
    '</div>' +
    '<div class="mask">' +
    '<div class="fill"></div>' +
    '<div class="fill fix"></div>' +
    '</div>' +
    '</div>';

  this.style.type = 'text/css';
  this.style.innerHTML = '.radial-progress {' +
    'width:' + size + 'px;' +
    'height: ' + size + 'px;' +
    'position: fixed;' +
    'margin: auto;' +
    'top: 0; right: 0; bottom: 8%; left: 0;' +
    'z-index: ' + zIndex + ';' +
    'background-color: #EEEEEE;' +
    'border-radius: 50%;' +
    '}' +
    '.radial-progress .inner-circle {' +
    'width: ' + innerSize + 'px;' +
    'height: ' + innerSize + 'px;' +
    'position: absolute;' +
    'margin-top: ' + innerMargin + 'px;' +
    'margin-left: ' + innerMargin + 'px;' +
    'background-color: ' + backgroundColor + ';' +
    'border-radius: 50%;' +
    'z-index: 10;' +
    '}' +
    '.radial-progress .inner-circle .progress {' +
    'font-size: 20px;' +
    'position: absolute;' +
    'margin: auto;' +
    'top: 25px; right: 0; bottom: 0; left: 0.2em;' +
    'text-align: center;' +
    'color: ' + textColor + ';' +
    '}' +
    '.radial-progress .outer-circle .mask,' +
    '.radial-progress .outer-circle .fill {' +
    'width: ' + size + 'px;' +
    'height: ' + size + 'px;' +
    'position: absolute;' +
    'border-radius: 50%;' +
    '-webkit-backface-visibility: hidden;' +
    '}' +
    '.radial-progress .outer-circle .mask {' +
    'clip: rect(0px, ' + size + 'px, ' + size + 'px, ' + size / 2 + 'px);' +
    '}' +
    '.radial-progress .outer-circle .mask .fill {' +
    'clip: rect(0px, ' + size / 1.98   + 'px, ' + size + 'px, 0px);' +
    'background-color: ' + barColor + ';' +
    '}';

  document.getElementsByTagName('head')[0].appendChild(this.style);
  document.body.appendChild(this.radialProgress);

  this.remove = function() {
    var self = this;
    var scale = 1;
    var deltaScale = 0.1 / 10;

    function step() {
      scale += deltaScale;
      scale = (scale < 0) ? 0 : scale;
      self.radialProgress.style.transform = 'scale(' + scale + ')';

      if (scale > 1.1) {
        deltaScale = -1.1 / 8;
      }

      if (scale > 0) {
        requestAnimationFrame(step);
      } else {
        document.getElementsByTagName('head')[0].removeChild(self.style);
        document.body.removeChild(self.radialProgress);
      }
    }

    requestAnimationFrame(step);
  };

  this.setProgress = function(progress, duration) {
    progress = (progress > 100) ? 100 : progress;
    var self = this;
    var $maskFull = this.radialProgress.getElementsByClassName('mask full')[0];
    var $fill = this.radialProgress.getElementsByClassName('fill');
    var $fillFix = this.radialProgress.getElementsByClassName('fill fix')[0];
    var $progress = this.radialProgress.getElementsByClassName('progress')[0];
    var deltaProgress = (progress - this.progress) / (duration * 60);

    function step() {
      self.progress += deltaProgress;
      self.progress = (self.progress > progress) ? progress : self.progress;
      var rotate = self.progress * 1.8;
      $maskFull.style.transform = 'rotate(' + rotate + 'deg)';
      $progress.innerHTML = self.progress.toFixed() + '%';

      for (var i = 0; i < $fill.length; ++i) {
        $fill[i].style.transform = 'rotate(' + rotate + 'deg)';
      }

      $fillFix.style.transform = 'rotate(' + 2 * rotate + 'deg)';

      if (self.progress < progress) {
        requestAnimationFrame(step);
      }
      else {
        document.getElementById('text').textContent = "";  
        document.getElementById('warming-text').textContent = "Done!";  
      }
    }
    requestAnimationFrame(step);
  };
};

function createProgress() {
  if(Nexpaq.Header._detectCurrentPlatform() == "android") {
    var progress = new RadialProgress(130, 15, '#0EA4E3', '#FFFFFF', '#606060', 1);
    document.getElementsByClassName("progress")[0].style = "top : 45px; left: 0.2em; font-size: 23px";
  } else {
    var progress = new RadialProgress(84, 12, '#606060', '#EEEEEE', '#606060', 1);
  }
  setTimeout(function() {
    progress.setProgress(100, 35);
  }, 0);
}