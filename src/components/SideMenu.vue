<template>
    <div id="side-menu">
        <div id="side-menu-totals">
            <div id="side-menu-total-budget">
                <div>
                    <span class="jam jam-coin"></span>
                    <h3>Total Budget</h3>
                </div>
                <span>{{ calculateTotals.total }}</span>
            </div>
            <div id="side-menu-side-totals">
                <div id="side-menu-total-income">
                    <h3>Total Income</h3>
                    <span>{{ calculateTotals.income }}</span>
                </div>
                <div id="side-menu-total-expenses">
                    <h3>Total Expenses</h3>
                    <span>{{ calculateTotals.expenses }}</span>
                </div>
            </div>
        </div>
        <div id="side-menu-accounts">
            <h3 @click="toggleAccounts"><span>Accounts</span></h3>
            <ul>
                <li v-for="account in accountTotals" @click="accountClick($event, account)">
                    <ul>
                        <li>{{ account.title }}:</li>
                        <li>{{ account.total }}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SideMenu',
    props: [
        'transactions',
        'accounts'
    ],
    data: function() {
        return {
            total: 0,
            income: 0,
            expenses: 0,
            selectedAccounts: [],
            accountTotals: []
        }
    },
    methods: {
        toggleAccounts: function() {
            let accountsList = document.querySelector("#side-menu-accounts > ul");
            if (accountsList.classList.contains('visible')) {
                accountsList.classList.remove('visible');
            } else {
                accountsList.classList.add('visible');
            }
        },
        accountClick: function(e, account) {
            let existed = false;
            let target;
            e.target.nodeName == 'LI' ? target = e.target.parentNode.parentNode : target = e.target.parentNode;
            for (let i=0; i<this.selectedAccounts.length; i++) {
                if (this.selectedAccounts[i] == account.id) {
                    this.selectedAccounts.splice(i, 1);
                    existed = true;
                    target.classList.remove('selected');
                    break;
                }
            }
            if (!existed) {
                target.classList.add('selected');
                this.selectedAccounts.push(account.id);
            }
            this.$emit('updateSelectedAccounts', this.selectedAccounts);
        }
    },
    computed: {
        calculateTotals: function() {
            let self = this;
            let income = 0;
            let expenses = 0;

            let accountAdd = function(accountId, amount) {
                for (let account of self.accountTotals) {
                    if (account.id == accountId) {
                        account.total += parseFloat(amount);
                        break;
                    }
                }
            };
            let accountExtract = function(accountId, amount) {
                for (let account of self.accountTotals) {
                    if (account.id == accountId) {
                        account.total -= parseFloat(amount);
                        break;
                    }
                }
            };

            if (this.selectedAccounts.length > 0) {
                let income = 0;
                let expenses = 0;
                for(let transaction of this.transactions) {
                    for (let selectedAccount of this.selectedAccounts) {
                        if (transaction.account == selectedAccount) {
                            if (transaction.type == 0) {
                                income += parseFloat(transaction.amount);
                            } else if (transaction.type == 1) {
                                expenses += parseFloat(transaction.amount);
                            } else {
                                expenses += parseFloat(transaction.amount);
                                let accountToIsSelected = false;
                                for (let selectedAccountTo of this.selectedAccounts) {
                                    if (transaction.to == selectedAccountTo) {
                                        accountToIsSelected = true;
                                    }
                                }
                                if (accountToIsSelected) {
                                    income -= parseFloat(transaction.amount);
                                    expenses -= parseFloat(transaction.amount);
                                }
                            }
                        } else if (transaction.to == selectedAccount) {
                            income += parseFloat(transaction.amount);
                        }
                    }
                }
                return {
                    'income': income,
                    'expenses': expenses,
                    'total': income - expenses
                }
            } else {
                this.accountTotals = [];
                for (let account of this.accounts) {
                    account['total'] = 0;
                    this.accountTotals.push(account)
                }
                for(let transaction of this.transactions) {
                    if (transaction.type == 0) {
                        accountAdd(transaction.account, transaction.amount)
                        income += parseFloat(transaction.amount);
                    } else if (transaction.type == 1) {
                        accountExtract(transaction.account, transaction.amount)
                        expenses += parseFloat(transaction.amount);
                    } else {
                        accountExtract(transaction.account, transaction.amount)
                        accountAdd(transaction.to, transaction.amount)
                    }
                }
            }
            this.income = income;
            this.expenses = expenses;
            this.total = income - expenses;
            return {
                'income': income,
                'expenses': expenses,
                'total': income - expenses
            }
        }
    },
    created: function() {

    }
}
</script>

