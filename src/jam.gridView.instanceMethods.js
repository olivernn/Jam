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
      var gridItemWrap = $('<li class="grid-view-item"></li>').css({'float': 'left', 'display': 'inline'})

      pageHtml.attr('id', 'grid-view-page-' + pageNum)
      $.each(self.collection.slice(startIndex, endIndex), function () {
        pageHtml.append(gridItemWrap.clone().append(self.settings.gridItemHtml(this)))
      })
      self.html.find('.grid-page-holder').append(pageHtml)
    }

    // calculate how many pages are required for this collection to fit in this grid
    function pagesRequired () {
      self.pagesRequired = Math.ceil(self.collection.length / self.settings.pageItems)
      return self.pagesRequired
    }

    for (var i=1; i <= pagesRequired(); i++) drawPage(i)
    addStyles()
    this.holder.html(this.html.addClass(this.name))
  },

  // remove this grid view from the page and unbind all its events
  remove: function () {
    this.holder.find('.' + this.name).remove()
    this.eventHandler.unbind(this.name + ':gridView')
  },

  // animate the transition between different pages of the grid
  showPage: function (pageNum) {
    var self = this
    var pageNum = pageNum

    // the grid needs more items if we are on the penultimate or later page
    function moreCollectionItemsRequired () {
      return pageNum >= (self.pagesRequired - 1)
    }

    // calculate the required left position of the holder to display this page
    function pagePosition () {
      return -1 * ((pageNum - 1) * parseInt(self.settings.pageWidth)) + 'px'
    }

    this.html.find('.grid-page-holder').animate({
      left: pagePosition()
    }, this.settings.paginationSpeed, this.settings.paginationEasing)

    if (moreCollectionItemsRequired()) this.eventHandler.trigger('collectionItemsNeeded.' + this.name + ':gridView')
  }
}