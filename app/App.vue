<template>
    <div>
        <div id="sidebar">
            <buttons></buttons>
        </div>
        <div id="main-container">
            <breadcrumbs :dir="dir" v-on:path-changed="modifyPath($event)"></breadcrumbs>

            <div id="content">
                <div style="margin: 5px;">
                    <div id="file-list">
                        <dir-list :dir="dir" v-on:path-changed="modifyPath($event)"></dir-list>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import DirList from './components/DirList.vue'
    import Breadcrumbs from './components/Breadcrumbs.vue'
    import Buttons from './components/Buttons.vue'

    import os from 'os'
    const path = require('path');
    import {getLastPath, setLastPath} from './storage'
    import * as fs from 'fs'

    export default {

        data: function () {
            return {
                dir: ""
            }
        },

        created: async function () {
            try {
                const lastPath = await getLastPath();
                if (fs.statSync(lastPath).isDirectory()) {
                    this.dir = lastPath;
                } else {
                    this.modifyPath(os.homedir() + path.sep);
                }
            } catch (err) {
                console.error("Не могу получить последний путь ", err);
                this.modifyPath(os.homedir() + path.sep);
            }
        },

        components: {
            DirList,
            Breadcrumbs,
            Buttons
        },

        methods: {
            modifyPath: function (newPath) {
                this.dir = newPath;
                setLastPath(newPath);
            }
        }
    }
</script>
