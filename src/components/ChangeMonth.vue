<template>
    <div id="change-month">
        <div id="change-month-content">
            <div id="change-month-header">
                <span>Change Month</span>
            </div>
            <div id="change-month-years">
                <span class="jam jam-chevron-left" v-on:click="yearsDown"></span>
                <ul>
                    <li v-for="i in 5" v-on:click="saveSelectedYear(yearsStart + i)">{{ yearsStart + i }}</li>
                </ul>
                <span class="jam jam-chevron-right" v-on:click="yearsUp"></span>
            </div>
            <div id="change-month-months">
                <ul>
                    <li v-for="month in monthNames" v-on:click="saveSelectedMonth(month)">{{ month }}</li>
                </ul>
            </div>
            <div id="change-month-controls">
                <div id="change-month-ok" v-on:click="ok">
                    <span>OK</span>
                </div>
                <div id="change-month-cancel" v-on:click="cancel">
                    <span>Cancel</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChangeMonth',
    props: [
        'monthNames',
        'selectedMonthName',
        'selectedYear'
    ],
    data: function() {
        return {
            yearsStart: null,
            savedMonth: null,
            savedYear: this.selectedYear,
            savedMonthName: this.selectedMonthName
        }
    },
    methods: {
        calculateYearsStart: function() {
            this.yearsStart = this.selectedYear - 3;
        },
        initialSelectedMonth: function() {
            let years = document.querySelectorAll('#change-month-years li');
            let months = document.querySelectorAll('#change-month-months li');
            for (var i = 0; i < years.length; i++) {
                if (years[i].innerText == this.selectedYear) {
                    years[i].classList.add('selected');
                    break;
                }
            }
            for (var i = 0; i < months.length; i++) {
                if (months[i].innerText == this.selectedMonthName) {
                    months[i].classList.add('selected');
                    this.savedMonth = i + 1;
                    break;
                }
            }
        },
        yearsDown: function() {
            this.yearsStart -= 5;
            let years = document.querySelectorAll('#change-month-years li');
            for (let i = 0; i < 5; i++) {
                if (this.yearsStart + i + 1 == this.savedYear) {
                    years[i].classList.add('selected');
                } else {
                    years[i].classList.remove('selected');
                }
            }
        },
        yearsUp: function() {
            this.yearsStart += 5;
            let years = document.querySelectorAll('#change-month-years li');
            for (let i = 0; i < 5; i++) {
                if (this.yearsStart + i + 1 == this.savedYear) {
                    years[i].classList.add('selected');
                } else {
                    years[i].classList.remove('selected');
                }
            }
        },
        saveSelectedYear: function(year) {
            let years = document.querySelectorAll('#change-month-years li');
            for (let i = 0; i < years.length; i++) {
                if (years[i].innerText == this.savedYear) {
                    years[i].classList.remove('selected');
                    break;
                }
            }
            for (let i=0; i<years.length; i++) {
                if (years[i].innerText == year) {
                    years[i].classList.add('selected');
                    this.savedYear = years[i].innerText;
                    break;
                }
            }
        },
        saveSelectedMonth: function(month) {
            let months = document.querySelectorAll('#change-month-months li');
            let i;
            for (i = 0; i < months.length; i++) {
                if (months[i].innerText == this.savedMonthName) {
                    months[i].classList.remove('selected');
                    break;
                }
            }
            for (i=0; i<this.monthNames.length; i++) {
                if (this.monthNames[i] == month) {
                    months[i].classList.add('selected');
                    this.savedMonth = i + 1;
                    this.savedMonthName = month;
                    break;
                }
            }
        },
        ok: function() {
            this.$emit('changeSelectedDate', this.savedMonth, this.savedMonthName, this.savedYear);
        },
        cancel: function() {
            // let months = document.querySelectorAll('#change-month-months li');
            // for (var i = 0; i < months.length; i++) {
            //     if (months[i].innerText == this.selectedMonthName) {
            //         this.savedMonth = i + 1;
            //     }
            // }
            // this.savedYear = this.selectedYear;
            // this.savedMonthName = this.selectedMonthName;
            this.$emit('changeMonthClose');
        }
    },
    created: function() {
        this.calculateYearsStart();
    },
    mounted: function() {
        this.initialSelectedMonth();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
        cursor: pointer;
    }
}
#change-month {
    position: fixed;
    top: 0;
    left: 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.25);
    width: 100%;
    height: 100%;
}
#change-month-content {
    position: relative;
    margin: 3rem auto;
    background-color: #FFF;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.7rem 0 rgba(0, 0, 0, 0.05);
    max-width: 26rem;
    > div:not(:last-child),
    form > div:not(:last-child) {
        border-bottom: 1px solid #DADADA;
    }
    form > div:not(:first-child):not(:last-child) {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
#change-month-header {
    background-color: #F0F0F0;
    font-size: 0.9em;
    font-weight: lighter;
    padding: 0.4em 1em;
    text-align: center;
    border-radius: 0.5rem 0.5rem 0 0;
    cursor: default;
    border-bottom: 1px solid #DADADA;
}
#change-month-years {
    padding: 0;
    position: relative;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #d3d3d3;
    > ul {
        flex-wrap: nowrap;
        padding: 0.5rem 0;
        @media only screen and (min-width: 48em) {
            padding: 0.7rem 0;
        }
        li {
            margin: 0;
            padding: 0.2rem 0.5rem;
            @media only screen and (min-width: 48em) {
                padding: 0.3em 1em;
            }
        }
    }
    .jam {
        padding: 0 0.3rem;
        display: inline-block;
        position: relative;
        cursor: pointer;
        line-height: 2.5rem;
    }
}
#change-month-months {
    padding: 0.6em 1.5em;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 50%;
    background-color: #F6F6F6;
    > ul {
        flex-wrap: wrap;
        li {
            flex-grow: 1;
            flex-basis: 25%;
            padding: 0.5em;
        }
    }
}
#change-month-years,
#change-month-months {
    text-align: center;
    > ul {
        display: flex;
        flex-direction: row;
        justify-content: center;
        li.selected {
            background-color: #FE0058;
            color: #fff;
            font-weight: bold;
            border-radius: 0.5rem;
        }
    }
}
#change-month-controls {
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
            padding: 1em;
            width: 100%;
            height: 100%;
        }
    }
}
#change-month-ok span {
    background-color: #0769E4;
    color: #fff;
    border-radius: 0 0 0 0.5rem;
    border-right: 1px solid #d3d3d3;
}
</style>
