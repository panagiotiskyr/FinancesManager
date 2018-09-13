<template>
    <div id="notification-box">
        <template
            v-if="icon != ''">
            <span :class="'jam jam-' + icon"></span>
        </template>
        <span>{{ msg }}</span>
    </div>
</template>

<script>
export default {
    name: 'NotificationBox',
    props: [
        'msg',
        'icon'
    ],
    data: function() {
        return {

        }
    },
    methods: {

    },
    created: function() {

    },
    updated: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#notification-box {
    display: inline-block;
    position: fixed;
    top: 1rem;
    right: -3rem;
    opacity: 0;
    visibility: hidden;
    box-shadow: 0 3px 0 0 #D2D2D2;
    background-color: #fff;
    color: #000;
    padding: 0.8em 1.3em;
    border-radius: 0.5rem 0 0 0.5rem;
    cursor: default;
    font-size: 1rem;
    transition: all 0.3s ease-in-out;
    border: 1px solid #D2D2D2;
    border-right-width: 0;
    font-weight: 600;
    box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.25);
    &.visible {
        opacity: 1;
        visibility: visible;
        right: 0;
    }
    span {
        vertical-align: middle;
    }
    .jam {
        margin-right: 5px;
    }
}
</style>
