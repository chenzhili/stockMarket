import Vue from 'vue'
// import App from "./AppTest"
import App from './AppTestForH5'

import QLStockMarketAll from '../../src/vueCom'

Vue.use(QLStockMarketAll)

// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  render: h => h(App)
})
