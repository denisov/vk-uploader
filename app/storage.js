import storage from 'electron-storage';

const tokenFile = 'vk_uploader_token';

function getToken() {
    return storage.get(tokenFile)
        .then(token => {
            return token[0];
        })
        .catch(err => {
            throw err;
        })
}

function setToken(token) {
    return storage.set(tokenFile, [token]).catch(err => {
        console.error(err);
    })
}

export { getToken, setToken };