export function animate(circle, refreshFunc, refreshPeriod) {
    if (!circle) return;
    refreshPeriod = refreshPeriod || 1000;
    circle.style.transitionDuration = refreshPeriod + "ms";

    setInterval(() => progression(circle, refreshFunc()), refreshPeriod);

}

export function progression(circle, ratio, dash) {
    if (ratio === 0) {
        circle.style.strokeDashoffset = "0";
    } else {
        dash = dash || dasharray(circle);
        circle.style.strokeDashoffset = (dash - dash * ratio) + "px";
    }
}

export function dasharray(circle) {
    return window.getComputedStyle(circle)
                 .getPropertyValue("stroke-dasharray")
                 .replace("px", "");
}
