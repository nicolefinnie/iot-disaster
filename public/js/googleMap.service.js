var map;
var residentMinionMarker;
var residentMinionGirlMarker;
var residentMinionOneEyeMarker;
var residentMinionDuckMarker;


function initMap() {
  // Google Maps  
  $('#map').addClass('loading');    
  var latlng = new google.maps.LatLng(48.71, 9.05); 
  var settings = {
      zoom: 11,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      scrollwheel: false,
      draggable: true,
      styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},
               {"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},
               {"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},
               {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
               {"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},
               {"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}],
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
      navigationControl: false,
      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},            
  };
  map = new google.maps.Map(document.getElementById("map"), settings);

  google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
      $('#map').removeClass('loading');
  });

  initializeMarkers();
}

function initializeMarkers(){
  
  //=== markers ==== 
  var minionPos = new google.maps.LatLng(48.688725, 8.995648);
  var minionGirlPos = new google.maps.LatLng(48.6660732, 9.0388024);
  var minionOneEyePos = new google.maps.LatLng(48.7684932,9.153817);
  var minionDuckPos = new google.maps.LatLng(48.66542,8.9891824);
  var minionPurplePos = new google.maps.LatLng(48.755777, 8.882709);
  
 
  var infowindow = new google.maps.InfoWindow({
      content: '<div><p>Save me!</p></div>'
  });
  
  var infowindowGirl = new google.maps.InfoWindow({
    content: '<div><p>I am a nerd!</p></div>'
  });

// resident minion
  var residentMinionImage = {
      url: 'images/freeMinionIcons/minion.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(48, 48)
    };
  
   residentMinionMarker = new google.maps.Marker({
      position: minionPos,
      map: map,
      draggable: true,
      title: "Finnie's Nerdy Palace",
      icon: residentMinionImage,
      animation: google.maps.Animation.BOUNCE,
      zIndex: 3});

  // resident minion girl 
  var residentMinionGirlImage = {
      url: 'images/freeMinionIcons/miniongirl.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(48, 48)
    };
  
   residentMinionGirlMarker = new google.maps.Marker({
    position: minionGirlPos,
    map: map,
    draggable: true,
    title: "IBM Böblingen Lab",
    icon: residentMinionGirlImage,
    zIndex: 3});

  // resident minion single eye
  var residentMinionOneEyeImage = {
      url: 'images/freeMinionIcons/miniononeeye.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(48, 48)
    };
  
  residentMinionOneEyeMarker = new google.maps.Marker({
    position: minionOneEyePos,
    map: map,
    draggable: true,
    title: "Kai's Kingdom",
    icon: residentMinionOneEyeImage,
    zIndex: 3});
  
  // resident minion duck
  var residentMinionDuckImage = {
      url: 'images/freeMinionIcons/minionduck.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(48, 48)
    };
  
  residentMinionDuckMarker = new google.maps.Marker({
    position: minionDuckPos,
    map: map,
    draggable: true,
    title: "Pradeep's Castle",
    icon: residentMinionDuckImage,
    animation: google.maps.Animation.DROP,
    zIndex: 3});
  
  
  // resident minion purple
  var residentMinionPurpleImage = {
      url: 'images/freeMinionIcons/minionpurple.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(48, 48)
    };
  
  var residentMinionPurpleMarker = new google.maps.Marker({
    position: minionPurplePos,
    map: map,
    draggable: true,
    title: "Kepler's Town",
    icon: residentMinionPurpleImage,
    zIndex: 3});
  
  
  google.maps.event.addListener(residentMinionMarker, 'click', function() {
      infowindow.open(map,residentMinionMarker);
  });
  
  google.maps.event.addListener(residentMinionGirlMarker, 'click', function() {
    infowindowGirl.open(map,residentMinionGirlMarker);
  });
  
}
