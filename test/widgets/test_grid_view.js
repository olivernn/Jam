module("Grid View")

  TestGrid = function (collection) {
    testGrid = Jam.newObjectFrom(Jam.GridView('test-grid', {
      perPage: 4,
      gridWidth: 2,
      pageWidth: '200px',
      pageHeight: '200px',
      collection: collection,
      containerSelector: '#grid-holder',
      templateSelector: '#templates .grid-container',
      blankStateHtml: $('<p id="blank">There is nothing to display here!</p>'),
      gridItemHtml: function (item) {
        return $('<p>' + item + '</p>')
      }
    }))

    testGrid.hello = function () {
      return 'hello there'
    }

    return testGrid
  }

  AnotherGrid = function (collection) {
    anotherGrid = Jam.newObjectFrom(Jam.GridView('another-grid', {
      perPage: 4,
      gridWidth: 2,
      pageWidth: '200px',
      pageHeight: '200px',
      collection: collection,
      templateSelector: '#templates .grid-container',
      containerSelector: '#another-grid-holder',
      blankStateHtml: $('<p id="blank">There is nothing to display here!</p>'),
      gridItemHtml: function (item) {
        return $('<p>' + item + '</p>')
      }
    }))

    return anotherGrid
  }

test("rendering the grid view", function () {
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  var tg = TestGrid(collection)

  tg.render()

  var $testGrid = $('.test-grid')

  equal($testGrid.length, 1)
  equal($testGrid.find('#grid-view-page-1 .grid-view-item').length, 4)
  equal($testGrid.find('.grid-view-page').length, 3)

})

test("scrolling the grid view", function () {
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  var tg = TestGrid(collection)

  tg.render()
  var $testGrid = $('.test-grid')

  var pageChangeHasStarted = false
  var pageChangeHasEnded = false
  var pageNum = 1

  tg
    .bind('pageAnimationStart', function (e, newPage) {
      pageChangeHasStarted = true
      pageNum = newPage
    })
    .bind('pageAnimationEnd', function () {
      pageChangeHasEnded = true
    })

  ok(!pageChangeHasStarted, "page animate events should only be triggered when animating between pages")
  ok(!pageChangeHasEnded, "page animate events should only be triggered when animating between pages")

  tg.showPage(2)
  equal(pageNum, 2, "should be on the page passed to the showPage method")
  ok(pageChangeHasStarted, "should have fired the page animation event when animating between pages")
  equal($testGrid.find('.grid-page-holder:animated').length, 1)
})

test("triggering an event when running low on collection items", function () {
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  var tg = TestGrid(collection)

  tg.render()
  var $testGrid = $('.test-grid')

  var eventCounter = 0

  tg.bind('collectionItemsNeeded', function () {
    eventCounter++
  })

  testGrid.showPage(1)
  equal(eventCounter, 0)

  testGrid.showPage(2)
  equal(eventCounter, 1)

  testGrid.showPage(1)
  equal(eventCounter, 1)
})

test("removing the grid view", function () {
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  var tg = TestGrid(collection)
  var eventCount = 0

  tg.render()

  tg.bind('hello', function () {
    eventCount++
  })

  equal($('.test-grid').length, 1)

  tg.trigger('hello')
  equal(eventCount, 1)

  testGrid.remove()
  equal($('.testing').length, 0, "calling remove on the grid should remove it from the page")

  tg.trigger('hello')
  equal(eventCount, 1)
})

test("paginating the grid view", function () {
  var collection = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  var tg = TestGrid(collection)
  var eventCount = 0

  tg.render()

  var $testGrid = $('.test-grid')
  var displayedPage = 1

  tg.bind('paginate', function (e, page) {
    displayedPage = page
  })

  equal($testGrid.find('.grid-view-page-controls').length, 1, "pagination controls should be drawn by default")
  equal($testGrid.find('.grid-view-page-controls .current').text(), 1, "should be on the first page by default")
  equal($testGrid.find('.grid-view-page-controls a').length, 5, "one for each page and one each for next and prev")

  $testGrid.find('.grid-view-page-controls .forward').click()
  equal(displayedPage, 2, "clicking a page link should trigger the paginate event")

  $testGrid.find('.grid-view-page-controls a:contains("1")').click()
  equal(displayedPage, 1, "clicking an individual page should trigger the paginate event")

})

test("drawing a custom message when there are no items in the collection", function () {
  var collection = []
  var tg = TestGrid(collection)
  var eventCount = 0

  tg.render()

  var $testGrid = $('.test-grid')

  equal($('#blank').length, 1)
})

test("multiple grid views on the same page can have different settings", function () {

  var coll1 = [1,2,3,4,5,6,7,8]
  var coll2 = ["A","B","C","D","E","F"]

  var tg = TestGrid(coll1)
  var ag = AnotherGrid(coll2)

  tg.render()
  ag.render()

  ok(tg !== ag)
})

test("updating the grid view collection", function () {
  var coll1 = [1,2,3,4,5,6,7,8,9,10]
  var coll2 = ["A","B","C","D","E","F"]

  var tg = TestGrid(coll1)
  var eventCount = 0

  equal(tg.collection(), coll1)
  tg.render()
  tg.showPage(3)
  equal(tg.currentPage(), 3)
  tg.updateCollection(coll2)
  equal(tg.currentPage(), 2)
  equal(tg.collection(), coll2)
})