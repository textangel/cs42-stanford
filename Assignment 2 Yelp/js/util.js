(function(window, document, undefined) {
  
  /*Util contains utility functions which may be used across modules.*/
  var Util = {};

  var entryTemplate = document.getElementById('entry-template'); 
  
  Util.renderEntryTemplate = Handlebars.compile(entryTemplate.innerHTML);

  window.Util = Util;
})(this, this.document);
