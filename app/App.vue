<template>
    <div>
        <div id="sidebar">
            <p>
                some data
            </p>
            <p></p>

            <div>
                <button class="ui olive button" v-on:click="test1">
                    Загрузить
                </button>
            </div>
        </div>
        <div id="main-container">
            <breadcrumbs :dir="dir" v-on:breadcrumb-path-changed="modifyPath($event)"></breadcrumbs>

            <div id="content">
                <div style="margin: 5px;">
                    <div id="file-list">
                        <dir-list :dir="dir" v-on:dirlist-path-changed="modifyPath($event)"></dir-list>
                        <!--<div data-path="/media/andrey/E/photo/2006_07_30 Мила ДР/.sync" class="file">-->
                            <!--<div class="icon"><img src="static/img/folder.png"></div>-->
                            <!--<div class="name">Обработано1</div>-->
                        <!--</div>-->
                        <!--<div data-path="/media/andrey/E/photo/2006_07_30 Мила ДР/ZbThumbnail.info" class="file focus">-->
                            <!--<div class="icon"><img src="static/img/blank.png"></div>-->
                            <!--<div class="name">ZbThumbnail.info</div>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import DirList from './components/DirList.vue'
    import Breadcrumbs from './components/Breadcrumbs.vue'

    export default {
        data: function () {
            return {
                dir: "c:\\Users\\IEUser\\"
            }
        },

        components: {
            DirList,
            Breadcrumbs
        },

        methods: {
            test1: function () {
                this.dir = "/media/andrey/E/photo/OTHER/";
            },

            modifyPath: function (newPath) {
                this.dir = newPath;
            }
        }
    }

//    let foo = localStorage.getItem('foo');
//    console.log(foo);
//    localStorage.setItem('foo',  foo + 1);
//
//    export default {
//        components: {
//            DirList
//        }
//    }
</script>
