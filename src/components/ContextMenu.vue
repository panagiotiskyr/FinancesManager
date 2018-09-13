<template>
    <div id="context-menu"
        :style="{ top: contextClickY + 'px', left: contextClickX + 'px' }">
        <div
            @click="editTransaction">
            <span class="jam jam-pencil"></span>
            <span>Edit</span>
        </div>
        <div
            @click="deleteTransaction">
            <span class="jam jam-trash"></span>
            <span>Delete</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContextMenu',
    props: [
        'contextClickX',
        'contextClickY'
    ],
    data: function() {
        return {

        }
    },
    methods: {
        calculatePosition: function() {
            let contextMenu = document.querySelector('#context-menu');
            contextMenu.style.left = this.contextClickX;
            contextMenu.style.top = this.contextClickY;
        },
        editTransaction: function() {
            this.$emit('contextEditTransaction');
        },
        deleteTransaction: function() {
            this.$emit('contextDeleteTransaction');
        }
    },
    created: function() {

    },
    mounted: function() {
        this.calculatePosition();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#context-menu {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 10em;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.35);
    padding: 0.2em 0;
    > div {
        cursor: default;
        display: block;
        font-size: 1em;
        padding: 0.2em 0.8em;
        position: relative;
        &:hover {
            background-color: #EDEDED;
        }
        &:not(:last-child) {
            border-bottom: 1px solid #d3d3d3;
        }
    }
}
.jam {
    margin-right: 7px;
    color: #0769E4;
    font-size: 1.2em;
}
.jam,
span {
    vertical-align: middle;
}
</style>
