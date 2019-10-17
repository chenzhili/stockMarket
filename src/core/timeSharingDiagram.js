import { paintLine, paintRect } from "../utils/paintCom"
import { isObject, isArray } from "../utils/types"
import { calcConfig, allGraph } from "../enums/calcEnum"
import { timeSharing } from "../enums/dataJSON";


import style from "./index.scss"
console.log(style);

// 初始化 分时图
export function initTimeSharingDiagram(QL, data) {
    // 统一 做一个 canvas
    // console.log(2222222, data);
    if (!isObject(data)) return "initTimeSharingDiagram:数据格式不对";
    const canvas = document.createElement("canvas");
    canvas.innerHTML = "不支持canvas";
    canvas.width = QL._DOMWidth, canvas.height = QL._DOMHeight;

    canvas.style.background = QL._theme.bg || "transparent";

    const ctx = canvas.getContext("2d");

    if (!ctx) return "initTimeSharingDiagram:canvas不支持";

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
    if (!isArray(targetValue) && targetValue.length) return "calRangeValue：没数据";
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
    if (!isArray(targetValue) && targetValue.length) return "dealCalRangeValue：没数据";
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
    canvas.width = QL._DOMWidth, canvas.height = QL._DOMHeight;
    canvas.className = style["mask-cav"];

    /* 把 遮罩层 的 canvas 的 ctx 存储到 实例上,可能这个 canvas 会提取到  外部 让 两个 实例 共用 */
    Object.defineProperty(QL, "_maskCtx", {
        get() {
            return ctx
        },
        configurable: true
    })

    return canvas;

}
export function paintTimeSharingDiagram(data) {
    const QL = this;

    data = data || QL._data;

    const { _mainCtx: ctx } = QL;

    const config = calActuallyHeight(QL, calcConfig.timeSharingDiagram);

    const { data: chartData, preClosePrice } = data;

    // console.log(chartData, preClosePrice);
    let LMin = null, LMax = null, LYFactor = null,//这是 line图的
        DMin = null, DMax = null, DYFactor = null, // deal 图
        xFactor = QL._DOMWidth / 240; //这里的 240 是指 分成了 4段 ，每段 分为 60min





    // 时分的 line 图
    if (config[allGraph.line]) {
        let lineRange = calRangeValue(chartData, preClosePrice);
        LMin = lineRange.min, LMax = lineRange.max;
        LYFactor = config[allGraph.line].totalHeight / (LMax - LMin);
        Object.defineProperty(QL, "_gapD", {
            get() {
                return xFactor;
            }
        })

        /* paintLine({
            ctx,
            sx: 0,
            sy: config[allGraph.line].totalHeight,
            ex: QL._DOMWidth,
            ey: config[allGraph.line].totalHeight,
            style: {
                color: "#00f"
            }
        })
        paintLine({
            ctx,
            sx: 0,
            sy: config[allGraph.line].totalHeight / 2,
            ex: QL._DOMWidth,
            ey: config[allGraph.line].totalHeight / 2,
        }) */
    }
    /* paintLine({
        ctx,
        sx: 0,
        sy: 304.5,//config[allGraph.text].baseHeight,
        ex: QL._DOMWidth,
        ey: 304.5,//config[allGraph.text].baseHeight,
        style:{
            color:"#eee"
        }
    })
    paintLine({
        ctx,
        sx: 0,
        sy: config[allGraph.text].baseHeight + 10,
        ex: QL._DOMWidth,
        ey: config[allGraph.text].baseHeight + 10,
        style: {
            color: "#f00"
        }
    }) */

    // 时分 的 deal 图
    if (config[allGraph.dealMount]) {
        let dealRange = dealCalRangeValue(chartData);
        DMin = dealRange.min, DMax = dealRange.max;
        DYFactor = config[allGraph.dealMount].totalHeight / (DMax - DMin);


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
    /* 若果到时候 需要 绘制 区域 面积，重新 绘制一个 */

    for (let i = 0, len = chartData.length; i < len; i++) {
        if (i % 60 === 0 && i != 240 && i!== 0) {
            paintLine({
                ctx,
                sx: xFactor * i,
                sy: config[allGraph.line].baseHeight,
                ex: xFactor * i,
                ey: config[allGraph.line].baseHeight + config[allGraph.line].totalHeight,
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
                    color: QL._theme.time.line.curPrice || "#000"
                }
            });
        }
        DYFactor && paintLine({
            ctx,
            sx: xFactor * i,
            sy: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight - DYFactor * (chartData[i].dealMount - DMin),
            ex: xFactor * i,
            ey: config[allGraph.dealMount].baseHeight + config[allGraph.dealMount].totalHeight,
            style: {
                color: i % 2 === 0 ? (QL._theme.time.dealMount.even || "#000") : QL._theme.time.dealMount.odd || "#000"
            }
        })
    }
    paintLine({
        ctx,
        sx: parseInt(xFactor * (chartData.length - 1)) - 2,
        sy: config[allGraph.line].baseHeight + config[allGraph.line].totalHeight - LYFactor * (chartData[chartData.length - 1].curPrice - LMin),
        ex: parseInt(xFactor * (chartData.length - 1)) - 2,
        ey: config[allGraph.line].totalHeight,
        style: {
            color: QL._theme.time.line.curPrice || "#000",
            setLineDash: [4],
        }
    })
    ctx.closePath();
    ctx.fill();
    /* 重新 配置 data 的 值 */
    Object.defineProperty(QL, "_data", {
        get() {
            return { ...data, data: chartData }
        },
        configurable: true
    })
}