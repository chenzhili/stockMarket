
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
    this.init(options);
}
initCanvas(QLStockMarket);
initEvent(QLStockMarket);


export default QLStockMarket;


