// 转换目标
const periodConfig = Object.freeze({
    m5: 5,
    m30: 30,
    m60: 60,
    w: 70,
    q: 80,
    hy: 90,
    y: 100
});

// 元数据列表
const staticPeriod = Object.freeze({
    m1: 1,
    m15: 15,
    d: 65,
    M: 75
});

export { periodConfig, staticPeriod }