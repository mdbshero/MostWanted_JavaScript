"use strict"

//TEST REGION
//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults = {};
  switch (searchType) {
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
      searchResults = searchByTrait(people);
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person[0]) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch (displayOption) {
    case "info":

      // TODO: get person's info
      // let printThis = function (person, returnThis=""){
      //   for (const key in person[0]){
      //     returnThis += `${key} : ${person[0][key]}\n`
      //   }
      //   return returnThis      
      // }
      // alert(printThis(person))

      displayPerson(person);
      mainMenu(person, people); // restart
    break;
    case "family":
      // TODO: get person's family
      //Parents spouse siblings - No descendants
      alert(familyFinder(person, people));
      mainMenu(person, people); // restart
      break;
    case "descendants":
      // TODO: get person's descendants
      //Single layer of Kids
      alert(descendantFinder(person, people));
      mainMenu(person, people); // restart
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}



function familyFinder(person, people){
  let parents = JSON.stringify(((people.filter(family=>person[0].parents.includes(family.id))) != ''?people.filter(family=>person[0].parents.includes(family.id)):'N/A'),['firstName','lastName'],1)
  .replace(/},/g,'.NEWLINE.').replace(/({|}|\[|\]|")/g, '').replace(/(firstName: |lastName: )/g,'').replace(/,|\n |\n/g, '').replace(/\.NEWLINE\./g,',');


  let spouse = (JSON.stringify(((people.filter(family=>person[0].currentSpouse == family.id)) != ''? people.filter(family=>person[0].currentSpouse == family.id):"N/A"),['firstName','lastName'],1))
  .replace(/},/g,'.NEWLINE.').replace(/({|}|\[|\]|")/g, '').replace(/(firstName: |lastName: )/g,'').replace(/,|\n |\n/g, '').replace(/\.NEWLINE\./g,',');
 
  // let spouse = (JSON.stringify(people.filter(family=>person[0].currentSpouse == family.id) != ''? people.filter(family=>person[0].currentSpouse == family.id):"N/A"),['firstName','lastName'],1).replace(/({|}|\[|\]|"|,)/g, '').replace(/(firstName: |lastName: )/g,'').replace(/(\n,|,\n |\n |\n)/g, '')
  let siblings = (JSON.stringify(((people.filter(family=>(family.parents.includes(person[0].parents[0]) | family.parents.includes(person[0].parents[1])) && family != person[0])) != ''?people.filter(family=>(family.parents.includes(person[0].parents[0]) | family.parents.includes(person[0].parents[1])) && family != person[0]) :"N/A"),['firstName','lastName'],1))
  .replace(/},/g,'.NEWLINE.').replace(/({|}|\[|\]|")/g, '').replace(/(firstName: |lastName: )/g,'').replace(/,|\n |\n/g, '').replace(/\.NEWLINE\./g,',');

  // let spouse = people.filter(family=>person[0].currentSpouse == family.id)
  let stringReturn = `Family of ${person[0].firstName} ${person[0].lastName} ID: ${person[0].id}\nParent(s): ${parents}\nSpouse: ${spouse}\nSiblings: ${siblings}`;
  return(stringReturn);
}
function descendantFinder(person, people,fullList=[]){
  let descendants = people.filter(offspring => offspring.parents.includes(person[0].id))
  for (let i = 0; i < descendants.length; i++){
    fullList.push(descendants[i])
   descendantFinder([descendants[i]], people,fullList)
} 
  let stringReturn = `Descendants of ${person[0].firstName} ${person[0].lastName} ID: ${person[0].id}\nDecendant(s): ${descendantFormat(fullList)}`;
  
  return(stringReturn);
}

function descendantFormat (list) {
  list = JSON.stringify(list,['firstName','lastName'],1).replace(/},/g,'.NEWLINE.').replace(/({|}|\[|\]|")/g, '').replace(/(firstName: |lastName: )/g,'').replace(/,|\n |\n/g, '').replace(/\.NEWLINE\./g,',');
  if (!list){
    return ('N/A')
  } else {
    return list
  }
}


//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", autoValid).toLowerCase();
  let lastName = promptFor("What is the person's last name?", autoValid).toLowerCase();

  let foundPerson = people.filter(potentialMatch => potentialMatch.firstName.toLowerCase() === firstName && potentialMatch.lastName.toLowerCase() === lastName);

 

  // TODO: find the person single person object using the name they entered.
  return (foundPerson);
}


function searchByTrait(people){
  let traitsToSearch = promptFor(`Please enter the traits you would like to search for followed by a colon.\nSearchable traits: gender, occupation, eyecolor, weight, and height\nSeparate queries by AND or a Comma (,)\nExample:\ngender:male,eyecolor:blue\ngender:male AND occupation:nurse`,customValidation)
  traitsToSearch = traitsToSearch.split(/ AND | , |, | ,|,/g);
  let peopleWithTraits = people;
  let counter = 0;
  if (traitsToSearch.filter(person=> /gender:/gi.test(person)).length != 0){
    peopleWithTraits = searchByGender(peopleWithTraits,traitsToSearch.filter(person=> /gender:/gi.test(person)));
    counter++;
    // people = searchByGender(people, traitsToSearch)
  } 
  if (traitsToSearch.filter(person=> /occupation:/gi.test(person)).length != 0){
    peopleWithTraits = searchByOccupation(peopleWithTraits,traitsToSearch.filter(person=> /occupation:/gi.test(person)));
    counter++;
    
    // people = searchByGender(people, traitsToSearch)
  }
  if (traitsToSearch.filter(person=> /eyecolor:/gi.test(person)).length != 0){
    peopleWithTraits = searchByEyeColor(peopleWithTraits,traitsToSearch.filter(person=> /eyecolor:/gi.test(person)));
    counter++;
    // people = searchByEyeColor(people, traitsToSearch)
  }
  if (traitsToSearch.filter(person=> /weight:/gi.test(person)).length != 0){
    peopleWithTraits = searchByWeight(peopleWithTraits,traitsToSearch.filter(person=> /weight:/gi.test(person)));
    counter++;
    // people = searchByEyeColor(people, traitsToSearch)
  }
  if (traitsToSearch.filter(person=> /height:/gi.test(person)).length != 0){
    peopleWithTraits = searchByHeight(peopleWithTraits, traitsToSearch.filter(person=> /height:/gi.test(person)));
    counter++;
  }

  if (counter < traitsToSearch.length) {
    alert(`There was something wrong with your search\nPlease try again`);
    return app(people);
  } else {
    displayPeople(peopleWithTraits);
    return app(people);
  }
}



//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByGender(people, traitsToSearch) {
  let searchedGender = traitsToSearch[0].split(":");
  return(people.filter(person => person.gender == searchedGender[1]));
}
function searchByOccupation(people,traitsToSearch){
  let newTraitsToSearch = traitsToSearch[0].split(":");
  return(people.filter(person=>person.occupation == newTraitsToSearch[1]));
}
function searchByEyeColor(people,traitsToSearch){
  let newTraitsToSearch = traitsToSearch[0].split(":");
  return(people.filter(person=>person.eyeColor==newTraitsToSearch[1]));
}
function searchByWeight(people,traitsToSearch){
  let newTraitsToSearch = traitsToSearch[0].split(":");
  return(people.filter(person=>person.weight==newTraitsToSearch[1]));
}
function searchByHeight(people,traitsToSearch){
  let newTraitsToSearch = traitsToSearch[0].split(":");
  return(people.filter(person=>person.height==newTraitsToSearch[1]));
}
//TODO: add other trait filter functions here.
//Traits to search by:EyeColor, Height, Weight, Occupation, Gender


//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people) {
  if(people[0] == null){
    alert (`There was something wrong with your search\nPlease try again`);
  } else { 
    alert(people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person[0].firstName + "\n";
  personInfo += "Last Name: " + person[0].lastName + "\n";
  personInfo += "Gender: " + person[0].gender + "\n";
  personInfo += "DOB: " + person[0].dob + "\n";
  personInfo += "Height: " + person[0].height + "\n";
  personInfo += "Weight: " + person[0].weight + "\n";
  personInfo += "Eye Color: " + person[0].eyeColor + "\n";
  personInfo += "Occupation: " + person[0].occupation +"\n";
  personInfo += "Parents: " + person[0].parents + "\n";
  personInfo += "Current Spouse: " + person[0].currentSpouse + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid) {
  let isValid;
  do {
    var response = prompt(question).trim();
    isValid = valid(response);
  } while (response === "" || isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input) {
  if (input.toLowerCase() == "yes" || input.toLowerCase() == "no") {
    return true;
  }
  else {
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input) {
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input) {

}

//#endregion