export function setup(socket, mobName) {
    let fieldset = document.getElementById("turns-before-break-fieldset");
    let circle = document.getElementById("breaks");
    fieldset.style.display = "block";
    circle.style.display = "block";

    // ---------------------------------
    // Turns before break
    // ---------------------------------
    let field = document.getElementById("turns-before-break");
    field.onchange = () => socket.emit("change turns before break", mobName, field.value);
    socket.on("change turns before break", number => field.value = number);
}

export function turnsBeforeBreak() {
    return parseInt(document.getElementById("turns-before-break").value);
}