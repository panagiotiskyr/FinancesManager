<template>
    <div id="main-content" class="row">
        <transactions class="col-xs-12 col-sm-8"
            @contextMenu="contextMenu"
            :selectedAccounts="selectedAccounts"
            :transactions="transactions"
            :tablesColumnTitles="tablesColumnTitles">
        </transactions>
        <side-menu class="col-xs-12 col-sm-4 first-xs last-sm"
            :accounts="accounts"
            :transactions="transactions"
            @updateSelectedAccounts="updateSelectedAccounts">
        </side-menu>
    </div>
</template>

<script>
import Transactions from './Transactions.vue';
import SideMenu from './SideMenu.vue';

export default {
    name: 'MainContent',
    components: {
        "transactions": Transactions,
        "side-menu": SideMenu
    },
    props: [
        'tablesColumnTitles',
        'transactions',
        'accounts',
        'userData'
    ],
    data: function() {
        return {
            selectedAccounts: [],
            total: 0,
            income: 0,
            expenses: 0
        }
    },
    methods: {
        contextMenu: function(transaction, event) {
            this.$emit('contextMenu', transaction, event);
        },
        updateSelectedAccounts: function(selectedAccounts) {
            this.selectedAccounts = selectedAccounts;
        }
    },
    created: function() {

    },
    updated: function() {

    },
    mounted: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
