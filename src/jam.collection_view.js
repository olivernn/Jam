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

  collectionView.updateCollection = function () {
    if (arguments.length === 1) {
      collection = collection.concat(arguments);
    } else {
      $.each(arguments, function () {
        collection.push(this);
      });
    };
    this.trigger('collectionUpdated', collection);
    return collection;
  };

  return collectionView;
}