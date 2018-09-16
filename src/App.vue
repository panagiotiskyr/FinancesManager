<template>
    <div id="app" v-on:click="contextMenuClose">

        <user-action
            v-if="userMustTakeAction"
            @allSetUp="initApp"
            :checkOnline="checkOnline"
            :checkOnlineUrl="checkOnlineUrl"
            :historyReturn="historyReturn"
            :redirectUri="redirectUri"
            :generalUserData="generalUserData" 
            :client_id="clientId">
        </user-action>

        <quick-transaction
            v-if="!userMustTakeAction && pageShown == 1"
            :fileData="fileData">
        </quick-transaction>

        <template
            v-if="!userMustTakeAction && pageShown == 0">
            <top-bar
                :accounts="fileData.accounts"
                :dateData="{
                        month: this.selectedDateTransactionsData.month.name,
                        year: this.selectedDateTransactionsData.year
                    }"
                @changeMonthOpen="changeMonthOpen"
                @newTransaction="contextEditTransaction"
                @manageAccountsWindowOpen="manageAccountsWindowOpen"
                @changeHomescreen="changeHomescreen"
                @changePageShown="changePageShown"
                @reloadApp="reloadApp">
            </top-bar>
            <main-content
                @contextMenu="contextMenu"
                :tablesColumnTitles="fileData.settings.text.transactionsTableColumnTitles"
                :accounts="fileData.accounts"
                :transactions="selectedDateTransactionsData.transactions"
                :userData="{
                    generalUserData: generalUserData,
                    client_id: clientId
                }">
            </main-content>

            <change-month
                v-if="changeMonthIsVisible"
                :selectedMonthName="selectedDateTransactionsData.month.name"
                :selectedYear="selectedDateTransactionsData.year"
                :monthNames="fileData.settings.text.months"
                @changeMonthClose="changeMonthClose"
                @changeSelectedDate="changeSelectedDate">
            </change-month>
            <context-menu
                v-if="contextMenuIsVisible"
                :contextClickX="contextClickX"
                :contextClickY="contextClickY"
                @contextEditTransaction="contextEditTransaction"
                @contextDeleteTransaction="contextDeleteTransaction">
            </context-menu>
            <new-edit-transaction
                v-if="newEditTransactionIsVisible"
                :editTransactionData="editTransactionData"
                :accounts="fileData.accounts"
                @newEditTransactionWindowClose="newEditTransactionWindowClose"
                @addTransaction="addTransaction"
                @updateTransaction="updateTransaction">
            </new-edit-transaction>
            <manage-accounts
                v-if="manageAccountsIsVisible"
                :data="fileData"
                @manageAccountsWindowClose="manageAccountsWindowClose">
            </manage-accounts>
            <notification-box
                :class="{ 'visible': notificationIsVisible }"
                :msg="notificationMsg"
                :icon="notificationIcon">
            </notification-box>
            <context-delete-confirmation v-if="contextDeleteConfirmationVisible" />

        </template>

    </div>
</template>

<script>
import TopBar from './components/TopBar.vue';
import UserAction from './components/UserAction.vue';
import QuickTransaction from './components/QuickTransaction.vue';
import MainContent from './components/MainContent.vue';
import ChangeMonth from './components/ChangeMonth.vue';
import ContextMenu from './components/ContextMenu.vue';
import ContextDeleteConfirmation from './components/ContextDeleteConfirmation.vue';
import NewEditTransaction from './components/NewEditTransaction.vue';
import ManageAccounts from './components/ManageAccounts.vue';
import NotificationBox from './components/NotificationBox.vue';

