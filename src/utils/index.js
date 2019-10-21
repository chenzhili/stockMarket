import { pcOrH5 } from "../enums/device"
import { isNumber, isString } from "./types"


/* 判断 当前 是 pc 还是 h5 */
export function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
        return pcOrH5.h5
    } else {
        return pcOrH5.pc
    }
}
// 1 0000 0000 0000 0000 
/* 判断当前的 数值的 大小进行 不同 的格式化 */
export function splitNumber(num) {
    num = parseFloat(num);
    if (isNaN(num)) {
        return "无效数据";
    }
    num = Math.round(num*100)/100;
    const len = num.toString().split(".")[0].length;
    if (len > 16) {
        num = Math.round(num / (1e16) * 100) / 100 + "兆";
    } else if (len > 12) {
        num = Math.round(num / (1e12) * 100) / 100 + "万亿";
    } else if (len > 8) {
        num = Math.round(num / (1e8) * 100) / 100 + "亿";
    } else if (len > 4) {
        num = Math.round(num / (1e4) * 100) / 100 + "万";
    }
    return num;
}