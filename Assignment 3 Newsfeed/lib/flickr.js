var request = require('request');
var FLICKR_URL = 'https://api.flickr.com/services/rest/?';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';
var STATUS_OK = 200;

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
    var params = {
		api_key: FLICKR_API_KEY,
		text: query,
		method: 'flickr.photos.search',
		format: 'json',
		media: 'photos',
		sort: 'relevance',
		nojsoncallback: 1
	};
  	request.get({
		url: FLICKR_URL,
		qs: params
	}, function(error, response, body){
		if (error || (response.statusCode !== STATUS_OK)){
			callback(response, null);
		} else { 
			var title_and_source_array = [];
			var photos = (JSON.parse(response.body)).photos.photo;
			for (var i = photos.length - 1; i >= 0; i--) {
				var p = photos[i];
				title_and_source_array[i] = {
					'title': p.title,
					'source': 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '_z.jpg'
				}
			};
			callback(null, title_and_source_array);
		}
	});
};
