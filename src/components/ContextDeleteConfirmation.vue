<template>
    <div id="context-delete-confirmation">
        <div id="context-delete-confirmation-wrapper">
            <div id="context-delete-confirmation-content">
                <div id="context-delete-confirmation-header">
                    <span>Confirmation Needed</span>
                </div>
                <div>
                    <span class="jam jam-triangle-danger"></span>
                    <span>Delete Transaction</span>
                </div>
                <div id="context-delete-confirmation-options">
                    <div id="context-delete-confirmation-yes" v-on:click="yes">
                        <span>Yes</span>
                    </div>
                    <div id="context-delete-confirmation-no" v-on:click="no">
                        <span>No</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContextDeleteConfirmation',
    props: [

    ],
    data: function() {
        return {

        }
    },
    methods: {
        yes: function() {
            this.$parent.deleteTransactionConfirmed();
        },
        no: function() {
            this.$parent.contextDeleteConfirmationVisible = false;
        }
    },
    created: function() {

    },
    mounted: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#context-delete-confirmation {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.25);
    width: 100%;
    height: 100%;
}
#context-delete-confirmation-wrapper {
    display: flex;
    position: relative;
    top: -5em;
    width: 100%;
    height: 100%;
}
#context-delete-confirmation-content {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: auto;
    background-color: #FFF;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    max-width: 28rem;
    > div:nth-child(2) {
        padding: 1.3em 1.8em;
        font-size: 1.1em;
        font-weight: bold;
        > span {
            display: inline-block;
            vertical-align: middle;
        }
        .jam {
            vertical-align: middle;
            color: #f00;
            margin-right: 10px;
        }
    }
}
#context-delete-confirmation-header {
    background-color: #F0F0F0;
    font-size: 0.9em;
    font-weight: lighter;
    padding: 0.4em 1em;
    text-align: center;
    border-radius: 5px 5px 0 0;
    cursor: default;
    border-bottom: 1px solid #DADADA;
}
#context-delete-confirmation-options {
    border-top: 1px solid #d3d3d3;
    > div {
        margin: auto;
        cursor: pointer;
        display: inline-block;
        width: 50%;
        text-align: center;
        cursor: pointer;
        span {
            display: block;
            padding: 0.7em 1em;
            width: 100%;
            height: 100%;
        }
    }
}
#context-delete-confirmation-yes span {
    background-color: #0769E4;
    color: #fff;
    border-radius: 0 0 0 5px;
    border-right: 1px solid #d3d3d3;
}
</style>
