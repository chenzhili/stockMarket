import $ from "jquery";
import _ from "lodash"
import Hammer from "hammerjs"
import { isFunction } from "../utils/types"

import { pcOrH5 } from "../enums/device"
import { insType } from "../enums"
import { paintLine } from "../utils/paintCom"
import { calcConfig } from "../enums/calcEnum"





export default function initEvent(QLStockMarket) {
    QLStockMarket.prototype.eventInit = function () {
        const QL = this;
        const DOM = QL._DOM, device = QL._device, ins = QL._insType;
        // console.log(QL);
        /* 记录 上一个位置 */
        QL.prevX = null;
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

        if (device === pcOrH5.h5) {
            console.log("=======", "h5");
            const hammer = new Hammer(DOM);

            Object.defineProperty(QL, "_hammer", {
                get() {
                    return hammer
                },
                configurable: true
            })

            hammer.on("press", touchPress.bind(QL));

            if (QL._insType === insType.kLineGraph) {
                hammer.on("panstart", mouseDown.bind(QL));

                hammer.get('pinch').set({ enable: true });
                hammer.on("pinchstart", touchPinch.bind(QL))

                // function test(e) {
                //     // alert(e.scale.toString())
                //     let center = Object.keys(e.center).join("\n").toString();
                //     alert(e.scale + "\n" + e.center.x+"\n"+e.center.y);
                // }
                // hammer.get('pinch').set({ enable: true });
                // hammer.on("pinchstart pinchout pinchin pinchend", function (e) {
                //     if (e.type === "pinchstart") {
                //         /* alert("pinchstart")
                //         alert(Object.keys(e).join("\n").toString()); */
                //     }
                //     if (e.type === "pinchin") {
                //         test(e);
                //     }
                //     if (e.type === "pinchout") {
                //         alert("pinchout")
                //         test(e);
                //     }
                //     if (e.type === "pinchend") {
                //         // alert("pinchend")
                //         // alert(Object.keys(e).toString());
                //     }
                // })
            }
        }
    }
    QLStockMarket.prototype.cancelEventListener = function () {
        const QL = this;
        if (QL._device === pcOrH5.pc) {
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
        if (QL._device === pcOrH5.h5) {
            QL._hammer.off("panstart panmove panend press tap");
        }

    }
}
/* 
    H5
*/
/* 判定当前 是 长按 */
function touchPress(e) {
    const QL = this;
    const hammer = QL._hammer;
    hammer.off("panstart panmove panend");
    mouseMove.call(QL, e);
    const move = function (e) {
        if (e.type === "tap") {
            // console.log("=====","tap");
            QL._maskCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
            if (isFunction(QL.getUpToDataData)) {
                QL.getUpToDataData({});
            }
            hammer.off("tap");
        }
        if (e.type === "panstart") {
            mouseMove.call(QL, e);
            return
        }
        if (e.type === "panmove") {
            mouseMove.call(QL, e);
            return
        }
        if (e.type === "panend") {
            hammer.off("panmove panend");
            hammer.off("panstart", move);
            hammer.on("panstart", mouseDown.bind(QL));
            return
        }
    }
    hammer.on("panstart panmove panend tap", move)
}
/* 判定当前位 pinch 事件 */
function touchPinch() {
    const QL = this;
    QL._hammer.on("pinchout pinchin pinchend", function (e) {
        if (e.type === "pinchout") {
            scalOrSkewForH5.call(QL, e);
        }
        if (e.type === "pinchin") {
            scalOrSkewForH5.call(QL, e);
        }
        if (e.type === "pinchend") {
            QL._hammer.off("pinchout pinchin pinchend");
        }
    })
}

/* 

    PC
*/
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
    if (isFunction(QL.getUpToDataData)) {
        QL.getUpToDataData({});
    }
    QL._maskCtx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);
    $(QL._DOM).off(`mousemove.${QL._insType}`);
    if (QL._insType === insType.kLineGraph) {

        $(QL._DOM).off(`wheel.${QL._insType}`)

        $(QL._DOM).off(`mousedown.${QL._insType}`);
    }

}

