// all vehicles
var cars = [
  {
    name: 'Motorbike',
    minPeople: 1,
    maxPeople: 1,
    minDays: 1,
    maxDays: 5,
    fuel: 3.7,
    // fuel is a measurement of L / km
    hire: 109
    // hire is a measurement of $ / day
  },
  {
    name: 'Small car',
    minPeople: 1,
    maxPeople: 2,
    minDays: 1,
    maxDays: 10,
    fuel: 8.5,
    // fuel is a measurement of L / km
    hire: 129
    // hire is a measurement of $ / day
  },
  {
    name: 'Large car',
    minPeople: 1,
    maxPeople: 5,
    minDays: 1,
    maxDays: 10,
    fuel: 9.7,
    // fuel is a measurement of L / km
    hire: 144
    // hire is a measurement of $ / day
  },
  {
    name: 'Motor home',
    minPeople: 2,
    maxPeople: 6,
    minDays: 2,
    maxDays: 15,
    fuel: 17,
    // fuel is a m.easurement of L / km
    hire: 144
    // hire is a measurement of $ / day
  }
]

// vehicles available to the user
var availableCars = [];

function showHidden(element){
  element.removeClass('d-none');
}


// let's go btn
$('#letsGo').click(function(){
  $('#landingPage').hide();
  showHidden($('#partyDetails'));
  showHidden($('#topRightLogo'));
  // $('#partyDetails').show();
  // $('#topRightLogo').show();
})

// party details validation
var people = document.getElementById('people');
var days = document.getElementById('days');
hasPeople = false;
hasDays = false;

function validate(owner , min , max){
  var val = owner.value;

  // not sure how to prevent and 'e' from being entered as value.
  if (val % 1 != 0){
    showHidden($('#partyError'));
    $('#errorMsg').html('Please enter a whole number between ' + (min + 1) + ' and ' + (max - 1) + ' in the \'how many ' + owner.id + '\' field.');
  }

  if (val <= min || val >= max) {
    showHidden($('#partyError'));
    $('#errorMsg').html('Please enter a number between ' + (min + 1) + ' and ' + (max - 1) + ' in the \'how many ' + owner.id + '\' field.');
  } else {
    if (owner.id === 'people'){
      hasPeople = true;
    } else {
      hasDays = true;
    }
  }
  if (hasPeople === true && hasDays === true){
    showHidden($('#partyNext'));
  }
}

people.addEventListener('change', function(){
  validate(people , 0 , 7);
})

days.addEventListener('change', function(){
  validate(days , 0 , 16);
})

// closes party details error message
$('#errorClose').click(function(){
  $('#partyError').addClass('d-none');
})

// determines which cars are available based on party details
document.getElementById('partyNext').addEventListener('click', function(){
  for (var i = 0; i < cars.length; i++) {
    if ((people.value >= cars[i].minPeople) && (people.value <= cars[i].maxPeople) && (days.value >= cars[i].minDays) && (days.value <= cars[i].maxDays)) {
      availableCars.push(cars[i]);
      $('#partyDetails').hide();
      showHidden($('#mapDetails'));
    }
  }
  if (availableCars.length === 0){
    $('#partyNext').hide();
    $('#partyError').show();
    $('#errorMsg').html('Sorry, but we can\'t find any vehicles that match your trip.');
  }
})

// map!

var map;
var distance;
var time;

var markerA;
var markerB;

var directionsDisplay;

function initMap(){
  var center = {
    lat: -41.270634,
    lng: 173.283966
  };

  var map = new google.maps.Map(document.getElementById('map'), {zoom: 6, center: center});

  var startInput = document.getElementById('startInput');
  var endInput = document.getElementById('endInput');
  var startAutocomplete = new google.maps.places.Autocomplete(startInput);
  var endAutocomplete = new google.maps.places.Autocomplete(endInput);

  if (markerA == null) {
    markerA = new google.maps.Marker({map: map});
  }
  if (markerB == null) {
    markerB = new google.maps.Marker({map: map});
  }

  startAutocomplete.bindTo('bounds', map);
  endAutocomplete.bindTo('bounds', map);


  function setMarker(markerX, autocomplete){
    autocomplete.addListener('place_changed', function(){
      var place;
      place = autocomplete.getPlace();
      markerX.setPosition(place.geometry.location);
      markerX.setVisible(true);
      map.panTo(place.geometry.location);
      if (markerA.position && markerB.position) {
        getDirections();
      }
    })
  }

  setMarker(markerA , startAutocomplete);
  setMarker(markerB , endAutocomplete);


  function getDirections(){
    if (directionsDisplay) {
      directionsDisplay.setMap(null);
    }
     var directionsService = new google.maps.DirectionsService();
     directionsDisplay = new google.maps.DirectionsRenderer({});
     directionsDisplay.setMap(map);
     directionsService.route({
       origin: markerA.position,
       destination: markerB.position,
       travelMode: 'DRIVING'
     }, function(response, status){
         if(status == 'OK'){
            for (var i = 0; i < response.routes[0].legs.length; i++) {
             var distance = response.routes[0].legs[i].distance.text;
             var time = response.routes[0].legs[i].duration.text;
           }
           directionsDisplay.setDirections(response);
         } else {
           console.log('error message for no routes found!');
         }
     })
    showHidden($('#mapConfirm'));
   } // getDirections()
}// initMap

// show vehicles page
document.getElementById('mapConfirm').addEventListener('click', function(){
  var vehicle;

  // hide map details
  // show vehicle details
  // for each item in the vehicles list, add a div showing data. They all share a class (e.g. carBtn)
  // show results
})
//
// // show results page
// document.getElementsByClassName('carBtn').addEventListener('click', function(){
//   // each vehicle 'btn' gets this function - it works out hire cost, petrol cost, time and distance, and prints them into ...
//   // ... the results screen (which includes a 'new trip' button)
// });
//
//
//
//
//



// replaces the async , defer and &callback from the HTML
google.maps.event.addDomListener(window, "load", initMap);



// stuff to do:
// bound autocomplete suggestions to NZ
