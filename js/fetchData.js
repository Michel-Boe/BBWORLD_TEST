// 1. Hilfsfunktionen

// Gibt zufällige Nummer zurück
function getRandomNumber (maxLength){
    let min = 0;
    let max = maxLength;
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}


// gibt normalisierten String zurück
function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
}

// 2. Variablen

// Variable merkt sich korrekten Index -> Zuordnung der Flagge an Position
var memory = 0;

let score = 0;

let RoundPoints = 0;

let alreadyGuessedCap = false;
let alreadyGuessedFlag = false;
let alreadyGuessedLandlocked = false;
let alreadyGuessedBorders = false;

let fetchAdress = "Data/country.json";

// 3. Event-Handler

window.addEventListener('load', () => {
    score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
    document.getElementById('counter').innerHTML = score;
    document.getElementById('counter-two').innerHTML = score;
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('score', score);
});

// document.querySelectorAll('input[name="switch-two"]').forEach((radio) => {
//     radio.addEventListener('change', displayRadioValue);
// });

document.querySelectorAll('input[name=dropdownRegion]').forEach((radio) => {
    radio.addEventListener('change', changeFetchAdress)
});

document.getElementById("IncludeIndependentCountries").addEventListener('change',() => {
    if (document.getElementById("IncludeIndependentCountries").checked == true){
        fetchAdress = "Data/dependentcountries.json";
    }
    else{
        fetchAdress = "Data/country.json";
    };
    initializeByCountry();
})


// function displayRadioValue()  {
//     var ele = document.getElementsByName('switch-two');

//     for (i=0; i < ele.length; i++) {
//         if (ele[i].checked) {
//             document.getElementById('Headline').textContent = `World by ${ele[i].value}`;
//         }

//     }
// }

function changeFetchAdress(){
    var dropdownRegion = document.getElementsByName('dropdownRegion');

    for (i=0; i < dropdownRegion.length; i++) {
        if (dropdownRegion[i].checked) {
            fetchAdress = dropdownRegion[i].value;
            if (fetchAdress != "Data/country.json"){
                document.getElementById("IncludeIndependentCountries").checked = true;
                document.getElementById("IncludeIndependentCountries").disabled =true;

            } else{
                document.getElementById("IncludeIndependentCountries").checked=false;
                document.getElementById("IncludeIndependentCountries").disabled =false;

            }
        }
    };
    initializeByCountry();

}


// 4. Hauptlogik

// 4.1. Quiz - Bei gegebenem Land
// Variablen
const results = document.querySelectorAll(".showResult");
const displayRandomCountry = document.getElementById("randomCountry");
var currentCountry = "";
var currentCapital = "";
var currentBorderArray = "";
var currentLandlockedStatus = "";

// Score Funktion
function addPoints() {
    score += RoundPoints;
    document.getElementById("counter").innerHTML = score;
    document.getElementById('counter-two').innerHTML = score;
    RoundPoints = 0;
}

// function subtractPoint(){
//     score -= 1;
//     document.getElementById("counter").innerHTML = score;
//     document.getElementById('counter-two').innerHTML = score;
// }


// Initialisiert Abfrage - neues Land, neue Flaggen, leere Eingaben, leere Ergebnisse
function initializeByCountry(){
    getSolutionArray().then(randomCountry =>{
        displayRandomCountry.innerHTML = randomCountry;
        currentCountry = randomCountry;
        setupFlags(); // Muss auf Rückgabe von getRandomCountry() warten!
        
    });
    results.forEach(function(result) {
        result.innerHTML= "";
    });
    addPoints();
    document.getElementById("capitalGuess").value = "";
    document.getElementById("borderGuess").value = ""
    document.getElementById("capitalGuess").placeholder = "Type in Capital";
    document.getElementById("isLandlocked").checked = false;
    document.getElementById("firstFlag").checked = false;
    document.getElementById("secondFlag").checked = false;
    document.getElementById("thirdFlag").checked = false;
    document.getElementById("fourthFlag").checked = false;
    alreadyGuessedCap = false;
    alreadyGuessedFlag = false;
    alreadyGuessedLandlocked = false;
    alreadyGuessedBorders = false;

    // noch Eingaben für Land und Landlocked zurücksetzen
}


// Wählt ein zufälliges Land aus und gibt es zurück.
async function getSolutionArray() {  
    try {
      // Daten von der JSON-Datei abrufen
      const response = await fetch(fetchAdress);
      const data = await response.json();
  
      // Zufallszahl generieren und Land auswählen
      let randomNumber = getRandomNumber(data.length)
      let randomCountry = data[randomNumber].name.common;
      currentCapital = data[randomNumber].capital[0];
      currentBorderArray = data[randomNumber].borders;
      currentLandlockedStatus = data[randomNumber].landlocked;
      return randomCountry;

    } catch (error) {
      console.log('error', error); // Fehlerbehandlung
    }
}


