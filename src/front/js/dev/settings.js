export function volume() {
    const volume = document.cookie.split("=")[1];
    if (volume)
        return volume;
    else
        return 100;
}

export function saveVolume(value) {
    document.cookie = "mobTimeVolume=" + value;
}