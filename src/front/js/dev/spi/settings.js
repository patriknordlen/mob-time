export function volume() {
    const volumeCookie = document.cookie.split(";").filter(value => value.match("mobTimeVolume"));
    const volume = volumeCookie[0]?.split("=")[1];
    if (volume)
        return volume;
    else
        return 100;
}

const inMilliseconds = year => year * 365 * 24 * 60 * 60 * 1000;

function expirationDate() {
    const date = new Date();
    date.setTime(date.getTime() + inMilliseconds(1));
    return date;
}

export function saveVolume(value) {
    const date = expirationDate();
    document.cookie = `mobTimeVolume=${value}; expires=${date.toUTCString()}`;
}