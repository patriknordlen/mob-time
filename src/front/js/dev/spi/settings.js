export function volume() {
    const volumeCookie = document.cookie.split(";").filter(value => value.match("mobTimeVolume"));
    const volume = volumeCookie[0]?.split("=")[1];
    if (volume)
        return volume;
    else
        return 100;
}

const inMilliseconds = year => year * 365 * 24 * 60 * 60 * 1000;
const expirationDate = () => new Date(new Date().getTime() + inMilliseconds(1));

export function saveVolume(value) {
    document.cookie = `mobTimeVolume=${value}; expires=${expirationDate().toUTCString()}`;
}