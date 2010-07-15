module("Grid View")

function getTestGrid () {
  return Jam.GridView('testing', {
    pageItems: 4,
    pageWidth: '200px',
    pageHeight: '200px',
    templateSelector: '#templates .grid-container',
    holderSelector: '#grid-holder',
    sammyPagination: true,
    gridItemHtml: function (item) {
      return $('<p>' + item + '</p>')
    }
  }, {
    
  })
}

test("drawing the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  new TestGrid(collection).draw()

  var $testGrid = $('.testing')

  equal($testGrid.length, 1)
  equal($testGrid.find('#grid-view-page-1 .grid-view-item').length, 4)
  equal($testGrid.find('.grid-view-page').length, 3)

})

test("scrolling the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection)
  testGrid.draw()
  var $testGrid = $('.testing')

  var pageChangeHasStarted = false
  var pageChangeHasEnded = false
  var pageNum = 1

  $(document)
    .bind('pageAnimationStart.testing:gridView', function (e, newPage) {
      pageChangeHasStarted = true
      pageNum = newPage
    })
    .bind('pageAnimationEnd.testing:gridView', function () {
      pageChangeHasEnded = true
    })

  ok(!pageChangeHasStarted)
  ok(!pageChangeHasEnded)

  equal($testGrid.find('.grid-page-holder:animated').length, 0)

  testGrid.showPage(2)
  equal(pageNum, 2)
  ok(pageChangeHasStarted)
  ok(!pageChangeHasEnded)
  equal($testGrid.find('.grid-page-holder:animated').length, 1)
})

test("triggering an event when running low on collection items", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection, 'body')
  testGrid.draw()

  var eventCounter = 0

  $('body').bind('collectionItemsNeeded.testing:gridView', function () {
    eventCounter++
  })

  testGrid.showPage(1)
  equal(eventCounter, 0)

  testGrid.showPage(2)
  equal(eventCounter, 1)

  testGrid.showPage(3)
  equal(eventCounter, 2)

  testGrid.showPage(1)
  equal(eventCounter, 2)
})

test("removing the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection)
  testGrid.draw()
  equal($('.testing').length, 1)

  testGrid.remove()
  equal($('.testing').length, 0, "calling remove on the grid should remove it from the page")
})

test("paginating the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection)
  testGrid.draw()

  var $testGrid = $('.testing')
  var displayedPage = 1

  $(document).bind('paginate.testing:gridView', function (e, page) {
    displayedPage = page
  })

  // the test grid is using sammy pagination so the urls will have meaning
  equal($testGrid.find('.grid-view-page-controls').length, 1, "pagination controls should be drawn by default")
  equal($testGrid.find('.grid-view-page-controls .current').text(), 1, "should be on the first page by default")
  equal($testGrid.find('.grid-view-page-controls a').length, 5, "one for each page and one each for next and prev")
  equal($testGrid.find('.grid-view-page-controls .backward').attr('href'), '#', "cannot page backwards when on the first page")

  // the test grid will also fire events that can be bound to on pagination
  $(document).bind('paginate.testing:gridView', function (e, page) {
    displayedPage = page
  })

  $testGrid.find('.grid-view-page-controls .forward').click()
  equal(displayedPage, 2, "clicking a page link should trigger the paginate event")
})