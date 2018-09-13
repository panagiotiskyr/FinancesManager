<template>
    <div id="manage-accounts">
        <div id="manage-accounts-content">
            <div id="manage-accounts-header">
                <span>Accounts</span>
            </div>
            <form action="" @submit.prevent="">
                <div class="wrapper">
                    <ul>
                        <li v-for="account in accounts">
                            <input type="text" v-model="account.title" @keyup="titleChange($event, account)">
                            <span class="jam jam-close" @click="remove(account)"></span>
                            <div class="total">
                                <span>Total:</span>
                                <span>{{ account.total }}</span>
                            </div>
                        </li>
                    </ul>
                    <div id="manage-accounts-add-account" @click="add">
                        <span class="jam jam-plus-circle"></span>
                    </div>
                    <div class="loading" v-if="addLoading">
                        <span class="jam jam-disc"></span>
                    </div>
                </div>
                <div id="manage-accounts-options">
                    <div id="manage-accounts-close" @click="close">
                        <button type="reset">Close</button>
                    </div>
                </div>
                <template v-if="deleteAccountConfirmationIsVisible">
                    <div id="manage-accounts-delete-confirmation">
                        <div id="manage-accounts-delete-confirmation-wrapper">
                            <div id="manage-accounts-delete-confirmation-content">
                                <div id="manage-accounts-delete-confirmation-header">
                                    <span>Confirmation Needed</span>
                                </div>
                                <div>
                                    <div>You have made transactions with this account</div>
                                    <span class="jam jam-triangle-danger"></span>
                                    <span>Delete Account?</span>
                                </div>
                                <div id="manage-accounts-delete-confirmation-options">
                                    <div id="manage-accounts-delete-confirmation-yes" v-on:click="yes">
                                        <span>Yes</span>
                                    </div>
                                    <div id="manage-accounts-delete-confirmation-no" v-on:click="no">
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ManageAccounts',
    props: [
        'data'
    ],
    data: function() {
        return {
            transactions: this.data.transactions,
            accounts: this.data.accounts,
            deleteAccountConfirmationIsVisible: false,
            deleteAccountSelected: null,
            addLoading: false,
            inputKeyTimer: null
        }
    },
    methods: {
        titleChange: function(e, account) {
            let self = this;
            if (this.inputKeyTimer) clearTimeout(this.inputKeyTimer);
            this.inputKeyTimer = setTimeout(function() {
                self.addLoading = true;
                for (let acc of self.data.accounts) {
                    if (acc.id == account.id) acc.title = account.title;
                }
                self.$vlf.getItem('file')
                    .then(function(file) {
                        if (file == null) {
                            file = sessionStorage.getItem('file');
                            file.accounts = self.data.accounts;
                            sessionStorage.setItem('file', file);
                            self.addLoading = false;
                        } else {
                            file = JSON.parse('file');
                            file.accounts = self.data.accounts;
                            self.$vlf.setItem('file', file)
                                .then(function() {
                                    self.addLoading = false;
                                });
                        }
                    });
            }, 1000);
        },
        yes: function() {
            let self = this;
            self.addLoading = true;
            // for (let transaction of this.transactions) {
            //     if (transaction.account == this.deleteAccountSelected.id && transaction.type == 2) {
            //         this.$parent.addTransaction({
            //             account: transaction.to,
            //             amount: parseFloat(transaction.amount),
            //             day: transaction.day,
            //             description: 'Transfer from deleted account. ' + transaction.description,
            //             month: transaction.month,
            //             title: transaction.title,
            //             to: null,
            //             type: 0,
            //             year: transaction.year
            //         });
            //     }
            // }
            for (let i=0; i<this.data.accounts.length; i++) {
                if (this.data.accounts[i].id == this.deleteAccountSelected.id) {
                    this.data.accounts.splice(i, 1);
                }
            }
            this.$vlf.getItem('file')
                .then(function(file) {
                    if (file == null) {
                        file = sessionStorage.getItem('file');
                        file.accounts = self.data.accounts;                    
                        sessionStorage.setItem('file', file);
                        self.addLoading = false;
                        self.deleteAccountConfirmationIsVisible = false;
                        self.deleteAccountSelected = null;
                    } else {
                        file = JSON.parse('file');
                        file.accounts = self.data.accounts;                    
                        self.$vlf.setItem('file', file)
                            .then(function() {
                                self.addLoading = false;
                                self.deleteAccountConfirmationIsVisible = false;
                                self.deleteAccountSelected = null;
                            });
                    }
                });
        },
        no: function() {
            this.deleteAccountSelected = null;
            this.deleteAccountConfirmationIsVisible = false;
        },
        remove: function(account) {
            let accountHasTransactions = false;
            this.deleteAccountSelected = account;
            for (let transaction of this.transactions) {
                if (transaction.account == account.id) {
                    accountHasTransactions = true;
                    break;
                }
            }
            if (accountHasTransactions) {
                this.deleteAccountConfirmationIsVisible = true;
            } else {
                this.yes();
            }
        },
        add: function() {
            let self = this;
            this.addLoading = true;
            this.data.lastId.accounts += 1;
            this.data.accounts.push({
                id: this.data.lastId.accounts,
                title: 'New Account',
                total: 0
            });
            this.$vlf.getItem('file')
                .then(function(file) {
                    if (file == null) {
                        file = sessionStorage.getItem('file');
                        file.accounts = self.data.accounts;                    
                        file.lastId.accounts += 1;                    
                        sessionStorage.setItem('file', file);
                        self.addLoading = false;
                    } else {
                        file = JSON.parse('file');
                        file.accounts = self.data.accounts;                    
                        file.lastId.accounts += 1;                    
                        self.$vlf.setItem('file', file)
                            .then(function() {
                                self.addLoading = false;
                            });
                    }
                });
        },
        close: function() {
            this.$emit('manageAccountsWindowClose');
        }
    },
    created: function() {

    },
    updated: function() {

    }
}
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
input {
    background-color: #fff;
    cursor: default;
    border: 1px solid #DADADA;
    border-radius: 0.5rem;
    padding: 0.3em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-size: 1em;
    width: calc(100% - 1.5rem - 2px);
    text-align: center;
    vertical-align: middle;
}
.wrapper {
    position: relative;
}
.loading {
    background: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: default;
    span {
        position: absolute;
        color: #fff;
        font-size: 2rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
#manage-accounts {
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.25);
    width: 100%;
    height: 100%;
}
#manage-accounts-content {
    position: relative;
    margin: 3em auto;
    background-color: #FFF;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    max-width: 26rem;
    > div,
    div > ul > li {
        border-bottom: 1px solid #DADADA;
    }
    div > ul > li {
        padding: 0.5rem 1rem 0.5rem 1rem;
        .jam {
            display: inline-block;
            margin-left: 0.5rem;
            cursor: pointer;
            border: 1px solid #f00;
            color: #f00;
            border-radius: 0.2rem;
            vertical-align: middle;
        }
        .total {
                span {
                color: #666;
                &:last-child {
                    font-weight: bold;
                    margin-left : 0.2rem;
                }
            }
        }
    }
}
#manage-accounts-header {
    background-color: #F0F0F0;
    font-size: 0.9em;
    font-weight: lighter;
    padding: 0.4em 1em;
    text-align: center;
    border-radius: 0.5rem 0.5rem 0 0;
    cursor: default;
}
#manage-accounts-add-account {
    position: relative;
    text-align: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    span {
        padding: 0.5rem;
        font-size: 1.5rem;
        color: #878787;
    }
}
#manage-accounts-options {
    border-top: 1px solid #DADADA;
    position: relative;
    > div {
        margin: auto;
        display: inline-block;
        width: 100%;
        text-align: center;
        button {
            display: block;
            padding: 1rem;
            cursor: pointer;
            border: 0 none;
            width: 100%;
            height: 100%;
            border-radius: 0 0 0.5rem 0.5rem;
            background-color: #0769E4;
            color: #fff;
        }
    }
}
#manage-accounts-delete-confirmation {
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.75);
    width: 100%;
    height: 100%;
}
#manage-accounts-delete-confirmation-wrapper {
    display: flex;
    position: relative;
    top: -5em;
    width: 100%;
    height: 100%;
}
#manage-accounts-delete-confirmation-content {
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
        text-align: center;
        > div {
            margin-bottom: 1rem;
        }
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
#manage-accounts-delete-confirmation-header {
    background-color: #F0F0F0;
    font-size: 0.9em;
    font-weight: lighter;
    padding: 0.4em 1em;
    text-align: center;
    border-radius: 5px 5px 0 0;
    cursor: default;
    border-bottom: 1px solid #DADADA;
}
#manage-accounts-delete-confirmation-options {
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
#manage-accounts-delete-confirmation-yes span {
    background-color: #0769E4;
    color: #fff;
    border-radius: 0 0 0 5px;
    border-right: 1px solid #d3d3d3;
}
</style>
