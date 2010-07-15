Jam.GridView = function (name, options, methods) {
  var methods = methods || {}
  var name = name
  var options = options
  var widget = 'gridView'

  var gridView = function (collection, eventHandlerSelector) {
    if (eventHandlerSelector) {
      this.eventHandler = $(eventHandlerSelector)
    } else {
      this.eventHandler = $(document)
    };
    this.eventNamespace = name + ':' + widget
    this.name = name
    this.collection = collection
    this.settings = $.extend(Jam.GridView.defaults, options)
    this.page = 1
    this.html = $(this.settings.templateSelector).clone()
    this.holder = $(this.settings.holderSelector)
  }

  $.extend(gridView.prototype, Jam.GridView.instanceMethods, methods)

  return gridView
}