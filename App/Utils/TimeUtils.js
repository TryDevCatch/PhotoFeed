export const timeConverter = (timestamp) => {
    let a = new Date(timestamp * 1000);
    let seconds = Math.floor((new Date() - a) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1)
        return interval + ' year' + pluralCheck(interval);

    interval = Math.floor(seconds / 2592000);
    if (interval > 1)
        return interval + ' month' + pluralCheck(interval);

    interval = Math.floor(seconds / 86400);
    if (interval > 1)
        return interval + ' day' + pluralCheck(interval);

    interval = Math.floor(seconds / 3600);
    if (interval > 1)
        return interval + ' hour' + pluralCheck(interval);

    interval = Math.floor(seconds / 60);
    if (interval > 1)
        return interval + ' minute' + pluralCheck(interval);

    return seconds + ' second' + pluralCheck(seconds);

}

const pluralCheck = (s) => {
    if (s == 1) {
        return 'ago';
    } else {
        return 's ago';
    }
}