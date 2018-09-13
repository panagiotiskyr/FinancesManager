<template>
    <div id="transactions">
        <div class="row top-xs">
            <div class="col-xs-12 col-sm-6">
                <div id="transactions-income">
                    <div>
                        <span class="jam jam-log-in"></span>
                        <span>In</span>
                    </div>
                    <ul class="transactions-top-row">
                        <li v-for="col in tablesColumnTitles">{{ col }}</li>
                    </ul>
                    <ul class="transactions-content">
                        <li v-for="transaction in setTransactionsByType.income" 
                            @contextmenu.prevent="contextMenu(transaction, $event, 0)" 
                            @click="transactionClick($event)">
                            <ul>
                                <li>{{ transaction.title }}</li>
                                <li>{{ transaction.day }}</li>
                                <li>{{ transaction.amount }}</li>
                            </ul>
                             <div class="description">
                                {{ transaction.description }}
                            </div>
                       </li>
                    </ul>
                </div>
            </div>
            <div class="col-xs-12 col-sm-6">
                <div id="transactions-expenses">
                    <div>
                        <span class="jam jam-log-out"></span>
                        <span>Out</span>
                    </div>
                    <ul class="transactions-top-row">
                        <li v-for="col in tablesColumnTitles">{{ col }}</li>
                    </ul>
                    <ul class="transactions-content">
                        <li v-for="transaction in setTransactionsByType.expenses" 
                            @contextmenu.prevent="contextMenu(transaction, $event, 1)" 
                            @click="transactionClick($event)">
                            <ul>
                                <li>{{ transaction.title }}</li>
                                <li>{{ transaction.day }}</li>
                                <li>{{ transaction.amount }}</li>
                            </ul>
                            <div class="description">
                                {{ transaction.description }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Transactions',
    props: [
        'tablesColumnTitles',
        'selectedAccounts',
        'transactions'
    ],
    data: function() {
        return {
            transactionsByType: {
                income: [],
                expenses: []
            }
        }
    },
    methods: {
        contextMenu: function(transaction, event) {
            this.$emit('contextMenu', transaction, event);
        },
        transactionClick: function(event) {
            let target;
            event.target.nodeName == 'LI' ? target = event.target.parentNode.parentNode : target = event.target.parentNode;
            target.classList.contains('visible') ? target.classList.remove('visible') : target.classList.add('visible');
        }
    },
    computed: {
        setTransactionsByType: function() {
            let income = [];
            let expenses = [];
            if (this.selectedAccounts.length > 0) {
                for(let transaction of this.transactions) {
                    for (let selectedAccount of this.selectedAccounts) {
                        if (transaction.account == selectedAccount) {
                            if (transaction.type == 0) {
                                income.push(transaction);
                            } else if (transaction.type == 1) {
                                expenses.push(transaction);
                            } else {
                                expenses.push(transaction);
                            }
                        } else if (transaction.to == selectedAccount) {
                            income.push(transaction);
                        }
                    }
                }
            } else {
                for(let transaction of this.transactions) {
                    if (transaction.type == 0) {
                        income.push(transaction);
                    } else if (transaction.type == 1) {
                        expenses.push(transaction);
                    }
                }
            }
            return {
                'income': income,
                'expenses': expenses
            }
        }
    },
    created: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
%no-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

%table-row {
    display: flex;
    flex-wrap: nowrap;
    padding: 0.5em;
    > li {
        display: inline-block;
        margin: auto;
        width: 25%;
        color: #8A8A8A;
        cursor: default;
    }
    > li:first-child {
        width: 50%;
    }
}

#transactions .row {
    > div {
        &:first-child {
            margin-bottom: 1rem;
        }
        @media only screen and (min-width: 48em) {
            padding-left: 0.3rem;
            padding-right: 0.3rem;
            &:first-child {
                margin-bottom: 0;
            }
        }
        > div > div {
            padding: 1em;
            .jam {
                margin-right: 0.5rem;
                color: #0769E4;
                font-size: 1.3em;
            }
            span {
                display: inline-block;
            }
            .jam,
            span {
                vertical-align: middle;
            }
        }
    }
}

#transactions-income,
#transactions-expenses {
    background-color: #FFF;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.05);
    padding: 0;
}

.transactions-top-row {
    @extend %no-list;
    @extend %table-row;
    text-align: center;
    background-color: #F6F6F6;
}

.transactions-content {
    @extend %no-list;
    text-align: center;
    > li {
        background-color: #fff;
        ul {
            @extend %no-list;
            @extend %table-row;
            > li {
                color: #000;
            }
        }
        .description {
            text-align: left;
            border: 0 none;
            background-color: #EDEDED;
            height: 0;
            padding: 0 1rem;
            overflow: hidden;
            transition: padding 0.2s ease-in-out;
        }
        &:hover:not(.visible) {
            background-color: #EDEDED;
        }
        &.visible {
            .description {
                padding: 0.5rem 1rem;
                border: 1px solid #d3d3d3;
                height: auto;
                overflow: visible;
            }
        }
        &:last-child,
        &:last-child .description,
        &:last-child ul {
            border-radius: 0 0 0.5rem 0.5rem;
        }
    }
}

.transactions-top-row,
.transactions-content > li {
    border-bottom: 1px solid #d3d3d3;
}
</style>
