Jam.GridView = function (name, options) {
  var defaults = {
    paginationSpeed: 800,
    paginationEasing: 'swing'
  }
  var options = $.extend(defaults, options, {'widget': 'grid-view'})
  var gridView = Jam.newObjectFrom(Jam.CollectionView(name, options))
  var currentPage = 1
  var perPage = parseInt(options.perPage) || 1
  var self = this
  var pageTemplate = $('<ul class="grid-view-page clearfix"></ul>')
  var pageControlsTemplate = $('<div class="grid-view-page-controls"><a href="#" class="page-link backward">Prev</a><a href="#" class="page-link forward">Next</a></div>')
  var girdItemWidth = parseInt(gridView.options().pageWidth) / gridView.options().gridWidth + 'px'
  var gridItemWrap = $('<li class="grid-view-item"></li>').css({
    'float': 'left',
    'width': girdItemWidth
  })

  var addStyles = function () {
    this.container().css({
      'width': options.pageWidth
    })
    this.html
      .find('.grid-page-holder')
        .css({
          'min-width': '10000px',
          'position': 'absolute'
        })
        .end()
      .find('.grid-view-port')
        .css({
          'overflow': 'hidden',
          'position': 'relative',
          'width': options.pageWidth,
          'height': options.pageHeight
        })
        .end()
      .find('.grid-view-page')
        .css({
          'padding': '0px',
          'float': 'left',
          'width': options.pageWidth,
          'height': options.pageHeight
        })
  }

  var displayCurrentPage = function () {
    if (currentPage > pagesRequired()) { currentPage = pagesRequired() };
    this.html.find('.grid-page-holder').css({'left': pagePosition(currentPage)});
  };

  var drawBlankState = function () {
    if (options.blankStateHtml) {
      this.html.find('.grid-page-holder')
        .append(pageTemplate.clone().append(options.blankStateHtml));
    };
  };

  var drawPage = function (pageNum) {
    var startIndex = (pageNum - 1) * options.perPage;
    var endIndex = pageNum * options.perPage;
    var pageHtml = pageTemplate.clone();

    pageHtml.attr('id', 'grid-view-page-' + pageNum);
    $.each(this.collection().slice(startIndex, endIndex), function () {
      pageHtml.append(gridItemWrap.clone().append(options.gridItemHtml(this).css({
        'margin-left': 'auto',
        'margin-right': 'auto'
      })));
    });

    this.html.find('.grid-page-holder').append(pageHtml);
  }

  var drawPaginationControls = function () {
    var self = this
    // this.html.find('.grid-view-page-controls').remove();
    if (pagesRequired() > 1) {
      var controlsHtml = pageControlsTemplate.clone()
      controlsHtml
        .find('.backward')
          .click(function () {
            if (self.canPageBackward()) {
              self.trigger('paginate', previousPageNum())
            };
          })
          .end()
        .find('.forward')
          .click(function () {
            if (self.canPageForward()) {
              self.trigger('paginate', nextPageNum())
            };
          })

      for (var i=1; i <= pagesRequired(); i++) {
        var pageLink = $('<a href="#" class="page-link"></a>')
        pageLink
          .text(i)
          .addClass(i == currentPage ? 'current' : '')
          .click(function () {
            self.trigger('paginate', parseInt($(this).text()))
          })
        controlsHtml.find('.forward').before(pageLink)
      };

      this.html.append(controlsHtml)
    };
  }

  var moreCollectionItemsRequired = function (pageNum) {
    return pageNum >= (pagesRequired() - 1);
  };

  var nextPageNum = function () {
    return parseInt(currentPage) + 1;
  };

  var pagesRequired = function () {
    return Math.ceil(gridView.collection().length / perPage);
  };

  var pagePosition = function (pageNum) {
    var position = -1 * ((pageNum - 1) * parseInt(options.pageWidth)) + 'px';
    return position
  };

  var previousPageNum = function () {
    return parseInt(currentPage) - 1;
  };

  // determines whether the grid can be paged backwards
  gridView.canPageBackward = function () {
    return currentPage > 1;
  };

  // determines whether the grid can be paged forwards
  gridView.canPageForward = function () {
    return currentPage !== pagesRequired();
  };

  gridView.currentPage = function () {
    return currentPage
  }

  // generates the html for the grid view, overriding the generateHtml method
  // defined in base
  gridView.generateHtml = function () {
    var self = this;
    if (this.collectionIsEmpty()) {
      drawBlankState.call(this);
    } else {
      for (var i=1; i <= pagesRequired(); i++) {
        drawPage.call(this, i);
      };
      this.bind('pageAnimateStart', function () { drawPaginationControls.call(this) });
      drawPaginationControls.call(this);
      displayCurrentPage.call(this);
    };

    this.bind('paginate', function (e, p) { self.showPage(p) })

    addStyles.call(this);
    return this.html.addClass(this.htmlClass());
  }

  // scroll the grid to show the page number passed in as an argument
  gridView.showPage = function (pageNum) {
    var self = this
    if (pageNum <= pagesRequired() && pageNum > 0) {
      currentPage = pageNum;
      this.trigger('pageAnimationStart', pageNum);
      this.html.find('.grid-page-holder').animate({
        left: pagePosition(pageNum)
      }, options.paginationSpeed, options.paginationEasing, function () {
        self.trigger('pageAnimationEnd', pageNum);
      });
      if (moreCollectionItemsRequired(pageNum)) {
        self.trigger('collectionItemsNeeded');
      };
    } else {
      throw("cannot show a page that doesn't exist");
    };
  };

  return gridView;
}