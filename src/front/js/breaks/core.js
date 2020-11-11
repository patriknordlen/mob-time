export function handle(data, displayTimeLeftRatio, breakSignal) {
    if (!data.ratio) {
        displayTimeLeftRatio(0);
        return data.state;
    }

    displayTimeLeftRatio(Math.max(0, 1 - data.ratio));

    if (isBreakOver(data) && canSignalBreak(data)) {
        breakSignal();
        return {breakSignaled: true}
    }

    return {breakSignaled: data.state.breakSignaled && isBreakOver(data)};
}

function canSignalBreak(data) {
    return !data.state.breakSignaled
        && !data.turnInProgress;
}

function isBreakOver(data) {
    return data.ratio >= 1;
}
