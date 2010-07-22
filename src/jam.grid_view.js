Jam.GridView = function (name, options) {
  var options = $.extend(options, {'widget': 'grid-view'})
  var gridView = Jam.newObjectFrom(Jam.CollectionView(name, options))
  var currentPage = 1
  var perPage = parseInt(options.perPage) || 1
  var self = this
  var pageTemplate = $('<ul class="grid-view-page clearfix"></ul>')
  var gridItemWrap = $('<li class="grid-view-item"></li>').css({
    'float': 'left',
    'width': (parseInt(options.pageWidth) / options.grid['x']) + 'px'
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
  }

  function displayCurrentPage () {
    if (self.page > self.pagesRequired) self.page = self.pagesRequired
    var position = -1 * ((self.page - 1) * parseInt(self.settings.pageWidth)) + 'px'
    self.html.find('.grid-page-holder').css({'left': position})
  }

  var drawBlankState = function () {
    if (options.blankStateHtml) {
      this.html.find('.grid-page-holder')
        .append(pageTemplate.clone().append(options.blankStateHtml));
    };
  }

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

    gridView.html.find('.grid-page-holder').append(pageHtml);
  }

  var drawPaginationControls = function () {
    
  }

  var pagesRequired = function () {
    return Math.ceil(gridView.collection().length / perPage);
  };

  var pagePosition = function () {
    var position = -1 * ((currentPage - 1) * parseInt(options.pageWidth)) + 'px';
    this.html.find('.grid-page-holder').css({'left': position});
  };

  gridView.canPageBack = function () {
    return currentPage > 1;
  };

  gridView.canPageForward = function () {
    return currentPage !== pagesRequired();
  };

  gridView.generateHtml = function () {
    var self = this;

    if (this.collectionIsEmpty()) {
      drawBlankState();
    } else {
      for (var i=1; i <= pagesRequired(); i++) {
        drawPage.call(this, i);
      };
      this.bind('pageAnimateStart', function () { drawPaginationControls() });
      drawPaginationControls();
      displayCurrentPage();
    };

    addStyles.call(this);
    return this.html.addClass(this.htmlClass());
  }

  return gridView;
}