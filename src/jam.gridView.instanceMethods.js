Jam.GridView.instanceMethods = {
  // draws the grid view markup, containing the grid items, onto the page
  draw: function () {
    var self = this

    // style the elements of the grid view to acheive the grid view effect
    function addStyles () {
      self.html
        .find('.grid-page-holder')
          .css({
            'width': '10000px',
            'position': 'absolute'
          })
          .end()
        .find('.grid-view-port')
          .css({
            'overflow': 'hidden',
            'position': 'relative',
            'width': self.settings.pageWidth,
            'height': self.settings.pageHeight
          })
          .end()
        .find('.grid-view-page')
          .css({
            'padding': '0px',
            'float': 'left',
            'width': self.settings.pageWidth
          })
    }

    // generate html for a page
    function drawPage (pageNum) {
      var startIndex = (pageNum - 1) * self.settings.pageItems
      var endIndex = pageNum * self.settings.pageItems
      var pageHtml = $('<ul class="grid-view-page clearfix"></ul>')
      var gridItemWrap = $('<li></li>').css({'float': 'left', 'display': 'inline'})

      pageHtml.attr('id', 'grid-view-page-' + pageNum)
      $.each(self.collection.slice(startIndex, endIndex), function () {
        pageHtml.append(gridItemWrap.clone().append(self.settings.gridItemHtml(this)))
      })
      self.html.find('.grid-page-holder').append(pageHtml)
    }

    // calculate how many pages are required for this collection to fit in this grid
    function pagesRequired () {
      return Math.ceil(self.collection.length / self.settings.pageItems)
    }

    for (var i=1; i <= pagesRequired(); i++) drawPage(i)
    addStyles()
    this.holder.html(this.html.addClass(this.name))
  },

  // animate the transition between different pages of the grid
  showPage: function (pageNum) {
    var self = this

    // calculate the required left position of the holder to display this page
    function pagePosition (pageNum) {
      return -1 * ((pageNum - 1) * parseInt(self.settings.pageWidth)) + 'px'
    }

    this.html.find('.grid-page-holder').animate({
      left: pagePosition(pageNum)
    }, this.settings.paginationSpeed, this.settings.paginationEasing)
  }
}