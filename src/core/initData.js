import { insType, Theme, calcConfig } from "../enums"
import { isObject, isString, isFunction, isArray } from "../utils"
import { uniformDealData, MA, RSI } from "../transformCal"


export default function initData(QLStockMarket) {
    // 产出数据
    QLStockMarket.prototype.outputData = function (options) {
        // console.log(options);
        // 如果 数据格式 不满足条件
        if (!isObject(options)) { return {}; }

        const QL = this;
        const { data, config } = options;


        // 走势图
        if (config.insType === insType.timeSharingDiagram) {
            return { chartData: data.chartData };
        }

        // k线图
        if (config.insType === insType.kLineGraph) {
            // 测试 es6的import 的数据是 共享还是 只是值 ,获取到的 结果是可以 对于 修改的值 进行共享；
            // 初始化外部的配置项
            calcConfig.kLineGraph = config;
            // console.log(calcConfig.kLineGraph, config);

            

            // MA均线配置
            Object.defineProperties(QL, {
                _MAConfig: {
                    get() {
                        return calcConfig.kLineGraph.MAConfig
                    },
                    configurable: true
                },
            });

            /* 配置需要绘制的指标线 */
            const RSIConfig = {
                [RSI.MA]: {
                    type: RSI.MA,
                    key: calcConfig.kLineGraph.MAkey,
                    MaN: calcConfig.kLineGraph.MAConfig
                }
            }
            // 计算 均线MA
            return { kData: { data: uniformDealData(data.kData.data, RSIConfig[RSI.MA]) } };
        }

        return {};

    }
}