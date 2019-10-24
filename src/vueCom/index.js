import Vue from "vue"

import install from "./install"

// import App from "./AppTest"
import App from "./AppTestForH5"

console.log(App);



function QLStockMarketAll(){
    
}
QLStockMarketAll.install = install;


Vue.use(QLStockMarketAll);





new Vue({
    el: '#root',
    render: h => h(App)
});