export default {
    name: 'app',
    components: {
        "top-bar": TopBar,
        "user-action": UserAction,
        "quick-transaction": QuickTransaction,
        "main-content": MainContent,
        "change-month": ChangeMonth,
        "context-menu": ContextMenu,
        "context-delete-confirmation": ContextDeleteConfirmation,
        "new-edit-transaction": NewEditTransaction,
        "manage-accounts": ManageAccounts,
        "notification-box": NotificationBox
    },
    data: function() {
        return {

            //
            // DEV
            //
                historyReturn: 'https://panagiotiskyr.github.io/FinancesManager/',
                checkOnline: true,
                redirectUri: 'https://panagiotiskyr.github.io/FinancesManager/',
                // historyReturn: '/',
                // checkOnline: false,
                // redirectUri: 'http://localhost:8080/',
                checkOnlineUrl: 'https://panagiotiskyr.github.io/',

            //
            // GENERAL
            //

                clientId: 'k0xho83mnf2jbth',
                // General settings (translations, colors, font-sizes ...)
                // User can modify them through the settings component
                pageShown: -1,

                // User data
                generalUserData: {
                    selectedFilePath: '',
                    account: {
                        name: '',
                        access_token: ''
                    }
                },

                fileData: null,

                userMustTakeAction: true,

            //
            // TOP BAR
            //
                topBarDateData: {},

            //
            // MAIN CONTENT
            //
                // Information about the selected month and year transactions
                selectedDateTransactionsData: {
                    month: {
                        num: 0,
                        name: ''
                    },
                    year: 0,
                    transactions: []
                },

            //
            // CONTEXT MENU
            //
                contextMenuIsVisible: false,
                contextClickX: 0,
                contextClickY: 0,
                contextTransaction: null,

            //
            // CHANGE MONTH
            //
                changeMonthIsVisible: false,

            //
            // NEW / EDIT TRANSACTION
            //
                newEditTransactionIsVisible: false,
                editTransactionData: null,

                notificationIsVisible: false,
                notificationMsg: '',
                notificationIcon: '',

                contextDeleteConfirmationVisible: false,

            //
            // MANAGE ACCOUNTS
            //
                manageAccountsIsVisible: false

        }
    },
    methods: {
        //
        // GENERAL
        //
            // General settings (translations, colors, font-sizes ...)
            isOnline: function(callback) {
                let self = this;
                let xhttp = new window.XMLHttpRequest();
                xhttp.open("HEAD", "http://panagiotiskyr.github.io/", true);
                xhttp.timeout = 5750;
                xhttp.send();
                xhttp.onreadystatechange = callback();
            },

        //
        // TOP BAR
        //
            reloadApp: function() {
                location.reload();
            },
            changePageShown: function() {
                this.pageShown == 0 ? this.pageShown = 1 : this.pageShown = 0;
            },
            changeHomescreen: function() {
                let self = this;
                this.$vlf.getItem('homescreen')
                    .then(function(homescreen) {
                        if (homescreen == null) {
                            homescreen = sessionStorage.getItem('homescreen');
                            homescreen == 0 ? sessionStorage.setItem('homescreen', 1) : sessionStorage.setItem('homescreen', 0);
                        } else {
                            homescreen == 0 ? self.$vlf.setItem('homescreen', 1) : self.$vlf.setItem('homescreen', 0);
                        }
                    });
            },

        //
        // MAIN CONTENT
        //
            // A shortcut to update the selected date transactions
            updateTransactions: function() {
                this.getSelectedDateTransactions();
            },
            // Get selected month and year transactions
            getSelectedDateTransactions: function() {
                if (this.selectedDateTransactionsData.month.num != 0) { // If the month num is not 0 then get the selected date transactions
                    this.selectedDateTransactionsData.transactions = []; // Clear any saved transactions data
                    for (let transaction of this.fileData.transactions) {
                        if (transaction.year == this.selectedDateTransactionsData.year && transaction.month == this.selectedDateTransactionsData.month.num) {
                            this.selectedDateTransactionsData.transactions.push(transaction);
                        }
                    }
                } else {
                    // If this is the first time running the app,
                    // then we need to display the current month and year transactions
                    const d = new Date();
                    this.selectedDateTransactionsData.month.num = d.getMonth() + 1;
                    this.selectedDateTransactionsData.month.name = this.fileData.settings.text.months[d.getMonth()];
                    this.selectedDateTransactionsData.year = d.getFullYear();
                    this.updateTransactions(); // Update the selected date transactions
                }
            },

        //
        // CHANGE MONTH
        //
            changeMonthOpen: function() {
                document.getElementsByTagName('body')[0].classList.add('full-content-window-visible');
                this.changeMonthIsVisible = true;
            },
            changeMonthClose: function() {
                document.getElementsByTagName('body')[0].classList.remove('full-content-window-visible');
                this.changeMonthIsVisible = false;
            },
            changeSelectedDate: function(monthNum, monthName, year) {
                this.selectedDateTransactionsData.month.num = monthNum;
                this.selectedDateTransactionsData.month.name = monthName;
                this.selectedDateTransactionsData.year = year;
                this.updateTransactions();
                this.changeMonthClose();
            },

        //
        // CONTEXT MENU
        //
            contextMenu: function(transaction, e) {
                this.contextMenuIsVisible = true;
                this.contextTransaction = transaction;
                this.contextClickX = e.clientX;
                this.contextClickY = e.clientY;
            },
            contextMenuClose: function() {
                this.contextMenuIsVisible = false;
            },
            contextEditTransaction: function() {
                this.newEditTransactionWindowOpen();
            },
            contextDeleteTransaction: function() {
                this.contextDeleteConfirmationVisible = true;
            },
            deleteTransactionConfirmed: function() {
                this.deleteTransaction();
                this.contextDeleteConfirmationVisible = false;
            },

        //
        // NEW / EDIT TRANSACTION
        //
            newEditTransactionWindowOpen: function() {
                document.getElementsByTagName('body')[0].classList.add('full-content-window-visible');
                this.editTransactionData = this.contextTransaction;
                this.newEditTransactionIsVisible = true;
            },
            newEditTransactionWindowClose: function() {
                document.getElementsByTagName('body')[0].classList.remove('full-content-window-visible');
                this.editTransactionData = null;
                this.contextTransaction = null;
                this.newEditTransactionIsVisible = false;
            },
            addChange: function(data, upload = true) {
                let self = this;
                this.$vlf.getItem('access_token')
                    .then(function(access_token) {
                        let changes;
                        if (access_token == null) {
                            changes = JSON.parse(sessionStorage.getItem('changes'));
                            changes == null ? changes = [] : changes = changes;
                            if (data.action == 'add' ) {
                                changes.push(data);
                                sessionStorage.setItem('changes', JSON.stringify(changes));
                                upload ? self.uploadFile() : null;
                            } else {
                                let changesForId = [data];
                                for (let i = 0; i < changes.length; i++) {
                                    if (changes[i].what == data.what && changes[i].file == data.file && changes[i].id == data.id && changes[i].what == data.what) {
                                        changesForId.push(changes[i])
                                        changes.splice(i, 1);
                                        i -= 1;
                                    }
                                }
                                let groupedChanges = {};
                                for (let change of changesForId) {
                                    if (change.action == 'delete') {
                                        groupedChanges = change;
                                        break;
                                    } else {
                                        for (let field in change) {
                                            if (field != 'file' && 
                                                field != 'action' && 
                                                field != 'id' && 
                                                field != 'time' && 
                                                field != 'what' && 
                                                (groupedChanges[field] == undefined || change[field].time > groupedChanges[field].time)) {
                                                    groupedChanges[field] = change[field];
                                            }
                                        }
                                    }
                                }
                                if (groupedChanges.id == undefined) {
                                    groupedChanges.id = data.id;
                                    groupedChanges.file = data.file;
                                    groupedChanges.action = data.action;
                                    groupedChanges.what = data.what;
                                }
                                changes.push(groupedChanges);
                                let file = sessionStorage.getItem('file');
                                sessionStorage.setItem('changes', JSON.stringify(changes));
                                upload ? self.uploadFile() : null;
                            }
                        } else {
                            self.$vlf.getItem('changes')
                                .then(function(changes) {
                                    changes == null ? changes = [] : null;
                                    if (data.action == 'add' ) {
                                        changes.push(data);
                                        self.$vlf.setItem('changes', changes)
                                            .then(function() {
                                                upload ? self.uploadFile() : null;
                                            });
                                    } else {
                                        let changesForId = [data];
                                        for (let i = 0; i < changes.length; i++) {
                                            if (changes[i].what == data.what && changes[i].file == data.file && changes[i].id == data.id && changes[i].what == data.what) {
                                                changesForId.push(changes[i])
                                                changes.splice(i, 1);
                                                i -= 1;
                                            }
                                        }
                                        let groupedChanges = {};
                                        for (let change of changesForId) {
                                            if (change.action == 'delete') {
                                                groupedChanges = change;
                                                break;
                                            } else {
                                                for (let field in change) {
                                                    if (field != 'file' && 
                                                        field != 'action' && 
                                                        field != 'id' && 
                                                        field != 'time' && 
                                                        field != 'what' && 
                                                        (groupedChanges[field] == undefined || change[field].time > groupedChanges[field].time)) {
                                                            groupedChanges[field] = change[field];
                                                    }
                                                }
                                            }
                                        }
                                        if (groupedChanges.id == undefined) {
                                            groupedChanges.id = data.id;
                                            groupedChanges.file = data.file;
                                            groupedChanges.action = data.action;
                                            groupedChanges.what = data.what;
                                        }
                                        changes.push(groupedChanges);
                                        self.$vlf.getItem('file')
                                            .then(function(file) {
                                                self.$vlf.setItem('changes', changes)
                                                    .then(function() {
                                                        upload ? self.uploadFile() : null;
                                                    });
                                            });
                                    }
                                });
                        }
                    });
            },
            updateTransaction: function(updatedTransaction) {
                let self = this;
                let updatedValues = {};
                for (var i in this.editTransactionData) {
                    if (this.editTransactionData.hasOwnProperty(i) &&
                        updatedTransaction[i] != this.editTransactionData[i]) {
                        updatedValues[String(i)] = {
                            value: updatedTransaction[i], 
                            time: new Date().getTime()
                        };
                    }
                }
                if (Object.keys(updatedValues).length > 0) {
                    updatedValues.id = updatedTransaction.id;
                    updatedValues.action = 'update';
                    updatedValues.file = this.generalUserData.selectedFilePath;
                    updatedValues.what = 'transaction';
                    for (let i=0; i<this.fileData.transactions.length; i++) {
                        if (this.fileData.transactions[i].id == updatedTransaction.id) {
                            for (var j in this.fileData.transactions[i]) {
                                if (this.fileData.transactions[i].hasOwnProperty(j)) {
                                    this.fileData.transactions[i][j] = updatedTransaction[j];
                                }
                            }
                            break;
                        }
                    }
                    this.$vlf.getItem('file')
                        .then(function(file) {
                            if (file == null) {
                                file = sessionStorage.getItem('file');
                                file = JSON.parse(file);
                                file.transactions = self.fileData.transactions;
                                sessionStorage.setItem('file', JSON.stringify(file));
                            } else {
                                file.transactions = self.fileData.transactions;
                                self.$vlf.setItem('file', JSON.parse(JSON.stringify(file)));
                            }
                        });
                    this.addChange(updatedValues);
                    this.updateTransactions();
                }
                this.editTransactionData = null;
            },
            addTransaction: function(data) {
                let self = this;
                this.fileData.lastId.transactions += 1;
                data.id = this.fileData.lastId.transactions;
                data.action = 'add';
                data.file = this.generalUserData.selectedFilePath;
                data.time = new Date().getTime();
                data.what = 'transaction';
                let transaction = {};
                for (let field in data) {
                    if (field != 'action' && field != 'file' && field != 'time' && field != 'what') {
                        transaction[field] = data[field]
                    }
                }
                this.fileData.transactions.push(transaction);
                this.$vlf.getItem('file')
                    .then(function(file) {
                        if (file == null) {
                            file = sessionStorage.getItem('file');
                            file = JSON.parse(file);
                            file.transactions = self.fileData.transactions;
                            file.lastId.transactions = self.fileData.lastId.transactions;
                            sessionStorage.setItem('file', JSON.stringify(file));
                        } else {
                            file.transactions = self.fileData.transactions;
                            file.lastId.transactions = self.fileData.lastId.transactions;
                            self.$vlf.setItem('file', JSON.parse(JSON.stringify(file)));
                        }
                    });
                this.addChange(data);
                this.updateTransactions();
            },
            deleteTransaction: function(upload = true) {
                let self = this;
                let transaction = this.contextTransaction;
                let data = this.contextTransaction;
                data.id = this.contextTransaction.id;
                data.action = 'delete';
                data.file = this.generalUserData.selectedFilePath;
                data.time = new Date().getTime();
                data.what = 'transaction';
                this.addChange(data, upload);
                for (let i=0; i<this.fileData.transactions.length; i++) {
                    if (this.fileData.transactions[i].id == this.contextTransaction.id) {
                        this.fileData.transactions.splice(i, 1);
                        break;
                    }
                }
                this.$vlf.getItem('file')
                    .then(function(file) {
                        if (file == null) {
                            file = sessionStorage.getItem('file');
                            file = JSON.parse(file);
                            file.transactions = self.fileData.transactions;
                            sessionStorage.setItem('file', JSON.stringify(file));
                        } else {
                            file.transactions = self.fileData.transactions;
                            self.$vlf.setItem('file', JSON.parse(JSON.stringify(file)));
                        }
                    });
                this.contextTransaction = null;
                this.updateTransactions();
            },

        //
        // ACCCOUNT METHODS
        //
            uploadFile: function() {
                let self = this;
                let xhttp = new window.XMLHttpRequest();
                this.showNotification('', 'disc', false)
                xhttp.open("HEAD", self.checkOnlineUrl, true);
                xhttp.timeout = 5750;
                xhttp.addEventListener('load', function(event) {
                    self.$vlf.getItem('access_token')
                        .then(function(access_token) {
                            if (access_token == null) {
                                access_token = sessionStorage.getItem('access_token');
                                let file_path = sessionStorage.getItem('file_path');
                                let file = new Blob([sessionStorage.getItem('file')], {type: 'JSON'});
                                let Dropbox = require('dropbox').Dropbox;
                                let dbx = new Dropbox({ accessToken: access_token });
                                dbx.filesUpload({
                                        path: file_path,
                                        contents: file,
                                        mode: 'overwrite',
                                        autorename: true,
                                        mute: true
                                    })
                                    .then(function(response) {
                                        sessionStorage.removeItem('changes');
                                        self.showNotification('', 'check', true);
                                    })
                                    .catch(function(error) {
                                        console.error(error);
                                    });
                                // dbx.filesDownload({path: file_path})
                                //     .then(function(data) {
                                //         var reader = new FileReader();
                                //         reader.addEventListener("loadend", function() {
                                //             function uploadFile(oldFile, access_token) {
                                //                 let Dropbox = require('dropbox').Dropbox;
                                //                 let dbx = new Dropbox({ accessToken: access_token });
                                //                 let file = new Blob([JSON.stringify(oldFile)], {type: 'JSON'});
                                //                 dbx.filesUpload({
                                //                         path: self.generalUserData.selectedFilePath,
                                //                         contents: file,
                                //                         mode: 'overwrite',
                                //                         autorename: true,
                                //                         mute: true
                                //                     })
                                //                     .then(function(response) {
                                //                         // self.showNotification('Uploaded', 'check', true);
                                //                     })
                                //                     .catch(function(error) {
                                //                         console.error(error);
                                //                     });
                                //             }
                                //             let oldFile = JSON.parse(JSON.parse(JSON.stringify(reader.result)));
                                //             let changes = JSON.parse(sessionStorage.getItem('changes'));
                                //             changes == null ? changes = [] : null;
                                //             for (let change of changes) {
                                //                 if (change.what == 'account') {
                                //                     if (change.action == 'add') {
                                //                         let accountExists = false;
                                //                         for (let account of oldFile.accounts) {
                                //                             if (account.id == change.id) {
                                //                                 accountExists = true;
                                //                                 break;
                                //                             }
                                //                         }
                                //                         if (!accountExists) {
                                //                             oldFile.accounts.push({
                                //                                 id: change.id,
                                //                                 title: change.title,
                                //                                 total: null
                                //                             });
                                //                         }
                                //                     } else if (change.action == 'delete') {
                                //                         for (let i=0; i<oldFile.accounts.length; i++) {
                                //                             if (oldFile.accounts[i].id == change.id) {
                                //                                 oldFile.accounts.splice(i, 1);
                                //                                 break;
                                //                             }
                                //                         }
                                //                     } else {
                                //                         let accountExists = false;
                                //                         for (let account of oldFile.accounts) {
                                //                             if (account.id == change.id) {
                                //                                 if (account.changes == null) {
                                //                                     account.title = change.title.value;
                                //                                     account.changes = {
                                //                                         "title": change.title.time
                                //                                     }
                                //                                 } else {
                                //                                     if (change.title.time > account.changes.title) {
                                //                                         account.title = change.title.value;
                                //                                         account.changes = {
                                //                                             "title": change.title.time
                                //                                         }
                                //                                     }
                                //                                 }
                                //                                 accountExists = true;
                                //                             }
                                //                         }
                                //                         if (!accountExists) {
                                //                             oldFile.accounts.push({
                                //                                 id: change.id,
                                //                                 title: change.title,
                                //                                 total: null
                                //                             });
                                //                         }
                                //                     }
                                //                 } else if (change.what == 'transaction') {
                                //                     if (change.action == 'add') {
                                //                         let transactionExists = false;
                                //                         for (let transaction of oldFile.transactions) {
                                //                             if (transaction.id == change.id) {
                                //                                 transactionExists = true;
                                //                                 break;
                                //                             }
                                //                         }
                                //                         if (!transactionExists) {
                                //                             let transaction = {};
                                //                             for (let field in change) {
                                //                                 if (field != 'action' && field != 'file' && field != 'time' && field != 'what') {
                                //                                     transaction[field] = change[field];
                                //                                 }
                                //                             }
                                //                             oldFile.transactions.push(transaction);
                                //                         }
                                //                     } else if (change.action == 'delete') {
                                //                         for (let i=0; i<oldFile.transactions.length; i++) {
                                //                             if (oldFile.transactions[i].id == change.id) {
                                //                                 oldFile.transactions.splice(i, 1);
                                //                                 break;
                                //                             }
                                //                         }
                                //                     } else {
                                //                         let transactionExists = false;
                                //                         for (let transaction of oldFile.transactions) {
                                //                             if (transaction.id == change.id) {
                                //                                 transactionExists = true;
                                //                                 if (transaction.changes == null) {
                                //                                     transaction.changes = {};
                                //                                     for (let field in change) {
                                //                                         if (field != 'file' && 
                                //                                             field != 'action' && 
                                //                                             field != 'id' && 
                                //                                             field != 'time' && 
                                //                                             field != 'what') {
                                //                                                 if (change[field] !== null && typeof change[field] === 'object') {
                                //                                                     transaction[field] = change[field][Object.keys(change[field])[0]];
                                //                                                     transaction.changes[field] = change[field][Object.keys(change[field])[0]];
                                //                                                 } else {
                                //                                                     transaction[field] = change[field];
                                //                                                 }
                                //                                         }
                                //                                     }
                                //                                 } else {
                                //                                     let changeExists;
                                //                                     for (let field in change) {
                                //                                         if (field != 'file' && 
                                //                                             field != 'action' && 
                                //                                             field != 'id' && 
                                //                                             field != 'time' && 
                                //                                             field != 'what') {
                                //                                             if (transaction.changes[field] !== null && typeof transaction.changes[field] === 'object') {
                                //                                                 if (change[field] !== null && typeof change[field] === 'object' && 
                                //                                                     change[field][Object.keys(change[field])[1]] > transaction.changes[field][Object.keys(transaction.changes[field])[1]]) {
                                //                                                     transaction[field] = change[field];
                                //                                                     transaction.changes[field] = change[field][Object.keys(change[field])[1]];
                                //                                                 }
                                //                                             } else {
                                //                                                 if (change[field] !== null && typeof change[field] === 'object') {
                                //                                                     transaction[field] = change[field];
                                //                                                     transaction.changes[field] = change[field][Object.keys(change[field])[1]];
                                //                                                 }
                                //                                             }
                                //                                     }







                                            //                     }
                                            //                 }
                                            //             }
                                            //             let transaction = {}
                                            //             if (!transactionExists) {
                                            //                 for (let field in change) {
                                            //                     if (field != 'file' && 
                                            //                         field != 'action' && 
                                            //                         field != 'id' && 
                                            //                         field != 'time' && 
                                            //                         field != 'what') {
                                            //                             if (change[field] !== null && typeof change[field] === 'object') {
                                            //                                 transaction[field] = change[field][Object.keys(change[field])[0]];
                                            //                             } else {
                                            //                                 transaction[field] = change[field];
                                            //                             }
                                            //                     }
                                            //                 }
                                            //                 oldFile.transactions.push(transaction);
                                            //             }
                                            //         }
                                            //     }
                                            // }
                                            // sessionStorage.removeItem('changes');
                                            // if (oldFile.lastId.accounts < self.fileData.lastId.accounts) {
                                            //     oldFile.lastId.accounts = self.fileData.lastId.accounts;
                                            // }
                                            // if (oldFile.lastId.transactions < self.fileData.lastId.transactions) {
                                            //     oldFile.lastId.transactions = self.fileData.lastId.transactions;
                                            // }
                                            // uploadFile(oldFile, access_token);
                                    //     });
                                    //     reader.readAsText(data.fileBlob);
                                    // })
                                    // .catch(function(error) {
                                    //     console.error(error);
                                    // });
                            } else {
                                self.$vlf.getItem('file_path')
                                    .then(function(file_path) {
                                        self.$vlf.getItem('file')
                                            .then(function(file) {
                                                let fileToUpload = new Blob([JSON.stringify(file)], {type: 'JSON'});
                                                let Dropbox = require('dropbox').Dropbox;
                                                let dbx = new Dropbox({ accessToken: access_token });
                                                dbx.filesUpload({
                                                        path: file_path,
                                                        contents: fileToUpload,
                                                        mode: 'overwrite',
                                                        autorename: true,
                                                        mute: true
                                                    })
                                                    .then(function(response) {
                                                        self.$vlf.removeItem('changes')
                                                            .then(function() {
                                                                self.showNotification('', 'check', true);
                                                            });
                                                    })
                                                    .catch(function(error) {
                                                        console.error(error);
                                                    });
                                            });
                                    });
                                // self.$vlf.getItem('file_path')
                                //     .then(function(file_path) {
                                //         let Dropbox = require('dropbox').Dropbox;
                                //         let dbx = new Dropbox({ accessToken: access_token });
                                //         dbx.filesDownload({path: file_path})
                                //             .then(function(data) {
                                //                 var reader = new FileReader();
                                //                 reader.addEventListener("loadend", function() {
                                //                     function uploadFile(oldFile, access_token) {
                                //                         let Dropbox = require('dropbox').Dropbox;
                                //                         let dbx = new Dropbox({ accessToken: access_token });
                                //                         let file = new Blob([JSON.stringify(oldFile)], {type: 'JSON'});
                                //                         dbx.filesUpload({
                                //                                 path: self.generalUserData.selectedFilePath,
                                //                                 contents: file,
                                //                                 mode: 'overwrite',
                                //                                 autorename: true,
                                //                                 mute: true
                                //                             })
                                //                             .then(function(response) {
                                //                                 // self.showNotification('Uploaded', 'check', true);
                                //                             })
                                //                             .catch(function(error) {
                                //                                 console.error(error);
                                //                             });
                                //                     }
                                //                     let oldFile = JSON.parse(JSON.parse(JSON.stringify(reader.result)));
                                //                     self.$vlf.getItem('changes')
                                //                         .then(function(changes) {
                                //                             changes == null ? changes = [] : null;
                                //                             for (let change of changes) {
                                //                                 if (change.what == 'account') {
                                //                                     if (change.action == 'add') {
                                //                                         oldFile.accounts.push({
                                //                                             id: change.id,
                                //                                             title: change.title,
                                //                                             total: null
                                //                                         });
                                //                                     } else if (change.action == 'delete') {
                                //                                         for (let i=0; i<oldFile.accounts.length; i++) {
                                //                                             if (oldFile.accounts[i].id == change.id) {
                                //                                                 oldFile.accounts.splice(i, 1);
                                //                                                 break;
                                //                                             }
                                //                                         }
                                //                                     } else {
                                //                                         let accountExists = false;
                                //                                         for (let account of oldFile.accounts) {
                                //                                             if (account.id == change.id) {
                                //                                                 if (account.changes == null) {
                                //                                                     account.title = change.title.value;
                                //                                                     account.changes = {
                                //                                                         "title": change.title.time
                                //                                                     }
                                //                                                 } else {
                                //                                                     if (change.title.time > account.changes.title) {
                                //                                                         account.title = change.title.value;
                                //                                                         account.changes = {
                                //                                                             "title": change.title.time
                                //                                                         }
                                //                                                     }
                                //                                                 }
                                //                                                 accountExists = true;
                                //                                             }
                                //                                         }
                                //                                         if (!accountExists) {
                                //                                             oldFile.accounts.push({
                                //                                                 id: change.id,
                                //                                                 title: change.title,
                                //                                                 total: null
                                //                                             });
                                //                                         }
                                //                                     }
                                //                                 }
                                //                             }
                                //                             self.$vlf.removeItem('changes')
                                //                                 .then(function() {
                                //                                     if (oldFile.lastId.accounts < self.fileData.lastId.accounts) {
                                //                                         oldFile.lastId.accounts = self.fileData.lastId.accounts;
                                //                                     }
                                //                                     uploadFile(oldFile, access_token);
                                //                                 });
                                //                         });
                                //                 });
                                //                 reader.readAsText(data.fileBlob);
                                //             })
                                //             .catch(function(error) {
                                //                 console.error(error);
                                //             });
                                //     });
                            }
                        });
                });
                xhttp.send(null);
            },

        //
        // NEW / EDIT TRANSACTION
        //
            manageAccountsWindowOpen: function() {
                document.getElementsByTagName('body')[0].classList.add('full-content-window-visible');
                this.manageAccountsIsVisible = true;
            },
            manageAccountsWindowClose: function() {
                document.getElementsByTagName('body')[0].classList.remove('full-content-window-visible');
                this.manageAccountsIsVisible = false;
            },




            showNotification: function(msg, icon, timeout) {
                this.notificationMsg = msg;
                this.notificationIcon = icon;
                this.notificationIsVisible = true;
                if (timeout) {
                    let self = this;
                    setTimeout(function(){
                        self.notificationIsVisible = false;
                    }, 1000);

                }
            },

            initApp: function() {
                let self = this;
                this.$vlf.getItem('access_token')
                    .then(function(access_token) {
                        if (access_token == null) {
                            let homescreen = sessionStorage.getItem('homescreen');
                            if (homescreen == null) {
                                self.pageShown = 0;
                                sessionStorage.setItem('homescreen', 0);
                            } else {
                                self.pageShown = homescreen;
                            }
                        } else {
                            self.$vlf.getItem('homescreen')
                                .then(function(homescreen) {
                                    if (homescreen == null) {
                                        self.pageShown = 0;
                                        self.$vlf.setItem('homescreen', 0);
                                    } else {
                                        self.pageShown = homescreen;
                                    }
                                });
                        }
                    });
                this.getSelectedDateTransactions();
            }
    },
    computed: {

    },
    created: function() {

    },
    mounted: function() {

    }
}
</script>

<style lang="scss">
*,
*::after,
*::before {
    box-sizing: border-box;
}
html {
    min-height: 100%;
    background: #E3E3E3;
    background: linear-gradient(#ECECEC, #F3F3F3);
}
body {
    &.full-content-window-visible {
        overflow: hidden;
        #change-month,
        #new-edit-transaction {
            overflow-y: scroll;
        }
    }
}

#app {
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 1em;

}

ion-icon {
    display: inline-block;
}
</style>
