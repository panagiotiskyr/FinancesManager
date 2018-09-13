<template>
    <div id="quick-transaction">
        <div class="row center-xs">
            <div id="top-bar" class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                <div id="change-page" @click="changeHomepage">
                    <span class="jam jam-chevrons-square-right"></span>
                    <span>Main App</span>
                </div>
            </div>
        </div>
        <div class="row center-xs">
            <div id="container" class="col-xs-12 col-sm-6 col-md-5 col-lg-4">
                <template v-if="fileData.accounts.length < 1">
                    <div class="no-accounts">
                        <div>
                            <span class="jam jam-book"></span>
                            <h3>You have no accounts</h3>
                        </div>
                    </div>
                </template>
                <div id="header">
                    <span>Quick Add Transaction</span>
                </div>
                <form action="" @submit.prevent="add">
                    <div id="amount">
                        <input class="input" type="number" placeholder="0" v-model="amount">
                    </div>
                    <div id="account">
                        <label for="account-input">Account</label>
                        <div class="select">
                            <select v-model="selectedAccount">
                                <option v-for="account in fileData.accounts">{{ account.title }}</option>
                            </select>
                        </div>
                    </div>
                    <div id="transaction-type">
                        <div id="transaction-type-income"
                            @click="toggleType($event)">
                            <span>Income</span>
                        </div>
                        <div id="transaction-type-expense"
                            @click="toggleType($event)">
                            <span>Expense</span>
                        </div>
                    </div>
                    <button id="add" type="submit">Add</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QuickTransaction',
    props: [
        'fileData'
    ],
    data: function() {
        return {
            amount: null,
            type: 1,
            selectedAccount: null
        }
    },
    methods: {
        toggleType: function(e) {
            let target;
            let buttons = document.querySelectorAll('#transaction-type > div');
            e.target.nodeName == 'SPAN' ? target = e.target.parentElement : target = e.target;
            let type = target.textContent;
            for (let button of buttons) {
                button.classList.contains('selected') ? button.classList.remove('selected') : null;
            }
            switch (type) {
                case 'Income':
                    this.type = 0;
                    break;
                case 'Expense':
                    this.type = 1;
                    break;
            }
            target.classList.add('selected');
        },
        add: function() {
            if (this.amount != null && this.selectedAccount != null) {
                let self = this;
                this.$vlf.getItem('file')
                    .then(function(file) {
                        let d = new Date();
                        let selectedAccountIndex;
                        for (selectedAccountIndex=0; selectedAccountIndex<self.fileData.accounts.length; selectedAccountIndex++) {
                            if (self.fileData.accounts[selectedAccountIndex].title == self.selectedAccount) {
                                break;
                            }
                        }
                        file.lastId.transactions += 1;
                        file.transactions.push({
                            amount: self.amount,
                            account: selectedAccountIndex,
                            day: d.getDate(),
                            month: d.getMonth() + 1,
                            year: d.getFullYear(),
                            to: null,
                            description: '',
                            title: '-',
                            id: file.lastId.transactions,
                            type: self.type
                        });
                        self.$parent.fileData = file;
                        self.$vlf.setItem('file', file)
                            .then(function() {
                                self.$parent.updateTransactions();
                                self.$parent.uploadFile();
                                self.amount = null;
                                self.type = 1;
                                self.selectedAccount = null;
                                let buttons = document.querySelectorAll('#transaction-type > div');
                                let amountInput = document.querySelector('#amount > input');
                                let options = document.querySelectorAll('#account select > option');
                                amountInput.focus();
                                buttons[self.type].classList.add('selected');
                                for (let i=0; i<self.fileData.accounts.length; i++) {
                                    if (self.fileData.accounts[i].title == options[0].textContent) {
                                        self.selectedAccount = self.fileData.accounts[i].title;
                                        break;
                                    }
                                }
                            });
                    });
            }
        },
        changeHomepage: function() {
            this.$parent.pageShown = 0;
        }
    },
    created: function() {

    },
    mounted: function() {
        let buttons = document.querySelectorAll('#transaction-type > div');
        let amountInput = document.querySelector('#amount > input');
        buttons[this.type].classList.add('selected');
        if (this.fileData.accounts.length > 0) {
            setTimeout(function() {
                let options = document.querySelectorAll('#account select > option');
                amountInput.focus();
                for (let i=0; i<this.fileData.accounts.length; i++) {
                    if (this.fileData.accounts[i].title == options[0].textContent) {
                        this.selectedAccount = this.fileData.accounts[i].title;
                        break;
                    }
                }
            }.bind(this), 500);
        }
    },
    updated: function() {

    }
}
</script>

