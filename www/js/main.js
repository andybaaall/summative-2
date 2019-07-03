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


// inactive states on load
$('#partyDetails').hide();
$('#topRightLogo').hide();
$('#partyNext').hide();
$('#partyError').hide();
$('#mapDetails').hide();


// let's go btn

$('#letsGo').click(function(){
  $('#landingPage').hide();
  $('#partyDetails').show();
  $('#topRightLogo').show();
})

// party details validation

var people = document.getElementById('people');
var days = document.getElementById('days');
hasPeople = false;
hasDays = false;

function validate(owner , min , max){
  var val = parseInt(owner.value);
  if (val <= min || val >= max) {
    $('#partyError').show();
    $('#errorMsg').html('Please enter a number between ' + (min + 1) + ' and ' + (max - 1) + ' in the \'how many ' + owner.id + '\' field.');
  } else {
    if (owner.id === 'people'){
      hasPeople = true;
    } else {
      hasDays = true;
    }
  }
  if (hasPeople === true && hasDays === true){
    $('#partyNext').show();
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
  $('#partyError').hide();
})

var availableCars = [];

// determines which cars are available based on party details
document.getElementById('partyNext').addEventListener('click', function(){
  for (var i = 0; i < cars.length; i++) {
    if ((people.value >= cars[i].minPeople) && (people.value <= cars[i].maxPeople) && (days.value >= cars[i].minDays) && (days.value <= cars[i].maxDays)) {
      availableCars.push(cars[i]);
      $('#partyDetails').hide();
      $('#mapDetails').show();
    }
  }
  console.log(availableCars);
  if (availableCars.length === 0){
    $('#partyNext').hide();
    $('#partyError').show();
    $('#errorMsg').html('Sorry, but we can\'t find any vehicles that match your trip.');
  }
})

console.log('this is a test commit log');
