(function(window, document, undefined) {
  var NewsfeedView = {};
  var newsfeedPostTemplate = document.getElementById('newsfeed-post-template'); 
  var templates = {
    renderPost: Handlebars.compile(newsfeedPostTemplate.innerHTML)
  };

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function(error, response_posts){
      if (error) {
        $('.error').text('Failed to load post.');
      } else {
        for (var i = response_posts.length - 1; i >= 0; i--) {
          NewsfeedView.renderPost($newsfeed, response_posts[i], false);
        };
      }
    });

    $newsfeed.imagesLoaded(function() {
      $newsfeed.masonry({
        columnWidth: '.post',
        itemSelector: '.post'
      });
    });

  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, input_post, updateMasonry) {
    var $post = $(templates.renderPost(input_post));
    $post.prependTo($newsfeed);
    var $upvoteButton = $post.find("a.upvote");
    $upvoteButton.click(function(event){
      event.preventDefault();
      PostModel.upvote(input_post._id, function(error, response){
        if(error){
          $('.error').text('Failed to update post.');
        } else {
          $upvoteButton.find(".upvote-count").text(response.upvotes);
        }
      });
    });

    var $deleteButton = $post.find(".remove");
    $deleteButton.click(function(event){
      event.preventDefault();
      PostModel.remove(input_post._id, function(error, response){
        if(error){
          $('.error').text('Failed to remove post.');
        } else {
          $newsfeed.masonry('remove', $post);
          $newsfeed.masonry();
        }
      });
    });

    if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }
  };

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
