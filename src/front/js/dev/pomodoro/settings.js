export function setup(socket, mobName) {
    let active = document.getElementById("pomodoro-active");
    if (!active) return;

    // ---------------------------------
    // Activation
    // ---------------------------------
    let fieldset = document.getElementById("turns-by-pomodoro-fieldset");
    fieldset.style.display = active.checked ? "block": "none";
    active.onchange = () => {
        socket.emit("pomodoro activation change", mobName, active.checked);
        fieldset.style.display = active.checked ? "block" : "none";
    };
    socket.on("pomodoro activation change", status => {
        active.checked = status;
        fieldset.style.display = active.checked ? "block" : "none";
    });

    // ---------------------------------
    // Turns by pomodoro
    // ---------------------------------
    let field = document.getElementById("turns-by-pomodoro");
    field.onchange = () => socket.emit("change turns by pomodoro", mobName, field.value);
    socket.on("change turns by pomodoro", number => field.value = number);
}
