export function setup() {
    const circle = document.getElementById("pomodoro-circle");
    if (!circle) return;

    const dasharray = window.getComputedStyle(circle)
                            .getPropertyValue("stroke-dasharray")
                            .replace("px", "");
    circle.style.transitionDuration = "1000ms";
    let ttl = 24 * 60;
    setInterval(() => {
        ttl--;
        progression(ttl);
    }, 1000);

    function progression(ttl) {
        if (ttl === 0) {
            circle.style.strokeDashoffset = 0;
        } else {
            console.log(ttl, dasharray);
            circle.style.strokeDashoffset = (dasharray - dasharray * (ttl / (24 * 60))) + "px";
        }
    }
}