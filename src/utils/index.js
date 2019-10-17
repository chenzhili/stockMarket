import {pcOrH5} from "../enums/device"


/* 判断 当前 是 pc 还是 h5 */
export function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
        return pcOrH5.h5
    } else {
        return pcOrH5.pc
    }
}