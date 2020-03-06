
/* 统一 当前 文件 的 出口 */
import { allGraph, calcConfig } from "./calcEnum"
import { pcOrH5 } from "./device"

export {
    allGraph, calcConfig, pcOrH5
};

/* 对于 canvas 绘制 是 stroke 还是 fill */
export const strokeOrFill = Object.freeze({
    fill: "0",
    stroke: "1",
    all: "2"
});

/* 具体 实例化 绘制 的 类型 */
export const insType = Object.freeze({
    timeSharingDiagram: "0",
    kLineGraph: "1"
})


/* 定制主题样式 */
export const Theme = Object.freeze({
    dark: {
        time: {
            dealMount: {
                even: "#FCFC54",
                odd: "#FCFC54",
            },
            text: {
                asend: "#FF3224",
                desc: "#00E600"
            },
            line: {
                curPrice: "#fff",
                avPrice: "#F3B232",
            },
        },
        k: {
            descFill: "#54FFFF",
            descStroke: "#54FFFF",
            asendFill: "#000000",
            asendStroke: "#FF5454",
            MAColor: ["#1F6195", "#E0AC58", "#9C73AF"]
        },
        bg: "#000",
        maskLine: "rgba(255,255,255,1)"
    },
    light: {
        time: {
            dealMount: {
                even: "#6CA584",
                odd: "#D85342",
            },
            text: {
                asend: "#D85342",
                desc: "#6CA584"
            },
            line: {
                curPrice: "#4188B9",
                avPrice: "#F3B232",
            },
        },
        k: {
            descFill: "#6BA583",
            descStroke: "#15713B",
            asendFill: "#EC5F4C",
            asendStroke: "#900F00",
            MAColor: ["#1F6195", "#E0AC58", "#9C73AF"]
        },
        bg: "#fff",
        maskLine: "rgba(0,0,0,.3)"
    }
})