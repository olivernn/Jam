Jam.StackView = function (name, options) {
  var defaults = {}
  var options = $.extend(defaults, options, {'widget': 'stack-view'})

  var expanded = false

  var stackItemWrap = $('<div></div>')
    .addClass('stack-view-item')
    .css({
      'position': 'absolute',
      'top': '5px',
      'left': '5px'
    })

  var stackView = Jam.newObjectFrom(Jam.CollectionView(name, options))

  function addStyles () {
    stackView.html.css({
      'position': 'relative',
      'width': options.width,
      'height': options.height
    })
  }

  stackView.collapse = function () {
    expanded = false
    this.html.animate({
      'left': '0px',
      'top': '0px'
    }, 1000)
  }

  stackView.expand = function () {
    expanded = true
    this.html.animate({
      'left': Jam.Helper.pageCentreX(parseInt(options.width)),
      'top': Jam.Helper.pageCentreY(parseInt(options.height))
    }, 1000)
  }

  stackView.generateHtml = function () {
    addStyles()
    for (var i=0; i < this.collection().length; i++) {
      var stackItem = stackItemWrap.clone().append(options.stackItemHtml(this.collection()[i]))
      stackItem.css({
        'z-index': i + 1
      })
      Jam.CSS3.randomRotation(stackItem, 15)
      this.html.append(stackItem)
    };
  }

  stackView.isCollapsed = function () {
    return !expanded
  }

  stackView.isExpanded = function () {
    return expanded
  }

  stackView.showNext = function () {
    
  }

  return stackView
}

