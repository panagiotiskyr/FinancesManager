<template>
    <div id="new-edit-transaction">
        <div id="new-edit-transaction-content">
            <div id="new-edit-transaction-header">
                <span>{{ getWindowTitle }} Transaction</span>
            </div>
            <form action="" @submit.prevent="add">
                <div id="new-edit-transaction-amount">
                    <label for="new-edit-transaction-amount-input">Amount</label>
                    <input type="number" name="amount" id="new-edit-transaction-amount-input" size="10" v-model="windowTransactionData.amount" placeholder="0">
                </div>
                <div id="new-edit-transaction-date">
                    <div id="new-edit-transaction-date-day">
                        <div class="select">
                            <select name="day" id="new-edit-transaction-month-select">
                                <option v-for="i in 31" :value="i" :selected="windowTransactionData.day == i">{{ i }}</option>
                            </select>
                        </div>
                    </div>
                    <div id="new-edit-transaction-date-month">
                        <div class="select">
                            <select name="month" id="new-edit-transaction-month-select">
                                <option v-for="i in 12" :value="i" :selected="windowTransactionData.month == i">{{ i }}</option>
                            </select>
                        </div>                        
                    </div>
                    <div id="new-edit-transaction-date-year">
                        <input type="number" name="year" id="new-edit-transaction-date-year-input" size="10" v-model="windowTransactionData.year">
                    </div>
                </div>
                <div id="new-edit-transaction-title">
                    <label for="new-edit-transaction-title-input">Title</label>
                    <input type="text" name="title" value="" id="new-edit-transaction-title-input" size="10" v-model="windowTransactionData.title">
                </div>
                <div id="new-edit-transaction-description">
                    <span class="jam jam-chevron-down"></span>
                    <label for="new-edit-transaction-description-input" @click="toggleDescription">Description</label>
                    <textarea type="text" name="description" value="" id="new-edit-transaction-description-input" size="10" v-model="windowTransactionData.description"></textarea>
                </div>
                <div id="new-edit-transaction-account">
                    <label for="new-edit-transaction-account">From</label>
                    <div class="select">
                        <select name="account" id="new-edit-transaction-account-select" v-model="windowTransactionData.account">
                            <option v-for="account in accounts" :value="account.title">{{ account.title }}</option>
                        </select>
                    </div>                        
                </div>
                <div id="new-edit-transaction-to" v-if="windowTransactionData.type == 2">
                    <label for="new-edit-transaction-to">To</label>
                    <div class="select">
                        <select name="to" id="new-edit-transaction-to-select" v-model="windowTransactionData.to">
                            <option v-for="account in accounts" :value="account.title">{{ account.title }}</option>
                        </select>
                    </div>                        
                </div>
                <div id="new-edit-transaction-type">
                    <div id="new-edit-transaction-type-income"
                        @click="toggleType($event)">
                        <span>Income</span>
                    </div>
                    <div id="new-edit-transaction-type-expense"
                        @click="toggleType($event)">
                        <span>Expense</span>
                    </div>
                    <div id="new-edit-transaction-type-transfer"
                        @click="toggleType($event)">
                        <span>Transfer</span>
                    </div>
                </div>
                <div id="new-edit-transaction-options">
                    <div id="new-edit-transaction-add">
                        <button type="submit">{{ getWindowButtonTitle }}</button>
                    </div>
                    <div id="new-edit-transaction-cancel"
                        @click="cancel">
                        <button type="reset">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewEditTransaction',
    props: [
        'editTransactionData',
        'accounts'
    ],
    data: function() {
        return {
            windowTransactionData: {
                amount: '',
                day: null,
                month: null,
                year: null,
                title: '',
                description: '',
                account: null,
                to: null,
                type: 1,
                id: -1
            }
        }
    },
    methods: {
        getToday: function() {
            let d = new Date();
            this.windowTransactionData.day = d.getDate();
            this.windowTransactionData.month = d.getMonth() + 1;
            this.windowTransactionData.year = d.getFullYear();
        },
        add: function() {
            for (let i=0; i<this.accounts.length; i++) {
                if (this.accounts[i].title == this.windowTransactionData.account) {
                    this.windowTransactionData.account = this.accounts[i].id;
                } else if (this.accounts[i].title == this.windowTransactionData.to) {
                    this.windowTransactionData.to = this.accounts[i].id;
                }
            }
            if (this.editTransactionData == null) {
                this.windowTransactionData.type != 2 ? this.windowTransactionData.to = null : null;
                this.$emit('addTransaction', this.windowTransactionData);
            } else {
                this.$emit('updateTransaction', this.windowTransactionData);
            }
            this.$emit('newEditTransactionWindowClose');
        },
        cancel: function() {
            this.$emit('newEditTransactionWindowClose');
        },
        toggleDescription: function() {
            let titleInput = document.querySelector('#new-edit-transaction-title-input');
            let description = document.querySelector('#new-edit-transaction-description');
            if (description.classList.contains('visible')) {
                let descriptionTextarea = document.querySelector('#new-edit-transaction-description textarea');
                descriptionTextarea.style.height = '';
                descriptionTextarea.style.marginBottom = '';
                description.classList.remove('visible');
                titleInput.focus();
            } else {
                description.classList.add('visible');
            }
        },
        toggleType: function(e) {
            let target;
            let buttons = document.querySelectorAll('#new-edit-transaction-type > div');
            e.target.nodeName == 'SPAN' ? target = e.target.parentElement : target = e.target;
            let type = target.textContent;
            for (let button of buttons) {
                button.classList.contains('selected') ? button.classList.remove('selected') : null;
            }
            switch (type) {
                case 'Income':
                    this.windowTransactionData.type = 0;
                    break;
                case 'Expense':
                    this.windowTransactionData.type = 1;
                    break;
                case 'Transfer':
                    this.windowTransactionData.type = 2;
                    break;
            }
            let accountsSelect = document.querySelectorAll('#new-edit-transaction-account-select > option');
            let i = -1;
            for (let account of this.accounts) {
                i++;
                if (account.name == this.windowTransactionData.account) break;
            }
            accountsSelect[i].selected = true;
            target.classList.add('selected');
        },
    },
    computed: {
        getWindowTitle: function() {
            let title;
            this.editTransactionData == null ? title = 'Add' : title = 'Edit';
            return title;
        },
        getWindowButtonTitle: function() {
            let title;
            this.editTransactionData == null ? title = 'Add' : title = 'Update';
            return title;
        }
    },
    created: function() {
        if (this.editTransactionData == null) {
            this.getToday();
        } else {
            for (var variable in this.editTransactionData) {
                if (this.editTransactionData.hasOwnProperty(variable)) {
                    this.windowTransactionData[variable] = this.editTransactionData[variable];
                }
            }
            for (let i=0; i<this.accounts.length; i++) {
                if (this.accounts[i].id == this.windowTransactionData.account) {
                    this.windowTransactionData.account = this.accounts[i].title;
                }
            }
        }
    },
    mounted: function() {
        let amountInput = document.querySelector('#new-edit-transaction-amount-input');
        amountInput.focus();
        if (this.windowTransactionData.to == null) {
            let buttons = document.querySelectorAll('#new-edit-transaction-type > div');
            buttons[this.windowTransactionData.type].classList.add('selected');
            this.windowTransactionData.account = this.accounts[0].title;
            this.windowTransactionData.to = this.accounts[0].title;
        }
    },
    updated: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
