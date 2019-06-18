export function startMobTurn(lengthInMinutes, callBack) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callBack(JSON.parse(this.responseText));
        }
    };
    xhttp.open("POST", "/start?lengthInMinutes=" + lengthInMinutes, true);
    xhttp.send();
}

export function passTimeLeftTo(callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", "/timeLeft", true);
    xhttp.send();
}