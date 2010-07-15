Jam.GridView.instanceMethods = {

  // calculated whether this grid view can page backward
  canPageBackward: function () {
    return this.page > 1
  },

  // calculated whether this grid view can page forward
  canPageForward: function () {
    return this.page != this.pagesRequired
  },

  // generates and returns the markup for the grid view and items
  generateHtml: function () {
    var self = this
    var pageTemplate = $('<ul class="grid-view-page clearfix"></ul>')
    var gridItemWrap = $('<li class="grid-view-item"></li>').css({'float': 'left', 'display': 'inline'})

    if (self.collection.length > 0) {
      for (var i=1; i <= pagesRequired(); i++) drawPage(i)      
      drawPaginationControls()
      self.eventHandler.bind('pageAnimationStart.' + this.eventNamespace, function () {
        drawPaginationControls()
      })
    } else {
      drawBlankState()
    };

    addStyles()
    return this.html.addClass(this.name)

    // style the elements of the grid view to acheive the grid view effect
    function addStyles () {
      self.holder.css({
        'width': self.settings.pageWidth
      })
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

    function drawBlankState () {
      if (self.settings.blankStateHtml) {
        self.html.find('.grid-page-holder').append(pageTemplate.clone().append(self.settings.blankStateHtml))   
      };
    }

    // generate html for a page
    function drawPage (pageNum) {
      var startIndex = (pageNum - 1) * self.settings.pageItems
      var endIndex = pageNum * self.settings.pageItems
      var pageHtml = pageTemplate.clone()

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
        if (self.settings.hashPagination) {
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

      var pageControlsHtml = $('<div class="grid-view-page-controls"><a class="page-link backward">Prev</a><a class="page-link forward">Next</a></div>')
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

  // inserts markup into the dom
  insertHtml: function () {
    this.holder.html(this.html)
  },

  // draws and then inserts the html for this template into the dom
  // overwrite this to do any pre or post processing to the markup
  // before entering it into the dom
  render: function () {
    this.generateHtml()
    // custom methods would be placed here to manipulate the generated html
    this.insertHtml()
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