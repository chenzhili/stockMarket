import { timeSharing, prevPrice,kData } from "../enums/dataJSON"
import { insType } from "../enums"

import initCanvas from "./init"
import initEvent from "../events"

/* 
    初始化 需要的 数据量
    options:
        selector:为选择器
        data:数据量
        config:必要的配置信息
        emit:接受到的 方法，用于 给 父组件 通信
    
 */
function QLStockMarket(options) {
    // alert(window.devicePixelRatio)
    this.init(options);
}
initCanvas(QLStockMarket);
initEvent(QLStockMarket);


export default QLStockMarket;


new QLStockMarket({
    selector: ".container1", data: {
        chartData: {
            data: timeSharing,
            preClosePrice: prevPrice
        }
    },
    config: {
        insType: insType.timeSharingDiagram,
        theme:"light"
    }
});
new QLStockMarket({
    selector: ".container2", data: {
        kData: {
            data: kData,
        }
    },
    config: {
        insType: insType.kLineGraph,
        theme:"light"
    }
});