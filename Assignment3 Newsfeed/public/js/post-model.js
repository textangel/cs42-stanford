(function(window, document, undefined) {
  var PostModel = {};
  var POSTS_URL= '/posts';
  var STATUS_OK = 200;

  /**
   * Loads all newsfeed posts from the server.
   *
   * Calls: callback(error, posts)
   *  error -- the error that occurred or null if no error occurred
   *  results -- an array of newsfeed posts
   */
  PostModel.loadAll = function(callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if (request.status  === STATUS_OK){
        var posts = JSON.parse(request.responseText);
        callback(null, posts);
      } else {
        callback(request.responseText, null);
      }
    });
    request.open('GET', POSTS_URL);
    request.send();
  };

  /* Adds the given post to the list of posts. The post must *not* have
   * an _id associated with it.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the post added, with an _id attribute
   */
  PostModel.add = function(post, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if (request.status  === STATUS_OK){
        var response = JSON.parse(request.responseText);
        callback(null, response);
      } else {
        callback(request.responseText, null);
      }
    });
    request.open('POST', POSTS_URL);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(post));
  };

  /* Removes the post with the given id.
   *
   * Calls: callback(error)
   *  error -- the error that occurred or null if no error occurred
   */
  PostModel.remove = function(this_id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      if (request.status  === STATUS_OK){
        callback(null);
      } else {
        callback(request.responseText);
      }
    });
    request.open('POST', POSTS_URL + "/remove");
    request.setRequestHeader('Content-type', 'application/json');
    var id_obj = {
      id: this_id
    }
    request.send(JSON.stringify(id_obj));
  };

  /* Upvotes the post with the given id.
   *
   * Calls: callback(error, post)
   *  error -- the error that occurred or null if no error occurred
   *  post -- the updated post model
   */
  PostModel.upvote = function(this_id, callback) {
    var request = new XMLHttpRequest();
    request.addEventListener('load', function(event){
      var post = JSON.parse(request.responseText);
      if (request.status  === STATUS_OK){
        callback(null, post);
      } else {
        callback(request.responseText, null);
      }
    });
    request.open('POST', POSTS_URL + "/upvote");
    request.setRequestHeader('Content-type', 'application/json');
    var id_obj = {
      id: this_id
    }
    request.send(JSON.stringify(id_obj));
  };

  window.PostModel = PostModel;
})(this, this.document);
