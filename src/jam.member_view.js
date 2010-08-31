Jam.MemberView = function (name, member, options) {
  var memberView = Jam.newObjectFrom(Jam.Base(options))
  var member = member || {}

  // should look through the html fragment and auto populate where possible
  var autoPopulate = function () {
    
  }

  // overwrite base generateHtml so that it calls populate which
  // should be a user overriden function
  memberView.generateHtml = function () {
    autoPopulate.call(this)
    memberView.prototype.generateHtml()
  }

  // this should be overriden to provide custom behaviour and 
  memberView.populate = function () {
    
  }

  return memberView;
}