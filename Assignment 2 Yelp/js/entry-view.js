(function(window, document, undefined) {
  var EntryView = {};

  /* Renders an entry into the given $entry element. Requires the object
   * representing the active entry (activeEntryData). If this object is null,
   * picks the first existing entry. If no entry exists, this view will display
   * the CreatingEntryView. */

  EntryView.render = function($entry, activeEntryData) {
  	EntryModel.loadAll(function(error, entries) {
      if(!error){
        var entry_obj = {
  	  		"viewing" : true,
  	  		"entries" : entries,
  	  		"activeEntryData" : activeEntryData
  	  	}

        if (!activeEntryData){
          CreatingEntryView.render($entry);
        } else {
  	  	  $entry.html(Util.renderEntryTemplate(entry_obj));
          GoogleMapView.render($(".map"), activeEntryData);
        }

        var $dropDown = $(".dropdown select");
        $dropDown.change(function(event){
          entries.forEach(function(entry){
            if (entry.id === +$dropDown.val())
              EntryView.render($entry, entry);
          })
        });

        addNewButtonEventListener($entry);
        addEditButtonEventListener($entry, activeEntryData);
        addDeleteButtonEventListener($entry, activeEntryData);
       }
  	});
  };

  /*Adds an event listener to the green NEW button, which opens the CreatingEntryView when
  called. */
  function addNewButtonEventListener($entry){
    $(".green.new").click(function(event){
      event.preventDefault();
      CreatingEntryView.render($entry);
    });
  }

  /*Adds an event listener to the teal EDIT button, which opens the EditingEntryView when
  called. */
  function addEditButtonEventListener($entry, activeEntryData){
    $(".teal.edit").click(function(event){
      event.preventDefault();
      EditingEntryView.render($entry, activeEntryData);
    });
  }

  /*Adds an event listener to the red DELETE button, which demoves the current entry from the server
  and displays the first entry in the database if it exists, or the CreatingEntryView if the server database is empty.
  Displays an error if there was an error upon the delete.
   */
  function addDeleteButtonEventListener($entry, activeEntryData){
    $(".red.delete").click(function(event){
      event.preventDefault();
      EntryModel.remove(activeEntryData.id, function(error){
        EntryModel.loadAll(function(error, newEntries){ //note: re-loading as a strategy against multiple users able to add/delete to the server. Data may have changed since I first loaded it. I know this shouldn't be in an actual app as it would slow down performance considerably but I'm not sure how to work around the server thing without this.
          if (!error && newEntries.length === 0){
            CreatingEntryView.render($entry);
          } else if (!error && newEntries.length > 0) {
            EntryView.render($entry, newEntries[0])
          } else if (error){
            $(".error").text(error);
          }
        });
      });
    });   
  }

  window.EntryView = EntryView;
})(this, this.document);
//renders curernt entry

