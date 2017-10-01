<template>
    <div>
        <p>
            some data COMPONENT
        </p>
        <p></p>

        <div>
            <button class="ui olive button" v-on:click="upload">
                Загрузить
            </button>
        </div>
    </div>
</template>

<script>

    import {EventBus} from './../event-bus'

    export default {
        methods: {
            upload: function() {
                EventBus.$emit('upload-button2');
            }
        }
    }
</script>