var map;

function initMap(){
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });

  var markers = [];
  // location
  var locations = [
    {title:'Tribeca', location: {lat: 40.719526, lng: -74.0089934}},
    {title:'Penthouse', location: {lat: 40.7713024, lng: -73.9632393}}
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

  function populateInfoWindow(marker, infowindow){
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.position + '</div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function (){
        infowindow.setMarker(null);
      });
    }
  };
}
