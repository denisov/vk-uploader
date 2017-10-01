import storage from 'electron-storage';

// файл для хранения токена VK
const tokenFile = 'token';

// файл для хранения данных о сессии пользователя, пока только последний путь
const sessionFile = 'session';

// файл для хранения пользовательских данных
const userDataFile = 'user';

async function getUserData() {
    return await storage.get(userDataFile);
}

function setUserData(userData) {
    return storage.set(userDataFile, userData).catch(err => {
        console.error(err);
    })
}

async function getToken() {
    const token = await storage.get(tokenFile);
    return token[0];
}

function setToken(token) {
    return storage.set(tokenFile, [token]).catch(err => {
        console.error(err);
    })
}

async function getLastPath() {
    const session = await storage.get(sessionFile);
    return session[0];
}

function setLastPath(path) {
    return storage.set(sessionFile, [path]).catch(err => {
        console.error(err);
    });
}

export { getToken, setToken, getLastPath, setLastPath, getUserData, setUserData };