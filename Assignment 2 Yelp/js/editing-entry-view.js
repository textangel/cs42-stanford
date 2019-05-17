(function(window, document, undefined) {
  var EditingEntryView = {};

  /* Renders a view to allow the user to edit an entry. Requires the $entry
   * element and an object representing the active entry. */
  EditingEntryView.render = function($entry, activeEntryData) {
    var entry_obj = {
   		editing: true,
    	entries: null,
    	activeEntryData: activeEntryData
    }

	$entry.html(Util.renderEntryTemplate(entry_obj));

	$(".teal.update").click(function(event){
	event.preventDefault();
		var newEntry = {
			address: $("[name='address']").val(),
	    	name: $("[name='name']").val(),
	    	description: $("[name='description']").val(),
	    	id: activeEntryData.id
		}
		EntryModel.update(newEntry, function(error){
			if (!error){
				EntryView.render($entry, newEntry); //EntryView is called to render the new entry
			} else {
            	$(".error").text(error);
			}
		});
	});

  };


  window.EditingEntryView = EditingEntryView;
})(this, this.document);
