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
  var options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'nz'}
    };
  var startAutocomplete = new google.maps.places.Autocomplete(startInput , options);
  var endAutocomplete = new google.maps.places.Autocomplete(endInput , options);

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
           console.log('error message for no routes found!');
         }
     })
    showHidden($('#mapConfirm'));
   } // getDirections()
}// initMap

// show vehicles page
document.getElementById('mapConfirm').addEventListener('click', function(){
  $('#mapDetails').hide();
  showHidden($('#vehicleDetails'));

  for (var i = 0; i < availableCars.length; i++) {
    // document.getElementById('vehiclesList').innerHTML += '<div class="row">';
    // document.getElementById('vehiclesList').innerHTML +=  '<btn id="btn' + availableCars.id + '" class="btn btn-round btn-lg btn-primary">';
    // document.getElementById('vehiclesList').innerHTML +=    '<h4>' + availableCars.name + '</h4>';
    // document.getElementById('vehiclesList').innerHTML +=    '<p>$' + availableCars.hire + ' / day</p>';
    // document.getElementById('vehiclesList').innerHTML +=    '<p>minimum hire ' + availableCars.minDays + '</p>';
    // document.getElementById('vehiclesList').innerHTML +=    '<p>minimum hire ' + availableCars.minDays + '</p>';
    // document.getElementById('vehiclesList').innerHTML +=    '<p>maximum hire ' + availableCars.maxDays + '</p>';
    // document.getElementById('vehiclesList').innerHTML +=    '<p>' + availableCars.fuel + 'L / 100km</p>';
    // document.getElementById('vehiclesList').innerHTML +=  '</btn>';
    // document.getElementById('vehiclesList').innerHTML += '</div>';

    document.getElementById('vehiclesList').innerHTML += '<div class="row"><btn id="' + availableCars[i].id + '" class="btn btn-primary btn-round my-2" onclick="carSelect()"> ' + availableCars[i].name + '<br> $' + availableCars[i].hire + ' / day' + '<br>' + availableCars[i].fuel + ' L / 100km </btn></div>';
  } // availableCars loop
})

var chosenCar;

function carSelect(){
  document.addEventListener('click' , function(e){

    for (var i = 0; i < availableCars.length; i++) {
      if (e.srcElement.id == availableCars[i].id) {
        // console.log('you clicked on btn' + e.srcElement.id);
        // console.log('you clicked on array item' + availableCars[i].id);
        chosenCar = [];
        chosenCar.push({
          name: availableCars[i].name,
          id: availableCars[i].id,
          minPeople: availableCars[i].minPeople,
          maxPeople: availableCars[i].maxPeople,
          minDays: availableCars[i].minDays,
          maxDays: availableCars[i].maxDays,
          fuel: availableCars[i].fuel,
          // fuel is a measurement of L / km
          hire: availableCars[i].hire
          // hire is a measurement of $ / day)
        })
      } // if
    } // for loop
    $('#vehicleDetails').hide();
    showHidden($('#results'));
    console.log(chosenCar);
    document.getElementById('results').innerHTML = '<div class="row">driving distance is ' + distance + '</div><div class="row">driving time is ' + time + '</div> <div class="row">fuel cost is $' + Math.round(((parseInt(distance) / 100) * chosenCar[0].fuel * fuelCost)) + '.00</div><div class="row">hire cost is $' + (chosenCar[0].hire * days.value) + '.00</div><div class="row"><btn onclick="newTrip()" class="btn btn-round btn-primary">New Trip</btn></div>';
  }) // event listener
} // carSelect()


// 'loading' screen

function newTrip(){
  console.log('got a click');
}



// replaces the async , defer and &callback from the HTML
google.maps.event.addDomListener(window, "load", initMap);