<style scoped lang="scss">
#side-menu > div {
    background-color: #FFF;
    border-radius: 0.3rem;
    box-shadow: 0 0 0.7rem 0 rgba(0, 0, 0, 0.05);
    cursor: default;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1rem;
}

h3 {
    line-height: 1;
    margin: 0;
    padding: 0;
    font-size: 0.9rem;
    color: #b4b4b4;
}

#side-menu-total-budget {
    text-align: center;
    border-bottom: 1px solid #d3d3d3;
    padding: 0.8rem;
    @media only screen and (min-width: 48em) {
        padding: 1.2rem;
    }
    h3 {
        display: inline-block;
        color: #000;
    }
    > span {
        display: block;
        font-size: 2.5em;
        margin-top: 0.7rem;
        @media only screen and (min-width: 48em) {
            font-size: 3.5em;
        }
    }
    .jam {
        margin-right: 0.5rem;
        color: #0769E4;
        font-size: 1.3em;
    }
    .jam,
    span {
        vertical-align: middle;
    }
}
#side-menu-side-totals {
    display: flex;
    flex-wrap: nowrap;
    border-bottom: 1px solid #d3d3d3;
    > div {
        padding: 0.6rem;
        @media only screen and (min-width: 48em) {
            padding: 0.8rem;
        }
        flex-grow: 1;
        text-align: center;
        span {
            display: block;
            font-size: 2rem;
            margin-top: 0.7rem;
        }
    }
}
#side-menu-total-income {
    border-right: 1px solid #d3d3d3;
}
#side-menu-accounts {
    > ul {
        padding: 0;
        @media only screen and (min-width: 48em) {
            box-shadow: 0 0 0.7rem 0 rgba(0, 0, 0, 0.05);
        }
    }
    h3 {
        display: block;
        width: 100%;
        font-size: 0.9em;
        padding: 0.5rem 1rem 0.8rem 1rem;
        text-align: center;
        cursor: default;
        color: #000;
        border-radius: 0.3rem 0.3rem 0 0;
        span {
            vertical-align: sub;
        }
        @media only screen and (min-width: 48em) {
            display: none;
        }
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    > ul {
        display: none;
        @media only screen and (min-width: 48em) {
            display: block;
        }
        &.visible {
            @media only screen and (max-width: 48em) {
                display: block;
            }
        }
        > li {
            &.selected {
                background-color: #3581f9;
                ul li {
                    &:first-child {
                        color: #f1f1f1;
                    }
                    &:last-child {
                        color: #fff;
                    }
                }
            }
            &:not(:last-child) {
                border-bottom: 1px solid #dcdcdc;
            }
            &:first-child {
                border-radius: 0;
                @media only screen and (min-width: 48em) {
                    border-radius: 0.3rem 0.3rem 0 0;
                }
            }
            &:last-child {
                border-radius: 0 0 0.3rem 0.3rem;
            }
            ul {
                display: flex;
                align-items: center;
                > li {
                    padding: 0.5rem;
                    &:first-child {
                        width: 50%;
                        text-align: right;
                        color: #9e9e9e;
                    }
                    &:last-child {
                        font-size: 1.3rem;
                    }
                }
            }
        }
    }
}
</style>
