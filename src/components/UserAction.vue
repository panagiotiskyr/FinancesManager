<template>
    <div id="user-action">
        <template
            v-if="loading">
            <div class="loading">
                <h1 style="opacity: 0">Soon...</h1>
                <h2>
                    <span class="jam jam-disc"></span>
                    <span>
                        {{ loadingMessage }}
                    </span>
                </h2>
            </div>
        </template>
        <template
            v-if="offlineError">
            <div class="offline">
                <h2>
                    <span class="jam jam-plug"></span>
                    <span>
                        It seems you are offline
                    </span>
                </h2>
                <div @click="checkStorage">
                    <span>Retry</span>
                </div>
            </div>
        </template>
        <template
            v-if="userAction == 'login' && !offlineError">
            <div class="login">
                <h1>Welcome</h1>
                <h2>Please login to Dropbox</h2>
                <a class="button" :href="authUrl" id="button-login" @click="login">
                    <span class="jam jam-key"></span>
                    <span>Login</span>
                </a>
                <div class="checkbox">
                    <input id="login-checkbox" type="checkbox" v-model:checked="rememberMe">
                    <label for="login-checkbox">Remember me (app)</label>
                </div>
            </div>
        </template>
        <template
            v-if="userAction == 'select_file' && !offlineError">
            <div class="select_file">
                <h1>Hello {{ generalUserData.account.name }}</h1>
                <template
                    v-if="filesLoadingMessage == ''">
                    <span class="create_new" @click="newFileNameSelectOpen">Create new</span>
                    <template v-if="newFileNameSelect">
                        <div id="new-file-name-select">
                            <div v-if="newFileNameSelectMessage != ''" id="new-file-name-select-message">
                                {{ newFileNameSelectMessage }}
                            </div>
                            <form action="" @submit.prevent="createFile">
                                <input type="text" v-model="newFileNameSelectName">
                                <div id="new-file-name-select-options">
                                    <div id="new-file-name-select-add">
                                        <button type="submit">Create</button>
                                    </div>
                                    <div id="new-file-name-select-cancel" @click="newFileNameSelectClose">
                                        <button type="reset">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </template>
                    <h2>Select a transactions file</h2>
                    <div class="row center-xs">
                        <ul class="col-xs-12 col-sm-10 col-md-8 col-lg-6">
                            <li v-if="path != ''" @click="clickFolderUp">..</li>
                            <li class="folder" v-for="folder in userFiles.folders" @click="clickFolder(folder)">
                                <span class="jam jam-folder-f"></span>
                                <span>{{ folder.name }}</span>
                            </li>
                            <li class="file" v-for="file in userFiles.files" @click="clickFile(file)">
                                <span class="jam jam-file"></span>
                                <span>{{ file.name }}</span>
                            </li>
                        </ul>
                    </div>
                </template>
                <template
                    v-if="filesLoadingMessage != ''">
                    <h2>
                        <span class="jam jam-disc"></span>
                        <span>
                            {{ filesLoadingMessage }}
                        </span>
                    </h2>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'UserAction',
    props: [
        'generalUserData',
        'historyReturn',
        'redirectUri',
        'client_id',
        'checkOnline',
        'checkOnlineUrl'
    ],
    data: function() {
        return {
            userAction: '',
            remember_me: false,
            authUrl: '',
            rememberMe: false,
            offlineError: false,
            loading: false,
            loadingMessage: '',
            newFileNameSelect: false,
            newFileNameSelectMessage: '',
            newFileNameSelectName: 'Finances Manager',
            filesLoadingMessage: '',
            userFiles: {
                folders: [],
                files: []
            },
            path: '',
            emptyFile: {
                "lastId": {
                    'transactions': -1,
                    'accounts': -1
                },
                "transactions": [],
                "accounts": [],
                "settings": {
                    "text": {
                        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                        "transactionsTableColumnTitles": ["Title", "Day", "Amount"]
                    },
                    "visual": {}
                }
            }
        }
    },
    methods: {
        newFileNameSelectOpen: function() {
            this.newFileNameSelect = true;
            setTimeout(function() {
                document.querySelector('#new-file-name-select > form > input').focus();
            }, 100);
        },
        newFileNameSelectClose: function() {
            this.newFileNameSelect = false;
            this.newFileNameSelectName = 'Finances Manager';
            this.newFileNameSelectMessage = '';
        },
        createFile: function() {
            function mainFunc(self) {
                self.newFileNameSelect = false;
                let existingFiles = [];
                let fileExists = false;
                // let higherIndex = 0;
                for (let file of self.userFiles.files) {
                    // if (file.name.indexOf('HomeFinancesManager_') > -1) {
                    //     existingFiles.push(file.name);
                    // }
                    let fileName = file.name.split('.json')[0];
                    if (fileName == self.newFileNameSelectName) {
                        fileExists = true;
                        break;
                    }
                }
                if (fileExists) {
                    self.newFileNameSelectMessage = 'File exists';
                    self.newFileNameSelect = true;
                } else {
                    self.newFileNameSelectMessage = '';
                    self.filesLoadingMessage = 'Creating file';
                    console.log(self.path + '/' + self.newFileNameSelectName + '.json')
                    let emptyFile = new Blob([JSON.stringify(self.emptyFile)], {type: 'JSON'});
                    let Dropbox = require('dropbox').Dropbox;
                    let dbx = new Dropbox({ accessToken: self.generalUserData.account.access_token });
                    dbx.filesUpload({
                            path: self.path + '/' + self.newFileNameSelectName + '.json',
                            contents: emptyFile,
                            mode: 'overwrite',
                            autorename: true,
                            mute: true
                        })
                        .then(function(response) {
                            self.checkFile({path_lower: self.path + '/' + self.newFileNameSelectName + '.json'})
                        })
                        .catch(function(error) {
                            console.error(error);
                        });
                    self.newFileNameSelectName = 'Finances Manager';
                    self.newFileNameSelectMessage = '';
                }
                // for (let file of existingFiles) {
                //     let index = parseInt(file.split('HomeFinancesManager_')[1].split('.')[0]);
                //     index == '' ? index = 0 : index = index;
                //     index > higherIndex ? higherIndex = index : null;
                // }
            }
            let self = this;
            if (self.checkOnline) {
                let xhttp = new window.XMLHttpRequest();
                xhttp.open("HEAD", this.checkOnlineUrl, true);
                xhttp.timeout = 5750;
                xhttp.addEventListener('load', function(event) {
                    mainFunc(self);
                });
                xhttp.addEventListener('error', function() {
                    self.offlineError = true;
                });
                xhttp.addEventListener('timeout', function() {
                    self.offlineError = true;
                });
                xhttp.send(null);
            } else {
                mainFunc(self);
            }
        },
        useFile: function(file, path) {
            this.$parent.userMustTakeAction = false;
            this.userAction = '';
            this.$parent.fileData = file;
            this.generalUserData.selectedFilePath = path;
            this.$emit('allSetUp');
        },
        fileIsValid: function(file) {
            let isValid = true;
            try {
                JSON.parse(file);
            } catch (e) {
                return false;
            }

            file = JSON.parse(file);

            if (Number.isInteger(file.lastId.transactions) &&
                Number.isInteger(file.lastId.accounts) &&
                file.transactions != undefined &&
                file.transactions.constructor === Array &&
                file.accounts != undefined &&
                file.accounts.constructor === Array &&
                file.settings != undefined &&
                file.settings.text != undefined &&
                file.settings.text.months != undefined &&
                file.settings.text.transactionsTableColumnTitles != undefined &&
                file.settings.visual != undefined) {
                return true;
            } else {
                return false;
            }
        },
        checkFile: function(file) {
            function mainFunc(self) {
                let Dropbox = require('dropbox').Dropbox;
                let dbx = new Dropbox({ accessToken: self.generalUserData.account.access_token });
                self.filesLoadingMessage = 'Checking file';
                dbx.filesDownload({path: file.path_lower})
                    .then(function(data) {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function() {
                            if (self.fileIsValid(reader.result)) {
                                self.$vlf.getItem('access_token')
                                    .then(function(access_token) {
                                        if (access_token != null) {
                                            self.$vlf.setItem('file', JSON.parse(reader.result))
                                                .then(function() {
                                                    self.$vlf.setItem('file_path', file.path_lower);
                                                });
                                        } else {
                                            sessionStorage.setItem('file', JSON.parse(reader.result));
                                            sessionStorage.setItem('file_path', file.path_lower);
                                        }
                                        self.useFile(reader.result, file.path_lower)
                                    });
                            }
                            self.filesLoadingMessage = '';
                        });
                        reader.readAsText(data.fileBlob);
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            }
            let self = this;
            if (self.checkOnline) {
                let xhttp = new window.XMLHttpRequest();
                xhttp.open("HEAD", this.checkOnlineUrl, true);
                xhttp.timeout = 5750;
                xhttp.addEventListener('load', function(event) {
                    mainFunc(self, file);
                });
                xhttp.addEventListener('error', function() {
                    self.offlineError = true;
                });
                xhttp.addEventListener('timeout', function() {
                    self.offlineError = true;
                });
                xhttp.send(null);
            } else {
                mainFunc(self, file);
            }
        },
        clickFolderUp: function() {
            this.path = this.path.split('/');
            let path = '';
            for (let i=1; i<this.path.length-1; i++) {
                path += '/' + this.path[i];
            }
            this.path = path;
            this.getFiles(this.path);
        },
        clickFile: function(file) {
            let fileExtension = file.name.split('.');
            fileExtension = fileExtension[fileExtension.length - 1];
            if (fileExtension == 'json') {
                this.checkFile(file);
            }
        },
        clickFolder: function(folder) {
            this.path = folder.path_lower;
            this.getFiles(folder.path_lower);
        },
        displayFiles: function(files) {
            this.userFiles = {
                folders: [],
                files: []
            };
            for (let file of files) {
                file[".tag"] == 'file' ? this.userFiles.files.push(file) : this.userFiles.folders.push(file);
            }
        },
        getFiles: function(path) {
            function mainFunc(self, path) {
                let Dropbox = require('dropbox').Dropbox;
                let dbx = new Dropbox({ accessToken: self.generalUserData.account.access_token });
                self.filesLoadingMessage = 'Displaying files';
                dbx.filesListFolder({'path': path})
                    .then(function(response) {
                        self.filesLoadingMessage = '';
                        self.displayFiles(response.entries)
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
            }
            let self = this;
            if (self.checkOnline) {
                let xhttp = new window.XMLHttpRequest();
                xhttp.open("HEAD", this.checkOnlineUrl, true);
                xhttp.timeout = 5750;
                xhttp.addEventListener('load', function(event) {
                    mainFunc(self, path);
                });
                xhttp.addEventListener('error', function() {
                    self.offlineError = true;
                });
                xhttp.addEventListener('timeout', function() {
                    self.offlineError = true;
                });
                xhttp.send(null);
            } else {
                mainFunc(self, path);
            }
        },
        login: function() {
            this.$vlf.setItem('remember_me', this.rememberMe);
        },
        setUpLogin: function() {
            let Dropbox = require('dropbox').Dropbox;
            let dbx = new Dropbox({ clientId: this.client_id });
            this.authUrl = dbx.getAuthenticationUrl(this.redirectUri);
            this.$parent.userMustTakeAction = true;
            this.userAction = 'login';
        },
        checkStorage: function() {
            let self = this;
            this.$vlf.getItem('file')
                .then(function(file) {
                    if (file != null || sessionStorage.getItem('file') != null) {
                        file != null ? null : file = sessionStorage.getItem('file');
                        self.$vlf.getItem('file_path')
                            .then(function(file_path) {
                                file_path != null ? null : file_path = sessionStorage.getItem('file_path');
                                let xhttp = new window.XMLHttpRequest();
                                xhttp.open("HEAD", self.checkOnlineUrl, true);
                                xhttp.timeout = 5750;
                                xhttp.addEventListener('load', function(event) {
                                    self.checkFile({path_lower: file_path});
                                });
                                xhttp.addEventListener('error', function() {
                                    console.log('error');
                                    self.useFile(file, file_path);
                                });
                                xhttp.addEventListener('timeout', function() {
                                    console.log('timeout');
                                    self.useFile(file, file_path);
                                });
                                xhttp.send(null);
                            });
                    } else {
                        self.$vlf.getItem('access_token')
                            .then(function(access_token) {
                                if (access_token != null || sessionStorage.getItem('access_token') != null) {
                                    access_token != null ? null : access_token = sessionStorage.getItem('access_token');
                                    function mainFunc(self, access_token) {
                                        let Dropbox = require('dropbox').Dropbox;
                                        let dbx = new Dropbox({ accessToken: access_token });
                                        self.loading = true;
                                        self.loadingMessage = 'Loading saved user data';
                                        dbx.usersGetCurrentAccount()
                                            .then(function(response) {
                                                self.generalUserData.account.name = response.name.familiar_name;
                                                self.generalUserData.account.access_token = access_token;
                                                self.userAction = 'select_file';
                                                self.getFiles('');
                                                self.loading = false;
                                                self.loadingMessage = '';
                                            })
                                            .catch(function(error) {
                                                self.loading = false;
                                                self.loadingMessage = '';
                                                self.$vlf.removeItem('access_token');
                                                sessionStorage.removeItem('access_token');
                                                self.setUpLogin();
                                                console.error(error);
                                            });
                                    }
                                    if (self.checkOnline) {
                                        let xhttp = new window.XMLHttpRequest();
                                        xhttp.open("HEAD", self.checkOnlineUrl, true);
                                        xhttp.timeout = 5750;
                                        xhttp.addEventListener('load', function(event) {
                                            mainFunc(self, access_token);
                                        });
                                        xhttp.addEventListener('error', function() {
                                            self.offlineError = true;
                                        });
                                        xhttp.addEventListener('timeout', function() {
                                            self.offlineError = true;
                                        });
                                        xhttp.send(null);
                                    } else {
                                        mainFunc(self, access_token);
                                    }
                                } else {
                                    self.setUpLogin();
                                }
                            });
                    }
                });
        },
        authPage: function() {
            let self = this;
            let query = window.location.hash.split('#')[1];
            if (query != undefined && query.indexOf('error_description') < 0) {
                let vars = query.split('&');
                let accountData = [];
                self.$vlf.getItem('remember_me')
                    .then(function(remember_me) {
                        self.$vlf.removeItem('remember_me');
                        for (let i = 0; i < vars.length; i++) {
                            let pair = vars[i].split('=');
                            accountData.push(pair);
                            switch (pair[0]) {
                                case 'access_token':
                                    self.generalUserData.account.access_token = pair[1];
                                    if (remember_me) {
                                        self.$vlf.setItem('access_token', pair[1]);
                                    } else {
                                        sessionStorage.setItem('access_token', pair[1]);
                                    }
                                    break;
                            }
                        }
                        history.pushState(null, '', self.historyReturn);
                        self.checkStorage();
                    });
            } else {
                if (query != undefined && query.indexOf('error_description') > -1) {
                    history.pushState(null, '', this.historyReturn);
                }
                self.checkStorage();
            }
        }
    },
    created: function() {
        this.authPage();
    },
    mounted: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    background: #F6F6F6;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    position: relative;
    text-align: left;
    li {
        display: block;
        margin: auto;
        color: #000;
        padding: 0.5em;
        border-bottom: 1px solid #d3d3d3;
        cursor: pointer;
        &:hover {
            background-color: #EDEDED;
        }
        &:first-child {
            border-radius: 5px 5px 0 0;
        }
        &:last-child {
            border-radius: 0 0 5px 5px;
            border-bottom: 0 none;
        }
        span {
            vertical-align: middle;
        }
        .jam {
            margin-right: 0.4rem;
        }
    }
}
h1 {
    font-size: 1.8rem;
    font-weight: normal;
    margin-top: 2rem;
}
h2 {
    font-size: 1.3rem;
    margin-bottom: 1.2em;
    color: #999;
}
h1,
h2 {
    cursor: default;
    text-align: center;
    font-weight: normal;
}
#user-action {
    width: 100%;
}
.offline,
.login {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding: 1rem;
    left: 0;
    .button,
    div > span {
        display: inline-block;
        border-radius: 0.3rem;
        background-color: #fff;
        cursor: pointer;
        box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.25);
        font-size: 1rem;
        padding: 0.6rem 1rem;
        line-height: 1;
        color: #333;
        text-decoration: none;
    }
    div {
        text-align: center;
    }
}
.loading {
    text-align: center;
    span {
        vertical-align: middle;
    }
    .jam {
        margin-right: 0.5rem;
    }
}
.login {
    text-align: center;
    h1 {
        margin-top: 0;
        margin-bottom: 0.2rem;
    }
    h2 {
        margin-top: 0;
        margin-bottom: 3rem;
        font-size: 1rem;
    }
    .jam {
        margin-right: 10px;
    }
}
.checkbox {
    margin-top: 2rem;
    > * {
        vertical-align: middle;
    }
    label,
    input {
        cursor: pointer;
    }
    input {
        margin: 0;
    }
    label {
        color: #000;
        padding-left: 0.5rem;
    }
}
.select_file {
    #new-file-name-select,
    .create_new {
        background: #F6F6F6;
        padding: 0.2rem 1rem;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 0 0 0.5rem 0.5rem;
        box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.25);
        z-index: 99;
    }
    .create_new {
        cursor: pointer;
    }
    #new-file-name-select {
        padding: 0;
        input {
            text-align: center;
            background-color: #FBFBFB;
            border: 0 none;
            padding: 0.4rem;
            padding-top: 1rem;
            font-size: 1.1rem;
            width: 100%;
        }
        button {
            display: block;
            padding: 0.7rem 1rem;
            cursor: pointer;
            border: 0 none;
            width: 100%;
            height: 100%;
        }
    }
    #new-file-name-select-message {
        text-align: center;
        padding: 0.3rem;
        color: #f00;
        background: #fff;
    }
    #new-file-name-select-options > div {
        margin: auto;
        display: inline-block;
        width: 50%;
        text-align: center;
    }
    #new-file-name-select-cancel button {
        border-radius: 0 0 0.5rem 0;
    }
    #new-file-name-select-add button {
        background-color: #0769E4;
        color: #fff;
        border-radius: 0 0 0 0.5rem;
        border-right: 1px solid #d3d3d3;
    }
}
</style>
