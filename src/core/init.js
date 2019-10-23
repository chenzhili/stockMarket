import { isObject, isString, isFunction } from "../utils/types"
import { initTimeSharingDiagram, paintTimeSharingDiagram } from "./timeSharingDiagram"
import { initkLineGraph, kLineGraphPaint } from "./kLineGraph"
import { browserRedirect } from "../utils/index"
import {calcConfig} from "../enums/calcEnum"
// import initEvent from "../events"
import { insType, Theme } from "../enums"

export default function initCanvas(QLStockMarket) {
    QLStockMarket.prototype.init = function (options) {
        const QL = this;
        console.log(1111);
        if (!isObject(options)) return "数据格式不对";

        const { selector, data, config, emit } = options;

        if (isObject(emit) && isFunction(emit.getUpToDataData)) {
            QLStockMarket.prototype.getUpToDataData = emit.getUpToDataData;
        }

        if (isObject(emit) && isFunction(emit.getChangeData)) {
            QLStockMarket.prototype.getChangeData = emit.getChangeData;
        }

        if (!selector) return "没有入口文件";
        const DOM = document.querySelector(selector);
        if (!DOM) return "入口node未找到";

        const { width, height } = DOM.getBoundingClientRect();
        let { "border-left-width": leftWidth, "border-right-width": rightWidth, "border-top-width": topWidth, "border-bottom-width": bottomWidth, } = getComputedStyle(DOM);

        const device = browserRedirect();

        console.log(DOM, width, height);

        dealTheme(QL, config.theme);

        (function (QL) {
            let tempData = null;
            if (config.insType === insType.timeSharingDiagram) {
                tempData = data.chartData
            }
            if (config.insType === insType.kLineGraph) {
                tempData = data.kData
            }
            // 配置只读属性
            Object.defineProperties(QL, {
                _DOM: {
                    get() {
                        return DOM
                    }
                },
                _DOMWidth: {
                    get() {
                        return width - (parseFloat(leftWidth) + parseFloat(rightWidth))
                    }
                },
                _DOMHeight: {
                    get() {
                        return height - (parseFloat(topWidth) + parseFloat(bottomWidth));
                    }
                },
                _device: {
                    get() {
                        return device
                    }
                },
                _insType: {
                    get() {
                        return config.insType
                    }
                },
                // 这个值 是 可以 被 配置的
                _data: {
                    get() {
                        return tempData
                    },
                    set(newValue) {
                        if (config.insType === insType.timeSharingDiagram) {
                            // console.log(newValue);
                            tempData = newValue;
                            debugger
                            /* 这里 进行重绘 */
                            QL.paintTimeSharingDiagram(tempData);
                        }
                        if (config.insType === insType.kLineGraph) {
                            tempData = newValue;
                            /* 初始化 展示的 数量 的 区间 范围,并存储到 实例中，为了 做 事件的 时候使用 */
                            let startI = tempData.data.length - calcConfig.kLineGraph.initShowN, endI = tempData.data.length;
                            Object.defineProperty(QL, "_kMess", {
                                get() {
                                    return {
                                        startI,
                                        endI,
                                        showNumber: calcConfig.kLineGraph.initShowN
                                    }
                                },
                                configurable: true
                            })

                            /* 这里 进行重绘 */
                            // console.log('====重绘');
                            QL.kLineGraphPaint(tempData);
                        }
                    },
                    configurable: true
                }
            })
        })(QL)


        // 这里要对 不同的实例 做 不同的 初始化
        if (config.insType === insType.timeSharingDiagram) {
            initTimeSharingDiagram(QL, data.chartData);
        }
        if (config.insType === insType.kLineGraph) {
            initkLineGraph(QL, data.kData)
        }


        // // 初始化 所有监听事件，在 内部 进行 区分 客户端
        QL.eventInit();
    }

    // 初始化 时分秒 方法 需要 暴露出去
    QLStockMarket.prototype.paintTimeSharingDiagram = paintTimeSharingDiagram;

    // 绘制 k线 图
    QLStockMarket.prototype.kLineGraphPaint = kLineGraphPaint;
}

/* 处理 主题，这里可能 对应的 值 不存在，在内部 初始化的时候需要 设置 默认值 */
function dealTheme(QL, theme) {
    let defaultTheme = "light", paintTheme = null;
    if (isString(theme)) {
        defaultTheme = Theme[theme] ? theme : "light";
        paintTheme = Theme[defaultTheme];
    }

    if (isObject(theme)) {
        paintTheme = theme;
    }
    console.log(paintTheme);
    Object.defineProperty(QL, "_theme", {
        get() {
            return paintTheme
        }
    })
}