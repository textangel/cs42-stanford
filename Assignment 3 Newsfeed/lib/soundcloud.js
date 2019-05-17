var request = require('request');

var SC_URL = 'https://api.soundcloud.com/tracks.json';
var SC_CLIENT_ID = '1c3aeb3f91390630d351f3c708148086';
var SC_EMBED_URL = 'https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F';
var STATUS_OK = 200;

/**
 * Queries SoundCloud for tracks that match the given query.
 *
 * @param query -- the search query to send to SoundCloud
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
	console.log("query: ", query);
  	var params = {
		q: query,
		client_id: SC_CLIENT_ID
	};

  	request.get({
		url: SC_URL,
		qs: params
	}, function(error, response, body){
		console.log("SEARCH " + response);
		if (error || (response.statusCode !== STATUS_OK)){
			callback(error, null);
		} else { 
			var title_and_id_array = [];
			var songs = JSON.parse(response.body);
			for (var i = songs.length - 1; i >= 0; i--) {
				title_and_id_array[i]= {
					'title': songs[i].title,
					'source': SC_EMBED_URL + songs[i].id
				};
			};
			callback(null, title_and_id_array);
		}
	}); 
};
