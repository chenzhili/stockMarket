import { periodConfig, staticPeriod, MA, RSI } from './staticConfig';
import { isArray, isString } from '../utils/types';

// 指标线模块
import uniformDealData from './calcRSI'

export { periodConfig, staticPeriod, MA, RSI }

export { uniformDealData }

import { dData, mData } from "./response";
/* 存储对应的 历史数据的最后一项值，用于对于 收盘价的 获取 */
let tempItem = {};

/**
 * 转换数据
 * @param {*} data 获取到的元数据
 * @param {*} target 转换目标
 * @param {*} source 转换源类型
 */
function transform(data = { curData: '', hisData: '' }, target, source) {
    if (periodConfig[target] <= staticPeriod[source]) {
        return '转换数据关系错误';
    }
    const curData = data.curData;
    const hisData = data.hisData;

    // 临时数据的 配置
    let resultCurData = [], resultHisData = [];
    if (!curData && !hisData) { return '元数据有问题'; }
    if (!isArray(curData) && !isArray(hisData)) { return '元数据格式不对'; }

    /* 对于 当天数据 的 处理 */
    if (isArray(curData) && curData.length) {
        resultCurData = dealCurData(curData, target, source);
    }

    /* 对于 历史数据 的 处理 */
    if (isArray(hisData) && hisData.length) {
        tempItem = hisData[hisData.length - 1];
        // console.time()
        resultHisData = dealHisData(hisData, target, source);
        // console.timeEnd();
    }
    if (!isArray(resultCurData)) {
        resultCurData = [];
    }
    if (!isArray(resultHisData)) {
        resultHisData = [];
    }
    return [...resultHisData, ...resultCurData];
}

/* 时间格式化 */
/* 
    date 的形式:
    202002201500
    20200220
    202002
*/
transform.timeReg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/;
transform.splitTime = function (date) {
    if (!isString(date) || transform.timeReg.test(date)) { return date; }
    const len = date.length - 1;
    let i = 0;
    let str = "", param = 0;
    const config = Object.freeze({
        0: "-",
        4: "-",
        6: " ",
        8: ":"
    });
    while (i < len) {
        param = i === 0 ? 4 : 2;
        str += (date.slice(i, i + param) + (config[i] ? config[i] : ""));
        i += param;
    }
    return str;
}

// 当天数据的 处理方式
function dealCurData(curData, target, source) {
    // 分钟内的转换
    if (periodConfig[target] <= 60) {
        // 对应的倍数值
        const n = periodConfig[target] / staticPeriod[source];
        return dealCurData.mCurDataCore(curData, n);
    }
    // 这里如果 不做任何处理，直接 返回了
    return curData;
    // 日k 或者 月k 的转换 暂时 不用；
}

/* 
    target:
    w: 70,
    q: 80,
    hy: 90,
    y: 100

    source:
    d: 65,
    M: 75
*/
// 历史数据的 处理方式
function dealHisData(hisData, target, source) {
    // 分钟内的 转换
    if (periodConfig[target] <= 60) {
        // 对应的倍数值
        const n = periodConfig[target] / staticPeriod[source];
        return dealHisData.mHisDataCore(hisData, n);
    } else {
        // 如果目标为 周 只能是 日=>周
        if (periodConfig[target] === periodConfig.w) {
            if (staticPeriod[source] !== staticPeriod.d) {
                try {
                    throw new Error('请传入日k的数据格式');
                } catch (error) {

                } finally {
                    return '请传入日k的数据格式';
                }
            }
            return dealHisData.wHisDataCore(hisData);
        } else {
            return "暂不支持这个转换";

            // 如果当前 的 source 为 M 的 类型的 处理
            if (staticPeriod[source] === staticPeriod.M) {
                // 这种方式 只能在 整年查找的时候，兼容性太差，应该用 自然年的 对应 季度 来计算；
                // return dealHisData.mHisDataCore(hisData, dealHisData.MtoAny[target]);
                return dealHisData.MToAnyDataCore(hisData, target);

            } else {

            }
        }

    }
}
/* 对于 月 => 季，半年 以及 年的 转换的 基础数据 */
dealHisData.MtoAny = Object.freeze({
    q: 3,
    hy: 6,
    y: 12
});