.select {
    position: relative;
    margin: auto;
}
select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';
    background: transparent;
    border: 0 none;
    padding: 0.5rem;
    width: 100%;
    font-size: 0.9rem;
}
#new-edit-transaction {
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.25);
    width: 100%;
    height: 100%;
}
#new-edit-transaction-content {
    position: relative;
    margin: 3rem auto;
    background-color: #FFF;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    max-width: 26rem;
    > div,
    form > div:not(:last-child) {
        border-bottom: 1px solid #DADADA;
    }
    form > div:not(:first-child):not(:last-child) {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
#new-edit-transaction-header {
    background-color: #F0F0F0;
    font-size: 0.9em;
    font-weight: lighter;
    padding: 0.4em 1em;
    text-align: center;
    border-radius: 0.5rem 0.5rem 0 0;
    cursor: default;
}
#new-edit-transaction-amount {
    background-color: #FBFBFB;
    padding: 0 1rem;
    input {
        text-align: center;
        background-color: #FBFBFB;
        cursor: default;
        display: block;
        border: 0 none;
        border-radius: 0.5rem;
        padding: 0.3rem;
        margin-top: 0.5rem;
        margin-bottom: 1.2rem;
        font-size: 3rem;
        min-width: 100%;
        max-width: 100%;
    }
    label {
        display: block;
        text-align: left;
        font-size: 0.9rem;
        font-size: 0.8rem;
        color: #929292;
        padding-top: 1.2rem;
    }
}
#new-edit-transaction-date {
    display: flex;
    background-color: #F3F3F3;
    padding: 0.3rem 0;
    > div {
        margin: auto;
        width: calc(100%/3);
    }
    input {
        background-color: #F3F3F3;
        cursor: default;
        display: block;
        border: 0 none;
        text-align: center;
        font-size: 0.9rem;
        width: 70%;
        margin: auto;
        padding: 0.5rem;
    }
    .select {
        width: 70%;
        select {
            padding-left: calc(50% - 0.25rem);    
        }
        &::after {
            content: "/";
            position: absolute;
            top: 50%;
            right: -25%;
            transform: translateY(-50%);
        }
    }
}
#new-edit-transaction-title,
#new-edit-transaction-description,
#new-edit-transaction-account,
#new-edit-transaction-to {
    background-color: #F8F8F8;
    label {
        display: block;
        text-align: left;
        font-size: 0.9em;
        font-size: 0.8rem;
        color: #929292;
        padding-top: 1.2rem;
    }
    input,
    textarea,
    select {
        background-color: #fff;
        cursor: default;
        display: block;
        border: 1px solid #DADADA;
        border-radius: 0.5rem;
        padding: 0.3em;
        margin-top: 0.5em;
        margin-bottom: 1.2em;
        font-size: 1em;
        min-width: 100%;
        max-width: 100%;
    }
    input {
        text-align: center;
    }
    textarea {
        text-align: left;
    }
}
#new-edit-transaction-description {
    position: relative;
    .jam {
        color: #929292;
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        transform: rotate(0deg);
        transition: all 0.2s ease-in-out;
    }
    label {
        padding-top: 0.5rem;
        transition: all 0.2s ease-in-out;
    }
    textarea {
        padding: 0;
        margin-bottom: 0;
        height: 0;
        overflow: hidden;
        border: 0 none;
        transition: all 0.2s ease-in-out;
    }
    &.visible {
        .jam {
            top: 1.2rem;
            transform: rotate(-180deg);
        }
        label {
            padding-top: 1.2rem;
        }
        textarea {
            padding: 0.3em;
            margin-bottom: 1.2em;
            height: auto;
            overflow: visible;
            border: 1px solid #DADADA;
        }
    }
}
#new-edit-transaction-account,
#new-edit-transaction-to {
    .select {
        select {
            padding-left: calc(50% - 2rem);    
        }
    }
}
#new-edit-transaction-type {
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
#new-edit-transaction-options {
    position: relative;
    > div {
        margin: auto;
        display: inline-block;
        width: 50%;
        text-align: center;
        button {
            display: block;
            padding: 1rem;
            cursor: pointer;
            border: 0 none;
            width: 100%;
            height: 100%;
        }
    }
}
#new-edit-transaction-cancel button {
    border-radius: 0 0 0.5rem 0;
}
#new-edit-transaction-add button {
    background-color: #0769E4;
    color: #fff;
    border-radius: 0 0 0 0.5rem;
    border-right: 1px solid #d3d3d3;
}
</style>
