import Vue from "vue"
import App from "./AppTest"
// import App from "./AppTestForH5"

import QLStockMarketAll from "../../src/vueCom"

Vue.use(QLStockMarketAll);

new Vue({
    el: '#root',
    render: h => h(App)
});