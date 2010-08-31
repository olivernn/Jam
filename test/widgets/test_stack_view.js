module("Stack View")

  TestStack = function (collection) {
    testGrid = Jam.newObjectFrom(Jam.StackView('test-stack', {
      collection: collection,
      containerSelector: '#stack-holder',
      templateSelector: '#templates .stack-container',
      stackItemHtml: function (item) {
        return $('<p>' + item + '</p>').css({
          'width': '100px',
          'height': '100px',
          'background-color': 'red'
        })
      }
    }))

    testStack.hello = function () {
      return 'hello there'
    }

    return testStack
  }