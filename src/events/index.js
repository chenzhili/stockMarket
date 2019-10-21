import $ from "jquery";
import _ from "lodash"
import {isFunction} from "../utils/types"

import { pcOrH5 } from "../enums/device"
import { insType } from "../enums"
import { paintLine } from "../utils/paintCom"
import { calcConfig } from "../enums/calcEnum"

export default function initEvent(QLStockMarket) {
    QLStockMarket.prototype.eventInit = function () {
        const QL = this;
        const DOM = QL._DOM, device = QL._device, ins = QL._insType;
        // console.log(QL);
        /* 判断 不同的 客户端 */
        if (device === pcOrH5.pc) {
            /* 判断不同的 实例  */
            // // timeSharingDiagram
            // if (ins === insType.timeSharingDiagram) {
            //     QL.prevX = null;
            //     Object.defineProperty(QL, "_isLeave", {
            //         get() {
            //             return false
            //         },
            //         configurable: true
            //     })
            //     $(DOM).on(`mouseenter.${ins}`, mouseEnter.bind(QL));
            //     /* 监听 事件 是否 移除画布 */
            //     $(QL._DOM).on(`mouseleave.${ins}`, mouseLeave.bind(QL));
            // }
            // // kLineGraph
            // if (ins === insType.kLineGraph) {
            //     QL.prevX = null;
            //     Object.defineProperty(QL, "_isLeave", {
            //         get() {
            //             return false
            //         },
            //         configurable: true
            //     })
            //     $(DOM).on(`mouseenter.${ins}`, mouseEnter.bind(QL));
            //     /* 监听 事件 是否 移除画布 */
            //     $(QL._DOM).on(`mouseleave.${ins}`, mouseLeave.bind(QL));
            // }

            // 最后合并
            QL.prevX = null;
            Object.defineProperty(QL, "_isLeave", {
                get() {
                    return false
                },
                configurable: true
            })
            $(DOM).on(`mouseenter.${ins}`, mouseEnter.bind(QL));
            /* 监听 事件 是否 移除画布 */
            $(QL._DOM).on(`mouseleave.${ins}`, mouseLeave.bind(QL));

        }
    }
    QLStockMarket.prototype.cancelEventListener = function () {
        const QL = this;
        /* if (QL._insType === insType.timeSharingDiagram) {
            $(QL.DOM).off("mouseenter.timeSharingDiagram");
            $(QL.DOM).off("mousemove.timeSharingDiagram");
            $(QL.DOM).off("mouseleave.timeSharingDiagram");
            return;
        }
        if (QL._insType === insType.kLineGraph) {
            $(QL.DOM).off("mouseenter.kLineGraph");
            $(QL.DOM).off("mousemove.kLineGraph");
            $(QL.DOM).off("mouseleave.kLineGraph");
            return;
        } */

        // 最后合并
        $(QL.DOM).off(`mouseenter.${QL._insType}`);
        $(QL.DOM).off(`mousemove.${QL._insType}`);
        $(QL.DOM).off(`mouseleave.${QL._insType}`);
        if (QL._insType === insType.kLineGraph) {
            $(QL._DOM).off(`wheel.${QL._insType}`);

            $(QL._DOM).off(`mousedown.${QL._insType}`);
            $(document).off("mouseup.QL");
            $(QL._DOM).off(`mousemove.${QL._insType}2`);
        }
        return;
    }
}
/* 需要 绑定一系列事件，来取消 绑定，防止 内存溢出 */
function mouseEnter(e) {
    // console.log("enter");
    /* 这里 进行 重新 绑定 move 事件 */
    const QL = this;
    Object.defineProperty(QL, "_isLeave", {
        get() {
            return false
        },
        configurable: true
    })
    $(QL._DOM).on(`mousemove.${QL._insType}`, mouseMove.bind(QL));
    if (QL._insType === insType.kLineGraph) {

        $(QL._DOM).on(`wheel.${QL._insType}`, scalOrSkew.bind(QL));

        $(QL._DOM).on(`mousedown.${QL._insType}`, mouseDown.bind(QL));
    }
}
function mouseLeave(e) {
    // console.log("leave");
    /* 清楚 move 事件 */
    const QL = this;
    if (QL._isLeave) return;
    Object.defineProperty(QL, "_isLeave", {
        get() {
            return true
        },
        configurable: true
    })
    if(isFunction(QL.getUpToDataData)){
        QL.getUpToDataData({});
    }
    QL._maskCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
    $(QL._DOM).off(`mousemove.${QL._insType}`);
    if (QL._insType === insType.kLineGraph) {

        $(QL._DOM).off(`wheel.${QL._insType}`)

        $(QL._DOM).off(`mousedown.${QL._insType}`);
    }

}
/* 绑定的 事件  */
/* pc 画布上的 mousemove 的事件 ,h5 上的 长按 然后 move 事件 */
function mouseMove(e) {
    // console.log("move",this); 
    const QL = this;
    const { layerX: x } = e.originalEvent;

    // 如果 对应的 x 的变动 不在 刷新范围内，就直接退出
    if (Math.abs(QL.prevX - x) <= QL._gapD) {
        return "不需要重绘";
    }

    /* 实际 需要 查找的 数据 */
    const actuallyData = QL._insType === insType.timeSharingDiagram ? QL._data.data : QL._kPaintData;
    // 需要 判定的 实际 坐标系 
    const existObj = actuallyData.find(z => Math.abs(z.actuallyX - x) <= QL._gapD);
    if (existObj) {
        QL._maskCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
        paintLine({
            ctx: QL._maskCtx,
            sx: existObj.actuallyX,
            sy: 0,
            ex: existObj.actuallyX,
            ey: QL._DOMHeight,
            style: {
                setLineDash: [2],
                color:QL._theme.maskLine || "#000"
            }
        });
        paintLine({
            ctx: QL._maskCtx,
            sx: 0,
            sy: existObj.actuallyY,
            ex: QL._DOMWidth,
            ey: existObj.actuallyY,
            style: {
                setLineDash: [2],
                color:QL._theme.maskLine || "#000"
            }
        });
        if(isFunction(QL.getUpToDataData)){
            QL.getUpToDataData(existObj);
        }
        
    }
    QL.prevX = x;
}

