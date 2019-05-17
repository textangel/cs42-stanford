(function(window, document, undefined) {
  var MainView = {};

  /* Renders the main area, showing entries. */
  MainView.render = function($body) {
    var $entry = $body.find('#entry');
    EntryModel.loadAll(function(error, entries){
    	if(!error)
    		EntryView.render($entry, entries[0]);
    });
  };

  window.MainView = MainView;
})(this, this.document);
