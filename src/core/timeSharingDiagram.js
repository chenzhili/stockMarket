import { paintLine,isObject, isArray,calValuePos } from "../utils"
import { calcConfig, allGraph } from "../enums"


import style from "./index.scss"

// 初始化 分时图
export function initTimeSharingDiagram(QL, data) {
    // 统一 做一个 canvas
    // console.log(2222222, data);
    if (!isObject(data)) return "initTimeSharingDiagram:数据格式不对";
    const canvas = document.createElement("canvas");
    canvas.innerHTML = "不支持canvas";
    canvas.width = QL._DOMWidth * QL._defulatSale, canvas.height = QL._DOMHeight * QL._defulatSale;

    canvas.style.width = `${QL._DOMWidth}px`, canvas.style.height = `${QL._DOMHeight}px`;

    canvas.style.background = QL._theme.bg || "transparent";

    const ctx = canvas.getContext("2d");

    if (!ctx) return "initTimeSharingDiagram:canvas不支持";

    ctx.scale(QL._defulatSale, QL._defulatSale);
    Object.defineProperty(QL, "_mainCtx", {
        get() {
            return ctx;
        }
    });

    /* 主要的 页面 绘制的 组合 */
    QL.paintTimeSharingDiagram(data);

    const maskCanvas = genMaskCav(QL);


    const fragment = document.createDocumentFragment();
    fragment.appendChild(canvas);
    fragment.appendChild(maskCanvas);
    QL._DOM.appendChild(fragment);
}


/* 测算 最大值 和 最小值，并且 实际 绘制 的 上浮和下浮 值 在这里 定义 */
/* 
    获取的 值 包括 curPrice,avPrice
*/
function calRangeValue(targetValue, closePrice) {
    if (!isArray(targetValue) || !targetValue.length) return "calRangeValue：没数据";
    const newTargetArr = targetValue.concat();
    const len = newTargetArr.length;
    // 按照 curPrice 排序
    const temArrByCur = newTargetArr.map(a => a.curPrice).sort((a, b) => a - b);
    // 按照 avPrice 排序
    const tempArrByav = newTargetArr.map(a => a.avPrice).sort((a, b) => a - b);
    let max = null, min = null, dValue = null;
    const curMax = temArrByCur[len - 1],
        curMin = temArrByCur[0],
        avMax = tempArrByav[len - 1],
        avMin = tempArrByav[0];
    //加上 浮动的 值
    max = Math.max(curMax, avMax), min = Math.min(curMin, avMin);

    const dTotal = max - min;
    max += dTotal * calcConfig.upAndDown;
    min -= dTotal * calcConfig.upAndDown;
    dValue = max - closePrice;
    if ((closePrice - dValue) < min) {
        min = closePrice - dValue;
    }
    return { max, min }
}


function dealCalRangeValue(targetValue) {
    if (!isArray(targetValue) || !targetValue.length) return "dealCalRangeValue：没数据";
    const newTargetArr = targetValue.concat();
    const len = newTargetArr.length;

    newTargetArr.sort((a, b) => a.dealMount - b.dealMount);
    let max = null, min = null;
    max = newTargetArr[len - 1].dealMount - 0, min = newTargetArr[0].dealMount;

    /* 上浮 */
    const dTotal = max - min;
    max += dTotal * calcConfig.upAndDown;

    return { max, min }
}

/* 计算 实际 每个图 的 实际 高度 */
function calActuallyHeight(QL, config) {
    const height = QL._DOMHeight;
    const textArea = config.sort.filter(item => item === allGraph.text);
    const heightExpText = height - textArea.length * calcConfig.lineGap;
    let baseHeight = 0;
    return config.sort.reduce((prev, next, index) => {
        const name = prev[next] ? `${next}-${index}` : next,
            regExp = new RegExp(`^${allGraph.text}`, "ig")
        prev[name] = prev[name] || {};
        prev[name].totalHeight = regExp.test(name) ? calcConfig.lineGap : (heightExpText * config[`${next}Height`]);
        prev[name].baseHeight = baseHeight
        baseHeight += prev[name].totalHeight;
        return prev;
    }, {})
}