<style scoped lang="scss">
#quick-transaction {
    min-height: calc(100vh - 2rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    > div {
        @media screen and (max-width: 768px) {
            padding: 1rem;
            &:first-child {
                padding-bottom: 0;
            }
            &:not(:first-child) {
                padding-top: 0;
            }
        }
    }
}
.no-accounts {
    background: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: default;
    border-radius: 0.3rem;
    > div {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
    span,
    h3 {
        color: #fff;
        font-size: 2rem;
        display: inline-block;
        vertical-align: middle;
    }
    span {
        margin-right: 1rem;
    }
}
#top-bar {
    text-align: right;
    margin-bottom: 1rem;
    padding: 0;
}
#change-page {
    cursor: pointer;
    align-self: flex-end;
    font-size: 0.8rem;
    display: inline-block;
    padding: 0.4rem 0.6rem;
    border-radius: 0.2rem;
    border: 1px solid #ccc;
    background-color: #F0F0F0;
    color: #999;
    span.jam {
        margin-right: 0.3rem;
    }
    span {
        vertical-align: middle;
    }
}
#container {
    position: relative;
    padding: 0;
    background-color: #FFF;
    border-radius: 0.3rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    > div,
    form > div {
        border-bottom: 1px solid #DADADA;
    }
}
#header {
    background-color: #F0F0F0;
    font-size: 0.9em;
    font-weight: lighter;
    padding: 0.4em 1em;
    text-align: center;
    border-radius: 0.3rem 0.3rem 0 0;
    cursor: default;
}
#amount {
    > input {
        border: none;
        border-radius: 0;
        text-align: center;
        background-color: #FBFBFB;
        border: 0 none;
        padding: 3rem 1rem;
        font-size: 2rem;
        width: 100%;
    }
}
#account {
    background-color: #F3F3F3;
    padding: 1.5rem 1rem;
    label {
        display: block;
        text-align: center;
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 0.5rem;
    }
    .select {
        display: block;
        select {
            width: 100%;
        }
        &:not(.is-multiple):not(.is-loading)::after {
            right: 2rem;
        }
    }
}
#add {
    cursor: pointer;
    display: block;
    text-align: center;
    background-color: #0769E4;
    color: #fff;
    border: none;
    border-radius: 0 0 0.3rem 0.3rem;
    padding: 1em;
    width: 100%;
    height: 100%;
    font-weight: bold;
}
.input:active, 
.input:focus {
    border: none;
    box-shadow: none;
}
#transaction-type {
    background-color: #F8F8F8;
    display: flex;
    justify-content: center;
    > div {
        background: #fff;
        border-top: 1px solid #dadada;
        border-bottom: 1px solid #dadada;
        padding: 0.3em 1em;
        margin: 1.2em 0;
        cursor: default;
        &:first-child {
            border-radius: 0.5rem 0 0 0.5rem;
            border-left: 1px solid #dadada;
        }
        &:last-child {
            border-right: 1px solid #dadada;
            border-radius: 0 0.5rem 0.5rem 0;
        }
        &.selected {
            background-color: #0769E4;
            color: #fff;
        }
    }
}
</style>
