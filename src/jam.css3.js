Jam.CSS3 = {

  randomRotation: function (element, range) {
    this.rotate(element, Math.floor(Math.random() * range) * (Math.random()<0.5?-1:1))
  },

  rotate: function (element, deg) {
    element.css(this.transform(), 'rotate(' + deg + 'deg)')
  },

  transform: function () {
    return this.vendorPrefix() + 'transform'
  },

  // return the vendor prefix to use when applying css3 rules
  vendorPrefix: function () {
    function opera () {
      try {
        document.createEvent('OTransitionEvent');
        return true;
      } catch(e) {
        return false;
      }
    }

    function webkit () {
      try {
        document.createEvent('WebKitTransitionEvent');
        return true;
      } catch(e) {
        return false;
      }
    }

    function moz () {
      var div = document.createElement('div'), supported = false;
      if (typeof div.style.MozTransition !== 'undefined') {
        supported = true;
      }
      div = null;
      return supported;
    }

    if (opera()) {
      return '-o-';
    } else if (webkit()) {
      return '-webkit-'
    } else if (moz()) {
      return '-moz-'
    };
  }
}