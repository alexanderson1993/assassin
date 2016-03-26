Template.collectionCreate.events({
  'click .create-btn': function () {
    $('#orionBootstrapCollectionsCreateForm').submit();
  }
});


AutoForm.addHooks('orionBootstrapCollectionsCreateForm', {
  onSuccess: function() {
    RouterLayer.go(this.collection.indexPath());
  }
});

Template.collectionUpdate.events({
  'click .save-btn': function () {
    $('#orionBootstrapCollectionsUpdateForm').submit();
  }
});

AutoForm.addHooks('orionBootstrapCollectionsUpdateForm', {
  onSuccess: function() {
    RouterLayer.go(this.collection.indexPath());
  }
});
