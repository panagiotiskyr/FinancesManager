import Vue from 'vue'
import App from './App.vue'
import Vlf from 'vlf'
import 'jam-icons/css/jam.min.css'
import 'flexboxgrid/css/flexboxgrid.min.css'

Vue.config.productionTip = false

Vue.use(Vlf)

new Vue({
  render: h => h(App)
}).$mount('#app')
