(function(window, document, undefined) {
  var EntryModel = {};

  var ENTRIES_URL = 'http://callbackjs.me:4155/entries/';
  var STATUS_OK = 200;

  /* Loads all entries from the server.
   *
   * Calls: callback(error, entries)
   *  error -- the error that occurred or NULL if no error occurred
   *  entries -- an array of entries
   */
  EntryModel.loadAll = function(callback) {
    var request  = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if (request.status === STATUS_OK) {
        var entries = JSON.parse(request.responseText);
        callback(null, entries);
      } else {
        callback(request.responseText, null);
      }
    });
    request.open('GET', ENTRIES_URL);
    request.send();
  };

  /* Adds the given entry to the list of entries. The entry must *not* have
   * an id associated with it.
   *
   * Calls: callback(error, entry)
   *  error -- the error that occurred or NULL if no error occurred
   *  entry -- the entry added, with an id attribute
   */
  EntryModel.add = function(entry, callback) {
    var request = new  XMLHttpRequest();
    request.addEventListener('load', function(event){
      if (request.status === STATUS_OK){
        var entryResponse = JSON.parse(request.responseText);
        callback(null, entryResponse);
      } else {
        callback(request.responseText, null);
      }
    });
    request.open('POST', ENTRIES_URL);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(entry));
  };

  /* Updates the given entry. The entry must have an id attribute that
   * identifies it.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or NULL if no error occurred
   */
  EntryModel.update = function(entry, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if(request.status === STATUS_OK){
        callback(null);
      } else {
        callback(request.responseText);
      }
    });
    request.open('POST', ENTRIES_URL + entry.id);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(entry));
  };

  /* Deletes the entry with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or NULL if no error occurred
   */
  EntryModel.remove = function(id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if(request.status === STATUS_OK){
        callback(null);
      } else {
        callback(request.responseText);
      }
    });
    request.open('POST', ENTRIES_URL + id + '/delete');
    request.setRequestHeader('Content-type', 'application/json');
    request.send();
  };

  
  window.EntryModel = EntryModel;
})(this, this.document);
