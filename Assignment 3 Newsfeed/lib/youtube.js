var request = require('request');
var YT_URL = 'https://www.googleapis.com/youtube/v3/search';
var YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8';
var YT_EMBED_URL = 'http://www.youtube.com/embed/';
var STATUS_OK = 200;
/**
 * Queries YouTube for tracks that match the given query
 * 
 * @param query - the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
    var params = {
		key: YT_API_KEY,
		q: query,
		part: 'snippet',
		type: 'video'
	};

  	request.get({
		url: YT_URL,
		qs: params
	}, function(error, response, body){
		if (error || (response.statusCode !== STATUS_OK)){
			callback(response, null);
		} else { 
			var titles_and_sources_array = [];
			var videos = (JSON.parse(response.body)).items;
			for (var i = videos.length - 1; i >= 0; i--) {
				titles_and_sources_array[i] = {
					'title' : videos[i].snippet.title,
					'source' : YT_EMBED_URL + videos[i].id.videoId
				}
			};
			callback(null, titles_and_sources_array);
		}
	}); 
};
