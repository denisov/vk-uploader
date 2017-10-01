
// TODO не удалять! Так можно вызвать новое окно отсюда
//const { remote } = require('electron');
//const { BrowserWindow } = remote;

//const electron = require('electron');

const VKApi = require('node-vkapi');

import { getToken } from './storage';
const fs    = require('fs');

// todo определять альбом на основе имени пользователя и имени папки
//const albumId = 117620168;

// todo убрать хардкод
const groupId = 20189666;

async function uploadToAlbum(photoPath, albumId) {
    console.log("Пробуем загрузить фотку");

    let VK = new VKApi({"token": await getToken()});
    VK.upload('photo_album', {
        data: fs.createReadStream(photoPath),
        beforeUpload: {
            album_id: albumId,
            group_id: groupId
        },
        afterUpload: {
            album_id: albumId,
            group_id: groupId
        }
    });
    console.log("Фото загружена");
}


/**
 * Возвращает промис с именем пользователя
 * FIXME принимает параметр - токен, в отличие от остальных методов
 *
 * @param token
 */
function getUserName(token) {
    let VK = new VKApi({"token": token});
    return VK.call("users.get")
        .then(res => {
            return {'first_name': res[0].first_name, 'last_name': res[0].last_name};
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * Проверяет есть ли альбом с именем директории и именем пользователя
 *
 * @param albumName
 */
async function ensureUserAlbum(albumName) {

    const VK = new VKApi({"token": await getToken()});
    const existingAlbums = await VK.call("photos.getAlbums", {"owner_id": -1 * groupId});

    let albumId = 0;
    Object.values(existingAlbums.items).forEach(album => {
        if (album['title'] == albumName) {
            albumId = album['id'];
            console.log('Альбом найден');
            return;
        }
    });
    if (albumId != 0) {
        return albumId;
    }

    console.log('Альбом НЕ найден, создаём');
    const createdAlbum = await VK.call('photos.createAlbum', {'title': albumName, 'group_id': groupId})
    console.log(createdAlbum.id);
    return createdAlbum.id
}


export {uploadToAlbum, ensureUserAlbum, getUserName}
