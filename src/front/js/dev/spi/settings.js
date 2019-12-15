export function volume() {
    const volumeCookie = document.cookie.split(";").filter(value => value.match("mobTimeVolume"));
    const volume = volumeCookie[0]?.split("=")[1];
    if (volume)
        return volume;
    else
        return 100;
}

export function saveVolume(value) {
    document.cookie = "mobTimeVolume=" + value;
}