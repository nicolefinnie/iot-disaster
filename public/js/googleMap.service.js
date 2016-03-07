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
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      mapTypeControl: false,
      scrollwheel: false,
      draggable: true,
      styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},
               {"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},
               {"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},
               {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
               {"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},
               {"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}
               ],
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
  var minionLocation = new google.maps.LatLng(minionPos.lat, minionPos.lng);
  var minionGirlLocation = new google.maps.LatLng(minionGirlPos.lat, minionGirlPos.lng);
  var minionOneEyeLocation = new google.maps.LatLng(minionOneEyePos.lat, minionOneEyePos.lng);
  var minionDuckLocation = new google.maps.LatLng(minionDuckPos.lat, minionDuckPos.lng);
  var minionPurpleLocation = new google.maps.LatLng(minionPurplePos.lat, minionPurplePos.lng);
  
// resident minion
  var residentMinionImage = {
      url: 'images/freeMinionIcons/minion.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(48, 48)
    };
  
   residentMinionMarker = new google.maps.Marker({
      position: minionLocation,
      map: map,
      draggable: true,
      title: minion,
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
    position: minionGirlLocation,
    map: map,
    draggable: true,
    title: minionGirl,
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
    position: minionOneEyeLocation,
    map: map,
    draggable: true,
    title: minionOneEye,
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
    position: minionDuckLocation,
    map: map,
    draggable: true,
    title: minionDuck,
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
    position: minionPurpleLocation,
    map: map,
    draggable: true,
    title: minionPurple,
    icon: residentMinionPurpleImage,
    zIndex: 3});
  
  var infowindow = new google.maps.InfoWindow({
    content: '<div><p>'+minionDialog+'</p></div>'
  });
  
  var infowindowGirl = new google.maps.InfoWindow({
    content: '<div><p>'+minionGirlDialog+'</p></div>'
  });
  
  var infowindowOneEye = new google.maps.InfoWindow({
    content: '<div><p>'+minionOneEyeDialog+'</p></div>'
  });
  
  var infowindowDuck = new google.maps.InfoWindow({
    content: '<div><p>'+minionDuckDialog+'</p></div>'
  });
  
  var infowindowPurple = new google.maps.InfoWindow({
    content: '<div><p>'+minionPurpleDialog+'</p></div>'
  });
  
  google.maps.event.addListener(residentMinionMarker, 'click', function() {
      infowindow.open(map,residentMinionMarker);
  });
  
  google.maps.event.addListener(residentMinionGirlMarker, 'click', function() {
    infowindowGirl.open(map,residentMinionGirlMarker);
  });
 
  google.maps.event.addListener(residentMinionOneEyeMarker, 'click', function() {
    infowindowOneEye.open(map,residentMinionOneEyeMarker);
  });

  google.maps.event.addListener(residentMinionDuckMarker, 'click', function() {
    infowindowDuck.open(map,residentMinionDuckMarker);
  });
  
  google.maps.event.addListener(residentMinionPurpleMarker, 'click', function() {
    infowindowPurple.open(map,residentMinionPurpleMarker);
  });
  

}
