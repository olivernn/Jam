Jam.CollectionView = function (name, options) {
  var collectionView = Jam.newObjectFrom(Jam.Base(name, options));
  var collection = options.collection || []

  // returns whether or not the collection is empty
  collectionView.collectionIsEmpty = function () {
    return collection.length === 0
  }

  // returns the collection array
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