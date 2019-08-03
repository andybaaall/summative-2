// current fuel price in NZD
var fuelCost = 2.269;

// all vehicles
var cars = [
  {
    name: 'Motorbike',
    id: 'Motorbike',
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
    id: 'SmallCar',
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
    id: 'LargeCar',
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
    id: 'MotorHome',
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

// let's go btn
$('#letsGo').click(function(){
  console.log(markerA.position);
  $('#landingPage').addClass('d-none');
  $('#partyDetails').removeClass('d-none');
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
    $('#partyError').removeClass('d-none');
    $('#partyErrorMsg').html('Please enter a whole number between ' + (min + 1) + ' and ' + (max - 1) + ' in the \'how many ' + owner.id + '\' field.');
  }

  if (val <= min || val >= max) {
    $('#partyError').removeClass('d-none');
    $('#partyErrorMsg').html('Please enter a number between ' + (min + 1) + ' and ' + (max - 1) + ' in the \'how many ' + owner.id + '\' field.');
  } else {
    if (owner.id === 'people'){
      hasPeople = true;
    } else {
      hasDays = true;
    }
  }
  if (hasPeople === true && hasDays === true){
    $('#partyNext').removeClass('d-none');
  }
}

people.addEventListener('change', function(){
  validate(people , 0 , 7);
})

days.addEventListener('change', function(){
  validate(days , 0 , 16);
})

// closes party details error message
$('#partyErrorClose').click(function(){
  $('#partyError').addClass('d-none');
})

// determines which cars are available based on party details
document.getElementById('partyNext').addEventListener('click', function(){
  for (var i = 0; i < cars.length; i++) {
    if ((people.value >= cars[i].minPeople) && (people.value <= cars[i].maxPeople) && (days.value >= cars[i].minDays) && (days.value <= cars[i].maxDays)) {
      availableCars.push(cars[i]);
      $('#partyDetails').addClass('d-none');
      $('#mapDetails').removeClass('d-none');
    }
  }
  if (availableCars.length === 0){
    $('#partyNext').addClass('d-none');
    $('#partyError').removeClass('d-none');
    $('#partyErrorMsg').html('Sorry, but we can\'t find any vehicles that match your trip.');
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
  var options = {
      types: ['address'],
      componentRestrictions: {country: 'nz'},
    };
  var startAutocomplete = new google.maps.places.Autocomplete(startInput, options);
  var endAutocomplete = new google.maps.places.Autocomplete(endInput, options);

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
             distance = response.routes[0].legs[i].distance.text;
             time = response.routes[0].legs[i].duration.text;
           }
           directionsDisplay.setDirections(response);
         } else {
           $('#mapConfirm').addClass('d-none');
           $('#mapError').removeClass('d-none');
           $('#mapErrorMsg').html('error msg');
           $('#mapErrorClose').click(function(){
             $('#mapError').addClass('Sorry, but we couldn\'t find any routes for that journey!');
           })
         }
     })
    $('#mapConfirm').removeClass('d-none');
   } // getDirections()
}// initMap

// show vehicles page
document.getElementById('mapConfirm').addEventListener('click', function(){
  $('#mapDetails').addClass('d-none');
  $('#vehicleDetails').removeClass('d-none');

  for (var i = 0; i < availableCars.length; i++) {
    document.getElementById('vehiclesList').innerHTML += '<div class="row"><btn id="' + availableCars[i].id + '" class="btn btn-primary btn-round my-2" onclick="carSelect(this)"> ' + availableCars[i].name + '<br> $' + availableCars[i].hire + ' / day' + '<br>' + availableCars[i].fuel + ' L / 100km </btn></div>';
  } // availableCars loop
})

var chosenCar;

function carSelect(e){
  for (var i = 0; i < availableCars.length; i++) {
    if (e.id == availableCars[i].id) {
      chosenCar = [];
      chosenCar.push({
        name: availableCars[i].name,
        id: availableCars[i].id,
        minPeople: availableCars[i].minPeople,
        maxPeople: availableCars[i].maxPeople,
        minDays: availableCars[i].minDays,
        maxDays: availableCars[i].maxDays,
        fuel: availableCars[i].fuel,
        hire: availableCars[i].hire
      }) // push()
    } // if
  } // for loop
  $('#vehicleDetails').addClass('d-none');
  $('#results').removeClass('d-none');
  $('#results').html('<div class="row">driving distance is ' + distance + '</div><div class="row">driving time is ' + time + '</div> <div class="row">fuel cost is $' + Math.round(((parseInt(distance) / 100) * chosenCar[0].fuel * fuelCost)) + '.00</div><div class="row">hire cost is $' + (chosenCar[0].hire * days.value) + '.00</div><div class="row"></div>');
  $('#newTripBtn').removeClass('d-none');
} // carSelect()

// $.fakeLoader();
// 'loading' screen

function newTrip(){
  $('#vehiclesList').empty();
  $('#results').addClass('d-none');
  $('#landingPage').removeClass('d-none');
  $('#newTripBtn').addClass('d-none');

  // clearing input fields and associated arrays
  people.value = '';
  days.value = '';
  startInput.value = '';
  endInput.value = '';
  availableCars = [];
  chosenCar = [];

  // clearing map
  directionsDisplay.setMap(null);
  markerA.setMap(null);
  markerB.setMap(null);
  markerA.position = null;
  markerB.position = null;
  initMap();
}

document.getElementById('newTripBtn').addEventListener('click', function(){
  newTrip();
})

// replaces the async , defer and &callback from the HTML
google.maps.event.addDomListener(window, "load", initMap);
