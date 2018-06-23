var map;

function initMap(){
  var styles = [
    {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [{"saturation": "-100"}]
    },
    {
      "featureType": "administrative.province",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{"saturation": -100},{"lightness": 65},{"visibility": "on"}]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{"saturation": -100},{"lightness": "50"},{"visibility": "simplified"}]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{"saturation": "-100"}]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "all",
      "stylers": [{"lightness": "30"}]
    },
    {
      "featureType": "road.local",
      "elementType": "all",
      "stylers": [{"lightness": "40"}]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{"saturation": -100},{"visibility": "simplified"}]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{"hue": "#ffff00"},{"lightness": -25},{"saturation": -97}]
    },
    {
      "featureType": "water",
      "elementType": "labels",
      "stylers": [{"lightness": -25},{"saturation": -100}]
    }
  ];

  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    styles: styles,
    mapTypeControl:false
  });


  var markers = [];
  // location
  var locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
  ];

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  //Create marker for each locations
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      id: i
    });

    //Push the created marker to our array of markers.
    markers.push(marker);
    //Extend the boundaries of the map for each marker.
    bounds.extend(marker.position);
    // create an onClick event to open an Infowindow at each marker.
    marker.addListener('click', function(){
      populateInfoWindow(this, largeInfowindow);
    });
  };

  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
            var panorama = new google.maps.StreetViewPanorama(
              document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }
}
