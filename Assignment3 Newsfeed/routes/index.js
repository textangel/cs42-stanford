var https = require('https');
var Post = require('../models/post.js');
var soundcloud = require('../lib/soundcloud.js');
var flickr = require('../lib/flickr.js');
var youtube = require('../lib/youtube.js');
var NUM_APIS = 3;

module.exports = function(app) {
  /* Renders the newsfeed landing page. */
  app.get('/', function(request, response) {
    response.render('index.html');
  });

  /* Gets all the posts from the database */
  app.get('/posts', function(request, response) {
    Post.find(function(error, posts){
      if(error){
        throw error;
      }
      response.json(200, posts);
    })
  });

  /* Posts a new post to the database */
  app.post('/posts', function(request, response) {
    var newPost = new Post({
      api: request.body.api,
      source: request.body.source,
      title: request.body.title,
      upvotes: 0
    });

    if (newPost.api && newPost.source && newPost.title){  //all fields present
      newPost.save(function(error) {
        if (error)
          throw error;
        response.json(200, newPost);
      });
    }
  });

  /* Removes a post from the database */
  app.post('/posts/remove', function(request, response) {
    Post.findByIdAndRemove(request.body.id, function(error) {
      if (error) {
        throw error;
      }
      response.json(200, null);
    });
  });

  /* Upvotes a post in the database */
  app.post('/posts/upvote', function(request, response) {
    Post.findById(request.body.id, function(error, post) {
      if (error){
        throw error;
      }
      post.upvotes++;
      post.save(function(error) {
        if (error) {
          throw error;
        }
      response.json(200, post);
      });
    });

  });

 /* Searches Soundcloud, YouTube, and Flickr for a given search query,
  And fetches one content from each service most relevant to the query
  and returns it as an array to the user. The array should have three
  entries, one from each API, each of which has a title and 
  a source embed URL.*/
  app.get('/search', function(request, response){
    var newQuery = request.query.query; 

    var most_relevant_results = [];
    var count = 0;
    var arrayindex = 0;

    soundcloud.search(newQuery, function(error, soundcloud_result){
      count++;
      if (error){
        throw error;
      } else {
        if(soundcloud_result[0]){
          most_relevant_results[arrayindex] = soundcloud_result[0];
          most_relevant_results[arrayindex].api = 'soundcloud';
          arrayindex++;
        }
        if (count === NUM_APIS) {
            response.json(200, most_relevant_results); //sends the response back to the client.
        }
      }
    });

    youtube.search(newQuery, function(error, youtube_result){
      count++;
      if (error){
        throw error;
      } else {
        if (youtube_result[0]){
          most_relevant_results[arrayindex] = youtube_result[0];
          most_relevant_results[arrayindex].api = 'youtube';
          arrayindex++;
        }
        if (count === NUM_APIS) {
            response.json(200, most_relevant_results); //sends the response back to the client.
        }
      }
    });

    flickr.search(newQuery, function(error, flickr_result){
      count++;
      if (error){
        throw error;
      } else {
        if (flickr_result[0]){
          most_relevant_results[arrayindex] = flickr_result[0];
          most_relevant_results[arrayindex].api = 'flickr';
          arrayindex++;
        }
        if (count === NUM_APIS) {
            response.json(200, most_relevant_results); //sends the response back to the client.
        }
      }
    });
  });
};
