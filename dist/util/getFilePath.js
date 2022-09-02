// https://stackoverflow.com/a/42594856/13817471
export default function getFilepath(stackNr = 1) {
    return (() => {
        const stack = new Error().stack;
        if (!stack)
            return window.location.origin;
        const match = stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig);
        if (!match)
            return window.location.origin;
        return match[stackNr + 1] ?? window.location.origin;
    })();
}
