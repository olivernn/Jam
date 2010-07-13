var GridView = function (name, options, instanceMethods) {

  var instanceMethods =  instanceMethods || {}

  var gridView = function (collection) {
    this.collection = collection || []
    this.pagesRequired = Math.ceil(this.collection.length / this.perPage)
    this.template = $(this.templateSelector)
    this.holder = $(this.holderSelector)
    this.html = this.template.clone(),
    this.viewPort = this.html.find('.view-port'),
    this.pageTemplate = $('<ul class="grid-page clearfix"></ul>'),
    this.pageHolder = this.html.find('.page-holder'),
    this.page = 1
  }

  $.extend(gridView.prototype, GridView.InstanceMethods, instanceMethods, options)

  return gridView;
}