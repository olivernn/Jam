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

  // calculate the left offset to position the element centrally on the x axis 
  h.pageCentreX = function (elementWidth) {
    var pageWidth = $('body').width()
    return (pageWidth / 2) - (elementWidth / 2)
  },

  // calculate the top offset to position the element centrally on the y axis
  h.pageCentreY = function (elementHeight) {
    var pageHeight = $('body').height()
    return (pageHeight / 2) - (elementHeight / 2)
  },

  // http://ejohn.org/blog/javascript-pretty-date/
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