/*

    public
*/
/* pc 画布上的 mousemove 的事件 ,h5 上的 长按 然后 move 事件 */
function mouseMove(e) {
    // console.log("move", e);
    const QL = this;
    // 这里 根据 设备端 的不同
    const eventPos = QL._device === pcOrH5.pc ? "originalEvent" : "srcEvent";
    const { layerX: x } = e[eventPos];

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
                color: QL._theme.maskLine || "#000"
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
                color: QL._theme.maskLine || "#000"
            }
        });
        if (isFunction(QL.getUpToDataData)) {
            QL.getUpToDataData(existObj);
        }

    }
    QL.prevX = x;
}

/* 对于 k 线图 需要的 缩放 方法 */
// 这是对于 pc 的
function scalOrSkew(e) {
    e.preventDefault();

    const QL = this;

    const { layerX: x } = e.originalEvent;

    // 判定当前缩放
    const delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? -1 : 1)) ||  // chrome & ie

        (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

    calSES(QL, calcConfig.kLineGraph.scaleOrSkewN * delta, x);
}
// 这是 h5 的 
function scalOrSkewForH5(e) {
    e.preventDefault();
    const QL = this;
    const { scale, center: { x } } = e;
    const ssValue = Math.floor(calcConfig.kLineGraph.scaleOrSkewN * (1 - scale));
    calSES(QL, ssValue, x);
}
/* 计算  startI,endI,showNumber 的值 */
/* 
ssValue:是带有 符号的 放大缩小倍数
*/
function calSES(QL, ssValue, posX) {
    let { _kMess: { startI, endI, showNumber }, _DOMWidth: width, _data: data } = QL;
    // console.log(startI, endI, showNumber);

    /* 
        边界 应该 是 要 指定 canvas 最多 显示的 条数 showMaxData.length，以及 最小 展示条数 showMinData.length ，在此基础上进行计算
    */
    const borderRight = data.data.length, borderLeft = 0;
    let leftN = Math.ceil(posX / width * ssValue); //带符号
    let rightN = ssValue - leftN;//带符号

    startI -= leftN, endI += rightN;
    if (startI >= endI || endI - startI < calcConfig.kLineGraph.showMinData) {
        return "不能在放大了"
    }
    /* 判断边界 */
    if (startI >= borderLeft && endI <= borderRight) {
        // /* 这里面 加一个 判断 放大 的 界限，不能小于 最小展示条数 */
        // if(endI - startI < 10 || showNumber < 10){
        //     console.log(endI,startI);
        //     return "不能在放大了";
        // }
        showNumber += ssValue;
    } else if (startI >= borderLeft) {
        showNumber += (ssValue - Math.abs(endI - borderRight))
        endI = borderRight;
    } else if (endI <= borderRight) {
        showNumber += (ssValue - Math.abs(startI - borderLeft))
        startI = borderLeft;
    } else {
        return "不能在缩小了"
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

    // 这里 根据 设备端 的不同
    const eventPos = QL._device === pcOrH5.pc ? "originalEvent" : "srcEvent";
    let { layerX: preX } = e[eventPos];

    const mousemove2 = function mousemove2(e) {

        const eventPos = QL._device === pcOrH5.pc ? "originalEvent" : "srcEvent";
        const { layerX: curX } = e[eventPos];

        let { _kMess: { startI, endI, showNumber }, _perRectWidth: perRectWidth, _data: data } = QL;

        /* 这的计算可能 还要考虑下 */
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
    if (QL._device === pcOrH5.pc) {
        $(QL._DOM).on(`mousemove.${QL._insType}2`, _.debounce(mousemove2.bind(QL)));
        $(document).on("mouseup.QL", function () {
            $(QL._DOM).off(`mousemove.${QL._insType}2`)
        })
    }

    if (QL._device === pcOrH5.h5) {
        QL._hammer.on("panmove", _.debounce(mousemove2.bind(QL)))
        QL._hammer.on("panend", function () {
            QL._hammer.off("panmove panend");
        })
    }

}