function genMaskCav(QL) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.innerHTML = "不支持canvas";

    canvas.width = QL._DOMWidth * QL._defulatSale, canvas.height = QL._DOMHeight * QL._defulatSale;
    canvas.style.width = `${QL._DOMWidth}px`, canvas.style.height = `${QL._DOMHeight}px`;

    
    canvas.className = style["mask-cav"];

    ctx.scale(QL._defulatSale,QL._defulatSale);
    /* 把 遮罩层 的 canvas 的 ctx 存储到 实例上,可能这个 canvas 会提取到  外部 让 两个 实例 共用 */
    Object.defineProperty(QL, "_maskCtx", {
        get() {
            return ctx
        },
        configurable: true
    })

    return canvas;

}

/* 计算 对应的 坐标 系数 */
// function calValuePos({ min, max, factorMaxInc, totalHeight, baseHeight, n }) {
//     console.log(totalHeight);
//     const valueIncrement = (max - min) / (n - 1), yPosIncrement = totalHeight / (n - 1);
//     const config = {
//         actuallyValue: [],
//         valueYPos: [],
//     };
//     let f = null;
//     if (factorMaxInc) {
//         f = factorMaxInc / ((n - 1) / 2);
//         config.factorInc = [];
//     }

//     return new Array(n).fill(1).reduce((prev, next, index) => {
//         let tempValue = parseInt((max - index * valueIncrement) * 100) / 100;
//         let tempPos = parseInt((baseHeight + index * yPosIncrement) * 100) / 100;
//         let tempF = f ? parseInt((factorMaxInc - f * index) * 100) / 100 : null;
//         prev.actuallyValue.push(tempValue);
//         prev.valueYPos.push(tempPos);
//         f && prev.factorInc.push(tempF);
//         return prev;
//     }, config);
// }
export function paintTimeSharingDiagram(data) {
    const QL = this;

    data = data || QL._data;

    const { _mainCtx: ctx } = QL;

    ctx.clearRect(0, 0, QL._DOMWidth, QL._DOMHeight);

    const config = calActuallyHeight(QL, calcConfig.timeSharingDiagram);

    const { data: chartData, preClosePrice } = data;

    // 用于外部 绘制 ui 用的信息 
    const paintConfig = {};

    // console.log(chartData, preClosePrice);
    let LMin = null, LMax = null, LYFactor = null,//这是 line图的
        DMin = null, DMax = null, DYFactor = null, // deal 图
        xFactor = QL._DOMWidth / 240; //这里的 240 是指 分成了 4段 ，每段 分为 60min





    // 时分的 line 图
    if (config[allGraph.line]) {
        let lineRange = calRangeValue(chartData, preClosePrice);
        console.log("lineRange", lineRange, preClosePrice);
        LMin = lineRange.min, LMax = lineRange.max;
        LYFactor = config[allGraph.line].totalHeight / (LMax - LMin);

        if (!QL._gapD) {
            Object.defineProperty(QL, "_gapD", {
                get() {
                    return xFactor;
                }
            })
        }


        paintConfig.dealMountPos = config[allGraph.line].totalHeight;

        // 计算 指数 对应 位置的值
        paintConfig.valueRange = calValuePos({ min: LMin, max: LMax, factorMaxInc: LMax / preClosePrice, totalHeight: config[allGraph.line].totalHeight, baseHeight: config[allGraph.line].baseHeight, n: 5 });

        /* paintLine({
            ctx,
            sx: 0,
            sy: config[allGraph.line].totalHeight,
            ex: QL._DOMWidth,
            ey: config[allGraph.line].totalHeight,
            style: {
                color: "#00f"
            }
        }) */
        paintLine({
            ctx,
            sx: 0,
            sy: config[allGraph.line].totalHeight / 2,
            ex: QL._DOMWidth,
            ey: config[allGraph.line].totalHeight / 2,
            style: {
                color: "#CCCCCC"
            }
        })
    }
    paintLine({
        ctx,
        sx: 0,
        sy: config[allGraph.text].baseHeight,
        ex: QL._DOMWidth,
        ey: config[allGraph.text].baseHeight,
        style: {
            color: "#eee"
        }
    })
    paintLine({
        ctx,
        sx: 0,
        sy: config[allGraph.text].baseHeight + config[allGraph.text].totalHeight,
        ex: QL._DOMWidth,
        ey: config[allGraph.text].baseHeight + config[allGraph.text].totalHeight,
        style: {
            color: "#eee"
        }
    })

    // 时分 的 deal 图
    if (config[allGraph.dealMount]) {
        let dealRange = dealCalRangeValue(chartData);
        DMin = dealRange.min, DMax = dealRange.max;
        DYFactor = config[allGraph.dealMount].totalHeight / (DMax - DMin);

        console.log("成交量", DMin, DMax, config[allGraph.dealMount].totalHeight);
        // 计算 指数 对应 位置的值
        paintConfig.dealRange = calValuePos({ min: DMin, max: DMax, totalHeight: config[allGraph.dealMount].totalHeight, baseHeight: config[allGraph.dealMount].baseHeight, n: 3 });

        /* paintLine({
            ctx,
            sx: 0,
            sy: config[allGraph.dealMount].baseHeight,
            ex: QL._DOMWidth,
            ey: config[allGraph.dealMount].baseHeight,
            style: {
                color: "#ff0"
            }
        })
        paintLine({
            ctx,
            sx: 0,
            sy: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight,
            ex: QL._DOMWidth,
            ey: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight,
            style: {
                color: "#0f0"
            }
        }) */
    }

    /* 初始化 时间的 位置信息 */

    paintConfig.paintTimeX = [0];

    /* 若果到时候 需要 绘制 区域 面积，重新 绘制一个 */

    for (let i = 0, len = chartData.length; i < len; i++) {
        const curX = xFactor * i;
        if (i % 60 === 0 && i != 240 && i !== 0) {
            paintConfig.paintTimeX.push(curX);
            paintLine({
                ctx,
                sx: curX,//xFactor * i,
                sy: config[allGraph.line].baseHeight,
                ex: xFactor * i,
                ey: config[allGraph.line].baseHeight + config[allGraph.line].totalHeight,
                style: {
                    color: "#ddd",
                    setLineDash: [4],
                }
            })
            paintLine({
                ctx,
                sx: curX,//xFactor * i,
                sy: config[allGraph.dealMount].baseHeight,
                ex: xFactor * i,
                ey: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight,
                style: {
                    color: "#ddd",
                    setLineDash: [4],
                }
            })
        }
        if (LYFactor) {
            let cx = xFactor * i, cy = config[allGraph.line].baseHeight + config[allGraph.line].totalHeight - LYFactor * (chartData[i].curPrice - LMin);
            chartData[i].actuallyX = cx;
            chartData[i].actuallyY = cy;
            i > 0 && paintLine({
                ctx,
                sx: xFactor * (i - 1),
                sy: config[allGraph.line].baseHeight + config[allGraph.line].totalHeight - LYFactor * (chartData[i - 1].curPrice - LMin),
                ex: cx,
                ey: cy,
                style: {
                    color: QL._theme.time.line.curPrice || "#000",
                }
            });
        }
        DYFactor && paintLine({
            ctx,
            sx: curX,
            sy: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight - DYFactor * (chartData[i].dealMount - DMin),
            ex: curX,
            ey: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight,
            style: {
                color: i % 2 === 0 ? (QL._theme.time.dealMount.even || "#000") : QL._theme.time.dealMount.odd || "#000"
            }
        })
    }
    paintConfig.paintTimeX.push(240 * xFactor);

    /* paintLine({
        ctx,
        sx: parseInt(xFactor * (chartData.length - 1)) - 2,
        sy: config[allGraph.line].baseHeight + config[allGraph.line].totalHeight - LYFactor * (chartData[chartData.length - 1].curPrice - LMin),
        ex: parseInt(xFactor * (chartData.length - 1)) - 2,
        ey: config[allGraph.line].totalHeight,
        style: {
            color: QL._theme.time.line.curPrice || "#000",
            setLineDash: [4],
        }
    }) */
    Object.defineProperty(QL, "_paintConfig", {
        get() {
            return paintConfig;
        },
        configurable: true
    });
    /* 重新 配置 data 的 值 */
    // QL._data = {...data,data:chartData}
    Object.defineProperty(QL, "_data", {
        get() {
            return { ...data, data: chartData }
        },
        configurable: true
    })
    // console.info(Object.getOwnPropertyDescriptor(QL,"_data").get);

}