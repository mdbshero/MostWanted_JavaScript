"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults = {}
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

  if (!person) {
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

      return alert(JSON.stringify(person, null, 1)).replace(/({|}|\[|\]|"|\n,)/g, '')
    break;
    case "family":
      // TODO: get person's family
      //Parents spouse siblings - No descendants
      console.log(familyFinder(person, people))
      break;
    case "descendants":
      // TODO: get person's descendants
      //Single layer of Kids
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
  let parents = JSON.stringify(people.filter(family=>person[0].parents.includes((family.id))),['firstName','lastName'],1).replace(/({|}|\[|\]|"|\n,)/g, '').replace(/(firstName: |lastName: )/g,'').replace(/(,\n |\n |\n)/g, '')
  let spouse = (JSON.stringify(people.filter(family=>person[0].currentSpouse == family.id) != ''? people.filter(family=>person[0].currentSpouse == family.id):"N/A"),['firstName','lastName'],1).replace(/({|}|\[|\]|"|,)/g, '').replace(/(firstName: |lastName: )/g,'').replace(/(\n,|,\n |\n |\n)/g, '')
  let siblings = (JSON.stringify(((people.filter(family=>(family.parents.includes(person[0].parents[0]) | family.parents.includes(person[0].parents[1])) && family != person[0])) != ''?people.filter(family=>(family.parents.includes(person[0].parents[0]) | family.parents.includes(person[0].parents[1])) && family != person[0]) :"N/A"),['firstName','lastName'],1)).replace(/({|}|\[|\]|"|,)/g, '').replace(/(firstName: |lastName: )/g,'').replace(/(\n,|,\n )/g, '')
  // let spouse = people.filter(family=>person[0].currentSpouse == family.id)
  let stringReturn = `Family of ${person[0].firstName} ${person[0].lastName} ID: ${person[0].id}\nParent(s): ${parents}\nSpouse:${spouse}\nSiblings:${siblings}`
  return(stringReturn)
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

  let foundPerson = people.filter(potentialMatch => potentialMatch.firstName.toLowerCase() === firstName && potentialMatch.lastName.toLowerCase() === lastName)


  // TODO: find the person single person object using the name they entered.
  return (foundPerson);
}


function searchByTrait(people){
  let traitsToSearch = promptFor(`Please enter the traits you would like to search for followed by a colon.\nSeparate queries by AND or a Comma (,)\nExample: gender:male,eye color:blue AND occupation:nurse`,autoValid)
  // traitsToSearch = traitsToSearch.split(/(AND|,)/g)
  // let newReg = /( AND |\,| , |, | ,|AND | AND)/g
  traitsToSearch = traitsToSearch.split(/ AND |AND | AND|AND| , |, | ,|,/g)
  console.log(traitsToSearch)

}
//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByEyeColor(people) {

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
  alert(people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
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