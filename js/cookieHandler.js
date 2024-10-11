
function saveName() {
    const name = document.getElementById('playernameInput').value;
    setCookie('username', name, 1); // Speichert den Namen für 1 Tag
    // alert(`This Website saved ${name} as your username!`);
}
    
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Funktion zum Auslesen des Cookies
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showUsername() {
    const username = getCookie('username');
    if (username != "") {
        document.getElementById("username").innerText = username;
    }
    else {
        document.getElementById("username").innerText = "Guest";
    }
}

window.addEventListener('DOMContentLoaded', showUsername);
  
