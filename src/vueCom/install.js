import { pcOrH5 } from "../enums"


const requireComponent = require.context("./", true, /.vue$/);

export default function install(Vue) {
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
        console.log(rc.split("/"))
        const regExp = /vue$/ig;
        if (regExp.test(rc) && rc.split("/").some(item => ((item === pcOrH5.pc) || item === pcOrH5.h5))) {
            const com = requireComponent(rc).default;
            console.log(com);
            if (com) {
                Vue.component(com.name, com);
            }
        }
    });
}