Jam.GridView.instanceMethods = {

  // calculated whether this grid view can page backward
  canPageBackward: function () {
    return this.page > 1
  },

  // calculated whether this grid view can page forward
  canPageForward: function () {
    return this.page != this.pagesRequired
  },

  // draws the grid view markup, containing the grid items, onto the page
  draw: function () {
    var self = this
    for (var i=1; i <= pagesRequired(); i++) drawPage(i)
    addStyles()
    drawPaginationControls()
    self.eventHandler.bind('pageAnimationEnd.' + this.eventNamespace, function () {
      drawPaginationControls()
    })
    this.holder.html(this.html.addClass(this.name))

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

    // draw controls to page through the collection
    function drawPaginationControls () {

      // generate the href for paging backwards
      function pageNumHref (pageNum) {
        if (self.settings.sammyPagination) {
          return '#/' + self.name + '/page/' + pageNum
        } else {
          return '#'
        };
      }

      // calculate the previous page number
      function previousPageNum () {
        return parseInt(self.page) - 1
      }

      // calculate the next page number
      function nextPageNum () {
        return parseInt(self.page) + 1
      }

      self.holder.find('.grid-view-page-controls').remove()

      var pageControlsHtml = $('<div class="grid-view-page-controls"><a class="backward">Prev</a><a class="forward">Next</a></div>')
      pageControlsHtml
        .find('.backward')
          .attr('href', self.canPageBackward() ? pageNumHref(previousPageNum()) : '#')
          .click(function () {
            if (self.canPageBackward) {
              self.eventHandler.trigger('paginate.' + self.eventNamespace, previousPageNum())
            };
          })
          .end()
        .find('.forward')
          .attr('href', self.canPageForward() ? pageNumHref(nextPageNum()) : '#')
          .click(function () {
            if (self.canPageForward()) {
              self.eventHandler.trigger('paginate.' + self.eventNamespace, nextPageNum())
            };
          })

      for (var i=1; i <= pagesRequired(); i++) {
        var pageLink = $('<a class="page-link"></a>')
        pageLink
          .attr('href', pageNumHref(i))
          .text(i)
          .addClass(i == self.page ? 'current' : '')
        pageControlsHtml.find('.forward').before(pageLink)
      };

      self.html.append(pageControlsHtml)
    }

    // calculate how many pages are required for this collection to fit in this grid
    function pagesRequired () {
      self.pagesRequired = Math.ceil(self.collection.length / self.settings.pageItems)
      return self.pagesRequired
    }
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

    if (pageNum <= self.pagesRequired && pageNum > 0) {
      this.page = pageNum
      this.eventHandler.trigger('pageAnimationStart.' + this.eventNamespace, pageNum)
      this.html.find('.grid-page-holder').animate({
        left: pagePosition()
      }, this.settings.paginationSpeed, this.settings.paginationEasing, function () {
        self.eventHandler
          .trigger('pageAnimationEnd.' + self.eventNamespace, pageNum)
      })

      if (moreCollectionItemsRequired()) this.eventHandler.trigger('collectionItemsNeeded.' + this.eventNamespace)      
    } else {
      throw("cannot show a page that doesn't exist")
    };
  }
}