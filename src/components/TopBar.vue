<template>
    <div id="top-bar" class="row is-mobile middle-xs between-xs">
        <div id="top-bar-left" class="col-xs-8 col-sm-6">
            <div id="top-bar-month" @click="changeMonth">
                <span class="jam jam-calendar"></span>
                <span>{{ dateData.month }}</span>
                <span>{{ dateData.year }}</span>
            </div>
            <div id="top-bar-new" @click="newTransaction">
                <div v-if="accounts.length < 1" class="no-accounts">
                    <div>
                        <span class="jam jam-book"></span>
                        <span>No accounts</span>
                    </div>
                </div>
                <span class="jam jam-plus"></span>
                <span>Add Transaction</span>
            </div>
        </div>
        <div id="top-bar-right" class="col-xs-4 col-sm-6">
            <div id="top-bar-settings-btn" @click="settingsVisible = !settingsVisible">
                <span class="jam jam-cog"></span>
            </div>
            <div id="top-bar-settings" v-show="settingsVisible">
                <ul>
                    <li @click="openSettings">
                        <span class="jam jam-settings-alt"></span>
                        <span>Settings</span>
                    </li>
                    <li @click="manageAccounts">
                        <span class="jam jam-archive"></span>
                        <span>Manage Accounts</span>
                    </li>
                    <li @click="quickTransaction">
                        <span class="jam jam-plus-circle"></span>
                        <span>Quick Transaction</span>
                    </li>
                    <li @click="changeHomescreen">
                        <span class="jam jam-home"></span>
                        <span>Change Homescreen</span>
                    </li>
                    <li @click="changeFile">
                        <span class="jam jam-file"></span>
                        <span>Change File</span>
                    </li>
                    <li @click="logout">
                        <span class="jam jam-plane"></span>
                        <span>Disconnect</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TopBar',
    props: [
        'dateData',
        'accounts'
    ],
    data: function() {
        return {
            settingsVisible: false
        }
    },
    methods: {
        changeMonth: function() {
            this.$emit('changeMonthOpen');
        },
        newTransaction: function() {
            if (this.accounts.length > 0) {
                this.$parent.contextTransaction = null;
                this.$emit('newTransaction');
            }
        },
        openSettings: function() {

        },
        manageAccounts: function() {
            this.settingsVisible = !this.settingsVisible;
            this.$emit('manageAccountsWindowOpen');
        },
        quickTransaction: function() {
            this.settingsVisible = !this.settingsVisible;
            this.$emit('changePageShown');
        },
        changeHomescreen: function() {
            this.settingsVisible = !this.settingsVisible;
            this.$emit('changeHomescreen');
        },
        changeFile: function() {
            let self = this;
            this.settingsVisible = !this.settingsVisible;
            this.$vlf.getItem('file')
                .then(function(file) {
                    if (file == null) {
                        sessionStorage.removeItem('file');
                        sessionStorage.removeItem('file_path');
                        sessionStorage.removeItem('homescreen');
                        self.$emit('reloadApp');
                    } else {
                        self.$vlf.removeItem('file')
                            .then(function() {
                                self.$vlf.removeItem('file_path')
                                    .then(function() {
                                        self.$vlf.removeItem('homescreen')
                                            .then(function() {
                                                self.$emit('reloadApp');
                                            });
                                    });
                            });
                    }
                });
        },
        logout: function() {
            let self = this;
            this.settingsVisible = !this.settingsVisible;
            this.$vlf.clear()
                .then(function() {
                    sessionStorage.clear();
                    self.$emit('reloadApp');
                });
        },
        setSettingsTopOffset: function() {
            let settingsBtn = document.getElementById('top-bar-settings-btn');
            let settingsPanel = document.getElementById('top-bar-settings');
            settingsPanel.style.top = (settingsBtn.offsetHeight + settingsBtn.offsetTop + 7) + 'px';
        }
    },
    computed: {

    },
    created: function() {

    },
    mounted: function() {
        this.setSettingsTopOffset();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#top-bar {
    position: relative;
    padding-bottom: 1em;
    margin-bottom: 1em;
    display: flex;
    justify-content: space-between;
    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.1em;
        background-color: #E3E3E3;
    }
}
#top-bar-right {
    text-align: right;
}
#top-bar-month,
#top-bar-new {
    cursor: pointer;
    font-size: 0.8rem;
    display: block;
    width: fit-content;
    @media only screen and (min-width: 48em) {
        display: inline-block;
        width: auto;
    }
    padding: 0.7rem 0.8rem;
    position: relative;
    border: 1px solid;
    span {
        margin-left: 5px;
        vertical-align: middle;
    }
}
#top-bar-month {
    background-color: #fff;
    border-right-width: 0;
    border-color: #dedede;
    color: #000;
    border-radius: 0.5rem 0.5rem 0 0;
    @media only screen and (min-width: 48em) {
        border-radius: 0.5rem 0 0 0.5rem;
    }
}
#top-bar-new {
    background-color: #3582FB;
    border-left-width: 0;
    border-color: #1872FF;
    color: #fff;
    font-weight: bold;
    border-radius: 0 0 0.5rem 0.5rem;
    @media only screen and (min-width: 48em) {
        border-radius: 0 0.5rem 0.5rem 0;
    }
    .no-accounts {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        border-radius: 0 0 0.5rem 0.5rem;
        cursor: default;
        @media only screen and (min-width: 48em) {
            border-radius: 0 0.5rem 0.5rem 0;
        }
        > div {
            font-size: 0.8rem;
            padding: 0.7rem 0.8rem;
            text-align: center
        }
        span {
            color: #fff;
            display: inline-block;
            vertical-align: middle;
        }
    }
}
#top-bar-settings-btn {
    display: inline-block;
    border-radius: 0.5rem;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.25);
    font-size: 1.5rem;
    padding: 0.3rem;
    line-height: 1;
    color: #333;
}
#top-bar-settings {
    position: absolute;
    top: 0;
    right: 1rem;
    z-index: 99;
    ul {
        text-align: left;
        list-style: none;
        margin: 0;
        padding: 0;
        min-width: 10rem;
        background-color: #fff;
        border-radius: 3px;
        box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.35);
        li {
            cursor: pointer;
            display: block;
            font-size: 1rem;
            padding: 0.5rem 2rem 0.5rem 0.7rem;
            position: relative;
            &:hover {
                background-color: #EDEDED;
            }
            &:not(:last-child) {
                border-bottom: 1px solid #d3d3d3;
            }
            .jam {
                margin-right: 0.5rem;
                color: #0769E4;
                font-size: 1.2rem;
            }
            .jam,
            span {
                vertical-align: middle;
            }
        }
    }
}
</style>
