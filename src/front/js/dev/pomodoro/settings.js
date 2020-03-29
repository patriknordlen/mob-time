export function setup() {
    let active = document.getElementById("pomodoro-active");
    if (!active) return;
    let fieldset = document.getElementById("turns-by-pomodoro-fieldset");
    fieldset.style.display = active.checked ? "block": "none";
    active.onchange = () => fieldset.style.display = active.checked ? "block" : "none";
}