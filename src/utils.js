export function generateRandomString(length) {
    let text = ''
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

export function getHashParams() {
    const hashParams = {}
    let e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1)
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2])
    }
    return hashParams
}
