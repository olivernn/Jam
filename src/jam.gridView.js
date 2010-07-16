Jam.GridView = function (name, options, methods) {
  methods = methods || {}
  options = options || {}
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
    this.page = 1
    this.settings = options
  }

  $.extend(gridView.prototype, Jam.GridView.instanceMethods, methods)

  return gridView
}