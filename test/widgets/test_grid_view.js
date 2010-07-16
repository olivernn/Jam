module("Grid View")

function getTestGrid () {
  return Jam.GridView('testing', {
    pageItems: 4,
    pageWidth: '200px',
    pageHeight: '200px',
    templateSelector: '#templates .grid-container',
    holderSelector: '#grid-holder',
    hashPagination: true,
    gridItemHtml: function (item) {
      return $('<p>' + item + '</p>')
    },
    blankStateHtml: $('<p id="blank">There is nothing to display here!</p>')
  }, {
    
  })
}

test("rendering the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  new TestGrid(collection).render()

  var $testGrid = $('.testing')

  equal($testGrid.length, 1)
  equal($testGrid.find('#grid-view-page-1 .grid-view-item').length, 4)
  equal($testGrid.find('.grid-view-page').length, 3)

})

test("scrolling the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection)
  testGrid.render()
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

  ok(!pageChangeHasStarted, "page animate events should only be triggered when animating between pages")
  ok(!pageChangeHasEnded, "page animate events should only be triggered when animating between pages")

  testGrid.showPage(2)
  equal(pageNum, 2, "should be on the page passed to the showPage method")
  ok(pageChangeHasStarted, "should have fired the page animation event when animating between pages")
  equal($testGrid.find('.grid-page-holder:animated').length, 1)
})

test("triggering an event when running low on collection items", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection, 'body')
  testGrid.render()

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
  testGrid.render()
  equal($('.testing').length, 1)

  testGrid.remove()
  equal($('.testing').length, 0, "calling remove on the grid should remove it from the page")
})

test("paginating the grid view", function () {
  TestGrid = getTestGrid()
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  testGrid = new TestGrid(collection)
  testGrid.render()

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

  $testGrid.find('.grid-view-page-controls a:contains("1")').click()
  equal(displayedPage, 1, "clicking an individual page should trigger the paginate event")
})

test("drawing a custom message when there are no items in the collection", function () {
  TestGrid = getTestGrid()
  var collection = []

  new TestGrid(collection).render()

  var $testGrid = $('.testing')

  equal($('#blank').length, 1)
})

test("multiple grid views on the same page can have different settings", function () {
  TestGrid = getTestGrid()

  AnotherGrid = Jam.GridView('another-grid', {
    pageItem: 10,
    pageWidth: '100px',
    pageHeight: '100px',
    templateSelector: '#templates .grid-container',
    holderSelector: '#another-grid-holder',
    pagination: false,
    gridItemHtml: function (item) {
      return $('<p>' + item + '</p>')
    }
  })

  var coll1 = [1,2,3,4,5,6,7,8]
  var coll2 = ["A","B","C","D","E","F"]

  var testGrid = new TestGrid(coll1)
  var anotherTestGrid = new AnotherGrid(coll2)

  testGrid.render()
  anotherTestGrid.render()

  console.log(testGrid.settings, anotherTestGrid.settings)

  ok(testGrid.settings !== anotherTestGrid.settings)
})

test("updating the grid view collection", function () {
  TestGrid = getTestGrid()
  var coll1 = [1,2,3,4,5,6,7,8,9,10]
  var coll2 = ["A","B","C","D","E","F"]

  var testGrid = new TestGrid(coll1)

  testGrid.render()
  testGrid.showPage(3)

  equal(testGrid.pagesRequired, 3)
  equal(testGrid.page, 3)

  testGrid.updateCollection(coll2)

  equal(testGrid.pagesRequired, 2)
  equal(testGrid.page, 2)
})