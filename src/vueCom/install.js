import { browserRedirect } from "../utils"
import { pcOrH5 } from "../enums/device"
import QLStockMarket from "../core"

console.log(QLStockMarket);



const requireComponent = require.context("./", true, /.vue$/);

export default function install(Vue) {
    const device = browserRedirect();
    const keyword = device === pcOrH5.pc ? "pc" : "h5";
    const regExp = new RegExp(keyword,"ig");

    /* 不放到全局 */
    /* Vue.mixin({
        beforeCreate () {
          if(!this.QLStockMarket){
              this.QLStockMarket = QLStockMarket;
          }
        },
        destroyed () {
            this.QLStockMarket = null;
        }
      }) */

    requireComponent.keys().forEach(rc => {
        if(regExp.test(rc)){
            const com = requireComponent(rc).default;
            if(com){
                Vue.component(com.name,com);
            }
        }
    });
}