/*  Jam JavaScript Widget library, version 0.2.0
 *  (c) 2010 Oliver Nightingale
 *
 *  Released under MIT license.
 */

Jam = {
  version: '0.2.0',
  newObjectFrom: function (oldObject) {
    function F() {};
    F.prototype = oldObject;
    return new F();
  }
}
Jam.Base = function (name, options) {
  var base = {};
  var containerSelector = options.containerSelector || 'body';
  var eventHandler = options.eventHandler || $(document);
  var errorPrefix = 'Jam.Base';
  var name = name;
  var templateSelector = options.templateSelector;
  var template = $(templateSelector);
  var widget = options.widget;
  var eventNamespace = function () {
    return name + ':' + widget;
  };

  base.bind = function (eventName, callback) {
    eventHandler.bind(eventName + '.' + eventNamespace(), callback);
    return this;
  };

  base.htmlClass = function (className) {
    return name + ' ' + widget + '-' + className;
  }

  base.container = function () {
    return $(containerSelector);
  };

  base.generateHtml = function () {
    return this.html;
  };

  base.html = template.clone();

  base.insertHtml = function () {
    this.container().html(this.html);
  };

  base.options = function () {
    return options
  }

  base.render = function (customization) {
    var customization = customization || function () {};

    this.generateHtml();
    customization.call(this);
    this.insertHtml();
  };

  base.remove = function () {
    this.html.remove();
    eventHandler.unbind('.' + eventNamespace())
  };

  base.resetHtml = function () {
    this.html = template.clone()
  }

  base.trigger = function (eventName, data) {
    eventHandler.trigger(eventName + '.' + eventNamespace(), data);
  };

  return base;
}
Jam.CollectionView = function (name, options) {
  var collectionView = Jam.newObjectFrom(Jam.Base(name, options));
  var collection = options.collection || []

  collectionView.collectionIsEmpty = function () {
    return collection.length === 0
  }

  collectionView.collection = function () {
    return collection;
  }

  collectionView.emptyCollection = function () {
    collection = [];
    this.trigger('collectionEmptied')
  };

  collectionView.setCollection = function (newCollection) {
    collection = newCollection;
    this.trigger('collectionUpdated', collection);
    return collection;
  };

  collectionView.updateCollection = function (newCollection) {
    collection = newCollection
    this.trigger('collectionUpdated', collection);
    this.resetHtml()
    this.render()
    return collection;
  };

  return collectionView;
}
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

  gridView.canPageBackward = function () {
    return currentPage > 1;
  };

  gridView.canPageForward = function () {
    return currentPage !== pagesRequired();
  };

  gridView.currentPage = function () {
    return currentPage
  }

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
Jam.Helper = (function ($) {
  var h = {};
  var bytesInAMegabyte = 1048576

  h.bytesToMegabytes = function (bytes) {
    return (Math.round((bytes / bytesInAMegabyte) * 100) / 100) + "MB"
  },

  h.millisecondsToHrsMinSec = function (milliseconds) {
    var duration_seconds = milliseconds / 1000
    var h = Math.floor(duration_seconds / 3600);
    var m = Math.floor(duration_seconds % 3600 / 60);
    var s = Math.floor(duration_seconds % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
  },

  h.numberToCurrency = function (number, options) {
    var settings = $.extend({}, { currency: '£' }, options || {})
    return settings.currency + new Number(number).toFixed(2)
  },

  h.pageCentreX = function (elementWidth) {
    var pageWidth = $('body').width()
    return (pageWidth / 2) - (elementWidth / 2)
  },

  h.pageCentreY = function (elementHeight) {
    var pageHeight = $('body').height()
    return (pageHeight / 2) - (elementHeight / 2)
  },

  h.timeAgoInWords = function(time){
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
      return;

    return day_diff == 0 && (
        diff < 60 && "just now" ||
        diff < 120 && "1 minute ago" ||
        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
        diff < 7200 && "1 hour ago" ||
        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
      day_diff == 1 && "yesterday" ||
      day_diff < 7 && day_diff + " days ago" ||
      day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
  },

  h.viewPortTop = function (offset) {
    return $('body').scrollTop() + offset
  }

  return h;
})(jQuery)
