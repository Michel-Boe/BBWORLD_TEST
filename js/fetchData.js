// 1. Hilfsfunktionen

// Gibt zufällige Nummer zurück
function getRandomNumber (maxLength){
    let min = 0;
    let max = maxLength;
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
}

// 2. Variablen

// Variable merkt sich korrekten Index -> Zuordnung der Flagge an Position
var memory = 0;

// 3. Event-Handler

// 4. Hauptlogik

// 4.1. Quiz - Bei gegebenem Land
// Variablen
const results = document.querySelectorAll(".showResult");
const displayRandomCountry = document.getElementById("randomCountry");
var currentCountry = "";
var currentCapital = "";
var currentBorderArray = "";
var currentLandlockedStatus = "";




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
    document.getElementById("capitalGuess").value = "";
    document.getElementById("borderGuess").value = ""
    // noch Eingaben für Land und Landlocked zurücksetzen
}


// Wählt ein zufälliges Land aus und gibt es zurück.
async function getSolutionArray() {  
    try {
      // Daten von der JSON-Datei abrufen
      const response = await fetch("Data/country.json");
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
        const response = await fetch("Data/country.json");
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

    let response = fetch("Data/country.json");
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
    // var counter = document.getElementById("inARow").innerText;
    const capitalGuess = document.getElementById("capitalGuess").value;
    if (capitalGuess.toLowerCase() == currentCapital.toLowerCase()) {
        results[0].innerHTML = "correct";
        playCorrectSound();
        // counter ++;
        // document.getElementById("inARow").innerHTML = counter;
    }
    else{
        results[0].innerHTML = `Wrong: The correct answer is: ${currentCapital}`
        playWrongSound();

    }
}

function checkIfFlagCorrect() {
    var flagIdArrayHelp = ["firstFlag","secondFlag","thirdFlag","fourthFlag"];
    var correctFlag = document.getElementById(flagIdArrayHelp[memory]);
    if (correctFlag.checked == true){
        results[1].innerHTML = "correct";
        playCorrectSound();
    }
    else {
        results[1].innerHTML = "incorrect";
        playWrongSound();
    }
}

function checkIfBordersCorrect(){

}

function checkIfLandlockedCorrect() {
    const isLandlocked = document.getElementById("isLandlocked");
    if (isLandlocked.checked == currentLandlockedStatus){
        results[2].innerHTML = "correct";
        playCorrectSound();
    }
    else {
        results[2].innerHTML = "incorrect";
        playWrongSound();
    }
}










// const firstFlag = document.getElementById('firstFlag');
// const firstCheck = document.getElementById('firstCheck');
// const secondFlag = document.getElementById('secondFlag');
// const secondCheck = document.getElementById('secondCheck');
// const thirdFlag = document.getElementById('thirdFlag');
// const thirdCheck = document.getElementById('thirdCheck');
// const fourthFlag = document.getElementById('fourthFlag');
// const fourthCheck = document.getElementById('fourthCheck');

// firstFlag.addEventListener('click', function (event) {
//     event.preventDefault(); // Prevent image form submission

//     // Toggle the checkbox state
//     firstCheck.checked = !firstCheck.checked;
// });

// secondFlag.addEventListener('click', function (event) {
//     event.preventDefault(); // Prevent image form submission

//     // Toggle the checkbox state
//     secondCheck.checked = !secondCheck.checked;
// });

// thirdFlag.addEventListener('click', function (event) {
//     event.preventDefault(); // Prevent image form submission

//     // Toggle the checkbox state
//     thirdCheck.checked = !thirdCheck.checked;
// });

// fourthFlag.addEventListener('click', function (event) {
//     event.preventDefault(); // Prevent image form submission

//     // Toggle the checkbox state
//     fourthCheck.checked = !fourthCheck.checked;
// });

document.querySelectorAll('input[name="switch-two"]').forEach((radio) => {
    radio.addEventListener('change', displayRadioValue);
  });

function displayRadioValue()  {
    var ele = document.getElementsByName('switch-two');

    for (i=0; i < ele.length; i++) {
        if (ele[i].checked) {
            document.getElementById('Headline').innerHTML = `World by ${ele[i].value}`;
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