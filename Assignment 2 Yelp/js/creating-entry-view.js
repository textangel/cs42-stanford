(function(window, document, undefined) {
  var CreatingEntryView = {};
  
  /* Renders a view to allow the user to create an entry. Requires the $entry
   * element. */
  CreatingEntryView.render = function($entry) {
    var entry_obj = {
      creating: true,
      entries: null,
      activeEntryData: null
	}
	$entry.html(Util.renderEntryTemplate(entry_obj));

	$(".green.add").click(function(event){
		event.preventDefault();
		var newEntry = {
			address: $("[name='address']").val(),
	    	name: $("[name='name']").val(),
	    	description: $("[name='description']").val()
		}
		EntryModel.add(newEntry, function(error, newEntry){
			if (!error){
				EntryView.render($entry, newEntry); //EntryView is called to render the new entry
			} else {
				$(".error").text(error);
			}
		});
	});
  };

  window.CreatingEntryView = CreatingEntryView;
})(this, this.document);
