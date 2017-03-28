
// TODO не удалять! Так можно вызвать новое окно отсюда
//const { remote } = require('electron');
//const { BrowserWindow } = remote;

//const electron = require('electron');

const VKApi = require('node-vkapi');

import { getToken } from './storage';
const fs    = require('fs');

const albumId = 117620168;
const groupId = 20189666;

export function vktest() {
    console.log("Пробуем загрузить фотку");

    getToken()
        .then(token => {
            let VK = new VKApi({"token": token});
            VK.upload('photo_album', {
                //data: fs.createReadStream('/home/andrey/projects/vk_upload/IMG_0365.JPG'),
                data: fs.createReadStream('/media/andrey/E/photo/2017_01_14/IMG_0365.JPG'),
                beforeUpload: {
                    album_id: albumId,
                    group_id: groupId
                },
                afterUpload: {
                    album_id: albumId,
                    group_id: groupId
                }
            })
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.error("Can't upload:" + err);
                })
        })
        .catch(err => {
            console.error(err);
        });
}

function ensureUserAlbum() {

}

export function upload(path) {
    // todo получить и закэшировать имя пользователя

    // todo проверить есть ли альбом с именем, создать если нет

}
