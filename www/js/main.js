// available vehicles
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

// inactive states on load
$('#partyDetails').hide();
$('#topRightLogo').hide();
$('#partyNext').hide();


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
  var val = owner.value;
  if (val <= min || val >= max) {
    console.log('please enter a number between ' + (min + 1) + ' and ' + (max - 1));
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

// first 'next' button - goes to vehicle select
var availableCars = [];

// determines which cars are available based on party details
document.getElementById('partyNext').addEventListener('click', function(){

  for (var i = 0; i < cars.length; i++) {

    // if (people.value >= cars[i].minPeople){
    //   console.log('got enough people for ' + cars[i].name);
    // } else if (people.value === cars[i].maxPeople){
    //   console.log('got too many people for ' + cars[i].name);
    // }
    // if (days.value >= cars[i].minDays){
    //   console.log('got enough days for ' + cars[i].name);
    // } else if (days.value >= cars[i].maxDays){
    //   console.log('got too many days for ' + cars[i].name);
    // }

    console.log(cars[i].name + ' min people is ' + cars[i].minPeople);
    console.log(cars[i].name + ' max people is ' + cars[i].maxPeople);
    console.log(cars[i].name + ' min days is ' + cars[i].minDays);
    console.log(cars[i].name + ' max days is ' + cars[i].maxDays);
  }
})
