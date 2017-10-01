<template>
    <div class="files">
        <div
            v-for="(item, index) in files"
            v-bind:class="{ focus: item.selected }"
            v-on:dblclick="item.type == 'dir' ? doubleClickItemHandler(item.name) : null"
            v-on:click="clickItemHandler(index, $event)"
            class="file"
        >
            <div class="icon">
                <img v-if="item.type == 'dir'" src="static/img/folder.png">
                <img v-else src="static/img/image.png">
            </div>
            <div class="name">{{ item.name }}</div>
        </div>
    </div>
</template>

<script>
    import * as fs from 'fs'
    const path = require('path');
    import {EventBus} from './../event-bus'
    import {ensureUserAlbum, uploadToAlbum} from './../vk'
    import {getUserData} from './../storage'

    function filesCompare(a, b) {
        if (a.type == 'dir' && b.type != 'dir') {
            return -1;
        } else if (a.type != 'dir' && b.type == 'dir') {
            return 1;
        } else {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        }
    }

    function uploadButtonHandler() {
        // todo имя папки передавать реальное
        getUserData().then(userData => {
            ensureUserAlbum(userData.first_name  + ' ' + userData.last_name + ' ' + '2015-02-01')
                .then(()=> {
                    console.log('after ensure');

                })
                .catch(err => {
                    console.error(err);
                });
        });
    }

    export default {

        props: ['dir'],

        data: function () {
            return {
                lastSelected: null,
                files: []
            }
        },

        watch: {
            dir: function () {
                this.setFiles();
            }
        },

        created: function () {
            if (this.dir) {
                this.setFiles();
            }
            EventBus.$on('upload-button2', async () => {

                let filesToUpload = [];
                let parentDir = '';

                this.files.forEach((file, key) => {
                    if (!file.selected) {
                        return;
                    }
                    filesToUpload.push(this.dir + file.name);

                    if (parentDir == '') {
                        let pathArr = this.dir.split(path.sep);
                        parentDir = pathArr[pathArr.length - 2];
                    }
                });

                if (filesToUpload.length == 0) {
                    console.log('нет файлов, выходим');
                    return;
                }

                const userData = await getUserData();
                const albumId = await ensureUserAlbum(userData.first_name  + ' ' + userData.last_name + ' ' + parentDir);
                console.log('after ensure. Album Id=', albumId);
                Object.values(filesToUpload).forEach((file) => {
                    uploadToAlbum (file, albumId)
                });
            });
        },

        methods: {
            clickItemHandler: function (activeKey, event) {
                if (event.ctrlKey) {
                    this.files[activeKey].selected = !this.files[activeKey].selected;
                    this.lastSelected = activeKey;
                } else if (event.shiftKey) {
                    if (this.lastSelected === null) {
                        this.lastSelected = activeKey;
                    } else {
                        this.files.forEach((file, key) => {
                            let from = Math.min(this.lastSelected, activeKey);
                            let to = Math.max(this.lastSelected, activeKey);
                            if (key >= from && key <= to) {
                                file.selected = true;
                            } else {
                                file.selected = false;
                            }
                        });
                    }
                } else {
                    let newVal = !this.files[activeKey].selected;

                    this.files.forEach(file => file.selected = false);
                    this.files[activeKey].selected = newVal;
                    this.lastSelected = activeKey;
                }
            },
            setFiles: function () {
                let res = [];
                let files = [];

                try {
                    files = fs.readdirSync(this.dir);
                } catch (err) {
                    // TODO писать в левый блок
                    console.error(err);
                }

                files.forEach(file => {
                    let isDir;
                    try {
                        isDir = fs.statSync(this.dir + file).isDirectory();
                    } catch (err) {
                        // не хватило прав, например, не показываем
                        console.error(err);
                        return;
                    }
                    if (!isDir && path.extname(this.dir + file).toLowerCase() != '.jpg') {
                        return;
                    }
                    res.push({
                        "name": file,
                        "type": isDir ?  "dir" : "file" ,
                        "selected": false
                    });
                });
                res.sort(filesCompare);

                this.files = res;
            },
            doubleClickItemHandler: function (dirName) {
                this.$emit('path-changed', this.dir + dirName + path.sep);
            }
        }

    }
</script>


<!--<template>-->
    <!--<div class="four wide column olive">-->
        <!--<div class="ui card">-->
            <!--<div class="content  red">-->
                <!--<button v-on:click="fillFiles">Files</button>-->
                <!--<ul v-for="item in files">-->
                    <!--<li>{{ item }}</li>-->
                <!--</ul>-->

                <!--<button v-on:click="vk">VK test проверка222</button>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->
<!--</template>-->
<!--<script>-->
    <!--import * as fs from 'fs'-->
    <!--import {vktest} from '../vk'-->

    <!--export default {-->
        <!--data () {-->
            <!--return {-->
                <!--files:[]-->
            <!--}-->
        <!--},-->

        <!--methods: {-->
            <!--fillFiles: function () {-->
                <!--this.files = [];-->

                <!--fs.readdir('./', (err, files) => {-->
                    <!--files.forEach(file => {-->
                        <!--this.files.push(file);-->
                    <!--});-->
                <!--});-->
            <!--},-->

            <!--vk: function () {-->
                <!--vktest()-->
            <!--}-->
        <!--},-->

        <!--created() {-->
            <!--this.fillFiles()-->
        <!--}-->
    <!--}-->

<!--</script>-->