// 月 => 季，半年 以及 年 的操作
dealHisData.MToAnyDataCore = function (data, target) {

}
/* 月是 0-11 改变成  1-12 */
dealHisData.MToAnyDataCore.getMonth = function (date) {
    if (transform.timeReg.test(date)) { return date.getMonth(); }
    return (new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}`).getMonth() + 1);
}

// 周的操作
/* 
    {date,dealMount,open,high,low,close,rate}
    判断是不是 当前周 的 数据；
    当前的星期几 < pre的星期几  并且 (当前开始记入的星期的毫秒数 - 当前 的毫秒数) 小于 6 天(根据股市星期六和星期天不开盘，其实只有 4天)的毫秒数
*/
dealHisData.wHisDataCore = function (data) {
    let i = data.length - 1;
    let resultArr = [],
        tempObj,
        item,
        prevW, // 记住前一个 的星期
        startTime, // 记住 当前 周最小 毫秒数
        isEnd = true; // 是指当前是不是 周期的初始值
    while (i >= 0) {
        item = data[i];
        // 这是当前周的初始 最后一天
        if (isEnd) {
            isEnd = false;
            tempObj = {};
            tempObj.date = transform.splitTime(item.date);
            tempObj.close = item.close;
            tempObj.dealMount = +item.dealMount;
            tempObj.amount = +item.amount;

            tempObj.high = item.high;
            tempObj.low = item.low;

            startTime = dealHisData.wHisDataCore.getTimes(item.date);
            // console.log(item.date,i);
        } else {
            /* 证明 item 在 当前周 */
            if ((dealHisData.wHisDataCore.getDay(item.date) < prevW) && ((dealHisData.wHisDataCore.getTimes(item.date) - startTime) <= dealHisData.wHisDataCore.weekTimes)) {
                tempObj.dealMount += (+item.dealMount);
                tempObj.amount += (+item.amount);

                // 最高 和 最低值
                if (item.high > tempObj.high) {
                    tempObj.high = item.high;
                }

                if (item.low < tempObj.low) {
                    tempObj.low = item.low;
                }

                // 这里对于 当前数据的 第一项需要 做 结尾
                if (i === 0) {
                    tempObj.open = item.open;
                    resultArr.unshift(tempObj);
                }

            } else { // 不在当前周了
                // 这里获取 这周的 第一个 开盘价
                const openItem = data[i + 1];
                tempObj.open = openItem.open;

                resultArr.unshift(tempObj);

                // 这里开始算 rate ,这里 获取的 值 不包含 第一周的；
                if (resultArr[0]) {
                    resultArr[0].rate = Math.round(resultArr[0].close / openItem.close * 100) / 100;
                }

                isEnd = true;
                i++;
            }

        }
        prevW = dealHisData.wHisDataCore.getDay(item.date);
        i--;
    }
    // 计算数据中的 第一周 的 rate
    resultArr[0].rate = Math.round(resultArr[0].close / resultArr[0].open * 100) / 100;
    return resultArr;
}
/**
 * 获取毫秒数
 * "2020214"
 */
dealHisData.wHisDataCore.getTimes = function (date) {
    if (transform.timeReg.test(date)) { return date.getTime(); }
    return new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`).getTime();
}
/**
 * 获取星期几
 */
dealHisData.wHisDataCore.getDay = function (date) {
    if (transform.timeReg.test(date)) { return date.getDay(); }
    return new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`).getDay();
}

dealHisData.wHisDataCore.weekTimes = 6 * 24 * 60 * 60 * 1000;


// {date,dealMount,open,high,low,close,rate}
// rate = 如果有昨天的数据，就用今天close/昨天close , 如果没有昨天的数据今天close/今天的open
dealHisData.mHisDataCore = dealCurData.mCurDataCore = function (data, n) {
    const len = data.length;
    let number = 0;
    let tempObj,
        resultArr = [],
        item,
        prevClose = tempItem.close || data[data.length - 1].open;/* 昨天close; */
    while (number < len) {
        item = data[number];
        if (number % n === 0) {
            if (number !== 0) {
                resultArr.push(tempObj);
                prevClose = tempObj.close;
            }
            tempObj = {};
            tempObj.open = item.open;
            tempObj.high = item.high;
            tempObj.low = item.low;

            tempObj.dealMount = +item.dealMount;
            tempObj.amount = +item.amount;
        } else {
            // 收盘价,时间:统一使用当前周期最后一分钟线的对应数据(14:00到14:05,收盘价为14:05 的收盘价)
            if (number % n === (n - 1) || number === (len - 1)) {
                tempObj.date = transform.splitTime(item.date);
                tempObj.close = item.close;
                tempObj.rate = Math.round(item.close / prevClose * 100) / 100;
                // 对于 处理尾部 把 最后的 tempObj 放进去, 不足 n 的余数 处理
                if (number === (len - 1)) {
                    resultArr.push(tempObj);
                }
            }

            if (item.high > tempObj.high) {
                tempObj.high = item.high;
            }

            if (item.low < tempObj.low) {
                tempObj.low = item.low;
            }
            tempObj.dealMount += (+item.dealMount);
            tempObj.amount += (+item.amount);
        }
        number++;
    }
    // console.log(resultArr);
    return resultArr;
}


/* 在对应 框架中 处理 是否需要 进行 转换的操作 */
function dealData(dataGraph = {}, sTt = []) {
    if (!sTt.length || sTt.length !== 2) { return (dataGraph.data || []); }
    if (!dataGraph.data && !dataGraph.curData) {
        return [];
    }

    return transform({ hisData: dataGraph.data, curData: dataGraph.curData }, sTt[1], sTt[0])
}

// m1 -> m5
// transform({ hisData: mData }, 'm5', 'm1');
export default dealData;