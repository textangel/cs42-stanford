(function(window, document, undefined) {
  var SearchModel = {};

  var SEARCH_URL = '/search?query=';
  var STATUS_OK = 200;
  var IS_ERROR = true;

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = function(query, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if(request.status === STATUS_OK) {
        var entries = JSON.parse(request.responseText);
        callback(null, entries)
      } else {
        callback(IS_ERROR, null);
      }
    });
    request.open('GET', SEARCH_URL + encodeURIComponent(query));
    request.send();
  };

  window.SearchModel = SearchModel;
})(this, this.document);
