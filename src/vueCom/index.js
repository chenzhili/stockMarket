import Vue from "vue"

import install from "./install"

import App from "./AppTest"




function QLStockMarket(){
    
}
QLStockMarket.install = install;


Vue.use(QLStockMarket);









new Vue({
    el: '#root',
    render: h => h(App)
});