const durationByPerson = document.getElementById("minutes-by-person");

export function setupSync(socket, mobName) {
    socket.on('change length', length => durationByPerson.value = length);

    durationByPerson.onchange = function () {
        socket.emit("change length", mobName, this.value);
    };
}

export function minutesByPerson() {
    return durationByPerson.value;
}