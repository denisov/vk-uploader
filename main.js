const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const authenticateVK = require('electron-vk-oauth2');
const VKApi = require('node-vkapi');

import { getToken, setToken } from './app/storage';

// FIXME вынести в конфиг или в самостоятельный файл
const appId = 5881665;
const appSecret = '';

let mainWindow;

function createWindow () {
    // create the browser window
    mainWindow = new BrowserWindow({width: 1200, height: 600});
    // render index.html which will contain our root Vue component
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // токен лучше проверять непосредственно перед запросом в ВК, но там не получается открыть окно с авторизацией
    // с пом либы. Нужно делать remote.window или что-то типа того
    setVkToken();

    mainWindow.webContents.openDevTools();

    // dereference the mainWindow object when the window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

}

// call the createWindow() method when Electron has finished initializing
app.on('ready', createWindow);

// when all windows are closed, quit the application on Windows/Linux
app.on('window-all-closed', function () {
    // only quit the application on OS X if the user hits cmd + q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // re-create the mainWindow if the dock icon is clicked in OS X and no other
    // windows were open
    if (mainWindow === null) {
        createWindow();
    }
});


// авторизовывает пользователя, сохраняет его токен в хранилище
function requestAndSaveVkToken() {
    authenticateVK({
        appId: '5881665',
        scope: 'photos',
        revoke: true,
    }, {
        parent: mainWindow,
    }).then((res) => {
        console.log('Access token: %s', res.accessToken);
        console.log('User id: %s', res.userId);
        console.log('Expires in: %s', res.expiresIn);

        console.log("Новый токен: " + res.accessToken + " сохраняем его в хранилище");
        setToken(res.accessToken);

    }).catch((err) => {
        console.error(err);
    });
}


// проверяет токен VK в хранилище, проверяет валидность токена в хранилище
function setVkToken() {
    // TODO было бы лучше хранить данные в localStorage, но из main процесса нет досупа
    getToken().then(token => {

        console.log("Найден токен: " + token + " проверяем его");

        let VK = new VKApi({app: {id: appId, secret: appSecret}});
        // получаем серверный токен
        VK.auth.server().then(serverToken => {
            console.log("ServerToken: " + serverToken.access_token);
            VK.setOptions({"token": serverToken.access_token});
            VK.call('secure.checkToken', {
                'client_secret': appSecret,
                'token': token
            }).then(res => {
                // токен валидный. Всё хорошо, можно ни чего не делать..
                console.log(res);
            }).catch(err => {
                // если токен не валидный, запросить новый
                if (err.code == 15) {
                    console.log("Токен не валидный, наверно протух, запрашиваем новый");
                    requestAndSaveVkToken();
                } else
                {
                    console.log(err);
                }
            });
        }).catch(err => {console.log(err)});
    }).catch(err => {
        console.log(err);
        console.log("Токен не найден, заправшиваем новый токен");
        requestAndSaveVkToken();
    });
}
