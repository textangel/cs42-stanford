(function(window, document, undefined) {
  var GoogleMapView = {};
  
  // zoom level for Google Map
  var DEFAULT_ZOOM = 14;
  var STATUS_OK = 200;

  /* Renders a map for the given entry into the provided $map element. */
  GoogleMapView.render = function($map, entryData) {
    var coordRequest  = new XMLHttpRequest();
    coordRequest.addEventListener('load', function(event){
      if (coordRequest.status === STATUS_OK) {
        var response = JSON.parse(coordRequest.responseText);
  	    if (response.status === "ZERO_RESULTS"){ //Google Maps API returned with an empty response array
  	    	$(".error").text("There was an error rendering the map.");
  	    } else {
  	    	var location = response.results[0].geometry.location;
          var mapOptions = {
            center: new google.maps.LatLng(location.lat, location.lng),
            zoom: DEFAULT_ZOOM
          };
          var map = new google.maps.Map($map[0], mapOptions); //setting up the map

          var marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            title: entryData.name
          }); //placing the marker on the map.
  	    }
      }
    });
    coordRequest.open('GET','https://maps.googleapis.com/maps/api/geocode/json?address='+ encodeURIComponent(entryData.address));
    coordRequest.send();
  };
  
  window.GoogleMapView = GoogleMapView;
})(this, this.document);
