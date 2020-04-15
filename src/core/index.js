
import initCanvas from "./init"
import initEvent from "../events"
import initData from "./initData"

/* 视图更新的方法 需要 单独提出来 */
/* 不需要目前 */
// import updateView from './updateView'

/* 
    初始化 需要的 数据量
    options:
        selector:为选择器
        data:数据量
        config:必要的配置信息
            K:{
                insType: insType.kLineGraph,
                theme: "light",
                initShowN // number 当前初始化的 k线的 根数
            }

        emit:接受到的 方法，用于 给 父组件 通信
    
 */
/* 
    注释：
    模块区分：
    1、数据处理层；
        说明：根据源数据处理为 需要的 数据 量；
    2、canvas初时层；
        初始绘制 canvas的信息
    3、事件初始层；
        初始化 canvas 上的 事件系统；

*/
function QLStockMarket(options) {
    const tempData = this.outputData(options);
    console.log(tempData);
    options.data = tempData;
    this.init(options);
}
initCanvas(QLStockMarket);
initEvent(QLStockMarket);
initData(QLStockMarket);

// updateView(QLStockMarket);


export default QLStockMarket;