//setzt auf die 4 Positionen erst die korrekte Flagge und dann die drei zufälligen
function setupFlags() {
    var flagIdArray = ["firstSrc","secondSrc","thirdSrc","fourthSrc"];
    var correctFlagIndex = getRandomNumber(3);
    memory = correctFlagIndex;
    
    var correctId = flagIdArray.splice(correctFlagIndex,1);

    getCorrectFlag(correctId);
    for (let i = 0; i <= 2; i++ ){
        getRandomFlag(flagIdArray[i]);
    };
}

// setzt Flagge des aktuellen Landes auf einen zufälligen Platz
function getCorrectFlag(id) {
    var flagURL = document.getElementById(id);

    getAnythingWithCountry(currentCountry,"flag").then(flag => {
        flagURL.src = flag;
    });  
}

// setzt Flagge eines neuen zufälligen Landes auf Index 
async function getRandomFlag(id){
    var flagURL = document.getElementById(id);
    try {
        // Daten von der JSON-Datei abrufen
        const response = await fetch(fetchAdress);
        const data = await response.json();
    
        // Zufallszahl generieren und Land auswählen
        let randomFlag = data[getRandomNumber(data.length)].flags.png;
        flagURL.src = randomFlag;
  
      } catch (error) {
        console.log('error', error); // Fehlerbehandlung
      }
}


// gibt mit Land und Typ die gewünschte Antwort zurück 
async function getAnythingWithCountry(country, type){
    var specificAnswer;

    let response = fetch(fetchAdress);
    let data = await (await response).json();

    for (let i = 0; i <= data.length; i++){
        let countryOutput = data[i].name.common;
        if (country == countryOutput){
            if (type == "capital"){
                specificAnswer = data[i].capital[0];
                break;
            }
            if (type == "flag"){
                specificAnswer = data[i].flags.png;
                break
            }
            if(type == "borders"){
                specificAnswer = data[i].borders;
                break
            }
            else{
                specificAnswer = data[i].landlocked;
            }
        }     
    }
    return specificAnswer;
}


// Vergleicht Eingabe mit korrektem Wert und setzt das Ergebnis korrekt/inkorrekt
function checkIfCapitalCorrect(){
    if (alreadyGuessedCap == false){
        const capitalGuess = document.getElementById("capitalGuess").value;
        if (normalizeString(capitalGuess) == normalizeString(currentCapital)) {
            results[0].innerHTML = "+1";
            playCorrectSound();
            RoundPoints += 1;
            alreadyGuessedCap = true;
        }
        else{
            results[0].innerHTML = `-1`;
            playWrongSound();
            RoundPoints -= 1;
            document.getElementById("capitalGuess").value = "";
            document.getElementById("capitalGuess").placeholder = `"${currentCapital}" was correct`;
            alreadyGuessedCap = true;
        }
    }
}

function checkIfFlagCorrect() {
    if (alreadyGuessedFlag == false){   
        var flagIdArrayHelp = ["firstFlag","secondFlag","thirdFlag","fourthFlag"];
        var correctFlag = document.getElementById(flagIdArrayHelp[memory]);
        if (correctFlag.checked == true){
            results[1].innerHTML = "+1";
            playCorrectSound();
            RoundPoints += 1;
            alreadyGuessedFlag = true;
        }
        else {
            results[1].innerHTML = "-1";
            playWrongSound();
            RoundPoints -= 1;
            alreadyGuessedFlag = true;
        }
    }
}

function checkIfBordersCorrect(){

}

function checkIfLandlockedCorrect() {
    if (alreadyGuessedLandlocked == false){
        const isLandlocked = document.getElementById("isLandlocked");
        if (isLandlocked.checked == currentLandlockedStatus){
            results[2].innerHTML = "+1";
            playCorrectSound();
            RoundPoints += 1;
            alreadyGuessedLandlocked = true;
        }
        else {
            results[2].innerHTML = "-1";
            playWrongSound();
            RoundPoints -= 1;
            alreadyGuessedLandlocked = true;
        }
    }
}





const OptionBorderedCountries = document.getElementById('OptionBorderedCountries');
const askBorder = document.getElementById('askBorder');

// Füge einen Event Listener hinzu, der beim Ändern der Checkbox ausgelöst wird
OptionBorderedCountries.addEventListener('change', function() {
    if (OptionBorderedCountries.checked) {
    askBorder.style.display = 'flex'; // Element verstecken
    } else {
    askBorder.style.display = 'none'; // Element anzeigen
    }
});

const OptionLandlocked = document.getElementById('OptionLandlocked');
const askLandlocked = document.getElementById('askLandlocked');

// Füge einen Event Listener hinzu, der beim Ändern der Checkbox ausgelöst wird
OptionLandlocked.addEventListener('change', function() {
    if (OptionLandlocked.checked) {
        askLandlocked.style.display = 'flex'; // Element verstecken
    } else {
        askLandlocked.style.display = 'none'; // Element anzeigen
    }
});




// Audio

function playCorrectSound() {
    var audioCorrect = document.getElementById("audioCorrect");
    audioCorrect.play();
}

function playWrongSound() {
    var audioCorrect = document.getElementById("audioWrong");
    audioCorrect.play();
}