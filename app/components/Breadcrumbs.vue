<template>
    <div id="breadcrumb" class="ui breadcrumb">
        <template v-for="(item, index) in pathArray">
            <template v-if="index < pathArray.length - 1">
                <a class="section" v-on:click="dirClickHandler(index)">{{ item }}</a>
                <i class="right angle icon divider"></i>
            </template>

            <template v-else="">
                <div class="active section">{{ item }}</div>
            </template>

        </template>
    </div>
</template>

<script>

    const path = require('path');

    export default {
        props: ['dir'],

        computed: {
            pathArray: function () {
                let dir = this.dir;
                if (dir.endsWith(path.sep)) {
                    dir = dir.substring(0, this.dir.length - 1);
                }

                // голова '/' или 'c:\'
                let root = path.parse(dir).root;
                dir = dir.substring(root.length, this.dir.length);

                let res = dir.split(path.sep);

                // добавляем голову первым элементом
                res.unshift(root);

                return res;
            }
        },

        methods: {
            dirClickHandler: function (pathIndex) {
                let newPath = '';

                for (let i = 0; i <= pathIndex; i++) {
                    newPath += this.pathArray[i];
                    if (i > 0) {
                        newPath += path.sep;
                    }
                }
                //console.log("dirClickHandler pathIndex=" + pathIndex + ' NEW path=' + newPath);
                this.$emit('breadcrumb-path-changed', newPath);
            }
        },

        data: function () {
            return {

            }
        }
    }
</script>