/* 对于 k 线图 需要的 缩放 方法 */
function scalOrSkew(e) {
    e.preventDefault();

    const QL = this;

    const { layerX: x } = e.originalEvent;

    // 判定当前缩放
    const delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie

        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

    calSES(QL, calcConfig.kLineGraph.scaleOrSkewN * delta, x);
}
/* 计算  startI,endI,showNumber 的值 */
/* 
ssValue:是带有 符号的 放大缩小倍数
*/
function calSES(QL, ssValue, posX) {
    let { _kMess: { startI, endI, showNumber }, _DOMWidth: width, _data: data } = QL;
    // console.log(startI, endI, showNumber);

    /* 判断边界 这里的边界 算法有问题，现在只是先这样测试；
        边界 应该 是 要 指定 canvas 最多 显示的 条数 showMaxData.length，以及 最小 展示条数 showMinData.length ，在此基础上进行计算
    */
    const borderRight = data.data.length, borderLeft = 0;
    let leftN = Math.ceil(posX / width * ssValue); //带符号
    let rightN = ssValue - leftN;//带符号

    startI -= leftN, endI += rightN;
    if (startI - endI >= 0) {
        return "不能在缩小了"
    }
    /* 判断边界 */
    if (startI >= borderLeft && endI <= borderRight) {
        showNumber += ssValue;
    } else if (startI >= borderLeft) {
        showNumber += (ssValue - Math.abs(endI - borderRight))
        endI = borderRight;
    } else if (endI <= borderRight) {
        showNumber += (ssValue - Math.abs(startI - borderLeft))
        startI = borderLeft;
    } else {
        return "不能在放大了"
    }

    /* 禁止 一屏最多 显示 的 条数 */
    if (Math.min(borderRight, calcConfig.kLineGraph.showMaxData) < showNumber) {
        return "不能在缩小了"
    }

    Object.defineProperty(QL, "_kMess", {
        get() {
            return {
                startI,
                endI,
                showNumber
            }
        },
        configurable: true
    })

    QL._mainCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
    QL._maskCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
    QL.kLineGraphPaint();
}

/* 页面 进行 translate 的 逻辑 */
function mouseDown(e) {
    const QL = this;
    let { layerX: preX } = e.originalEvent;
    const mousemove2 = function mousemove2(e) {
        let { layerX: curX } = e.originalEvent;

        let { _kMess: { startI, endI, showNumber }, _perRectWidth: perRectWidth, _data: data } = QL;

        const n = Math.abs(curX - preX) / perRectWidth,
            delta = curX - preX > 0 ? 1 : -1;

        const borderRight = data.data.length, borderLeft = 0;

        startI -= n * delta, endI -= n * delta;
        if (startI < borderLeft) {
            return "不能左移了"
        }
        if (endI > borderRight) {
            return "不能右移了"
        }

        Object.defineProperty(QL, "_kMess", {
            get() {
                return {
                    startI,
                    endI,
                    showNumber
                }
            },
            configurable: true
        })

        preX = curX;

        QL._mainCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
        QL._maskCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
        QL.kLineGraphPaint();


        // console.log("第二个 mousemove");
    };
    $(QL._DOM).on(`mousemove.${QL._insType}2`, _.debounce(mousemove2.bind(QL)));
    $(document).on("mouseup.QL", function () {
        $(QL._DOM).off(`mousemove.${QL._insType}2`)
    })
}