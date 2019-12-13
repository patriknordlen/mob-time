export function stop(callBack) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callBack(JSON.parse(this.responseText));
        }
    };
    xhttp.open("POST", "/stop", true);
    xhttp.send();
}

export function startMobTurn(duration, callBack) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callBack(JSON.parse(this.responseText));
        }
    };
    xhttp.open("POST", "/start?lengthInMinutes=" + duration.minutes, true);
    xhttp.send();
}

export function passTimeLeftTo(callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", "/status", true);
    xhttp.send();
}