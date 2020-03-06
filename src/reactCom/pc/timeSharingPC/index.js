import React, { Component } from "react"
import _ from "lodash"

import { splitNumber, formatNumber } from "../../../utils"
import QLStockMarket from "../../../core"
import { isFunction } from "../../../utils/types"

import styles from "../../../common/pc/timeSharing.scss"

/* 
    传入的props的值：
        dataGraph
        config
        width
        height
*/

const timeArr = ["09:30", "10:30", "11:30/13:00", "14:00", "15:00"];
const showMess = [
    { key: "curPrice", name: "现价" },
    { key: "avPrice", name: "均价" },
    { key: "rateUpDown", name: "涨跌" },
    { key: "rate", name: "涨幅" },
    { key: "dealMount", name: "量" },
    { key: "totalMoney", name: "额" }
];
class TimeSharingPC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curData: {},
            QLStockMarketIns: {
                _paintConfig: {
                    paintTimeX: [],
                    valueRange: {
                        actuallyValue: [],
                        valueYPos: [],
                        factorInc: []
                    },
                    dealRange: {
                        actuallyValue: [],
                        valueYPos: []
                    }
                }
            }, //存储 实例化的 走势 对象
            valueBorder: null,
            upToData: {}, //时时数据
            upOrDown: false, //看看当前 是 涨还是跌
            decimal: 100 // 默认的保留位数
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log(nextProps);
        if (nextProps.dataGraph && prevState.QLStockMarketIns._data && _.difference(prevState.QLStockMarketIns._data.data, nextProps.dataGraph.data).length) {
            // console.log("========");
            prevState.QLStockMarketIns._data = {
                data: nextProps.dataGraph.data,
                preClosePrice: prevState.QLStockMarketIns._data.preClosePrice
            }
        }
        return null;
    }
    getUpToDataData(data) {
        // console.log("=======", data);
        let upToData = data;
        let upOrDown = upToData.rate < 0 ? "down" : "up";
        this.setState({
            upToData, upOrDown
        });
    }
    componentDidMount() {
        const me = this;
        console.log(me.props.dataGraph);
        let QLStockMarketIns = new QLStockMarket({
            selector: "#qlStockMarketT",
            data: {
                chartData: me.props.dataGraph || {},
            },
            config: me.props.config || {},
            emit: {
                getUpToDataData: me.getUpToDataData.bind(me)
            }
        });
        console.log(QLStockMarketIns);
        let valueBorder = Math.ceil(
            QLStockMarketIns._paintConfig.valueRange.actuallyValue.length / 2
        ) - 1;
        let curData = QLStockMarketIns._data.data[QLStockMarketIns._data.data.length - 1];
        let upOrDown = curData.rate < 0 ? "down" : "up";

        this.setState({
            valueBorder, curData, upOrDown, QLStockMarketIns,
            decimal: QLStockMarketIns._decimal
        });
    }
    componentWillUnmount() {
        if (isFunction(this.QLStockMarketIns.cancelEventListener)) {
            this.QLStockMarketIns.cancelEventListener();
        }
    }
    render() {
        let { width, height, config, dataGraph } = this.props;
        width = width || "100%", height = height || "100%";
        const theme = config && config.theme ? config.theme : "light";

        let { upToData, curData, QLStockMarketIns, upOrDown, valueBorder, decimal } = this.state;

        return (
            <div style={{ width: width, height: height }} className={`${styles.container} ${styles[`${theme}Bg`]}`}>
                <div className={styles.leftMess}>
                    {
                        QLStockMarketIns._paintConfig.valueRange.actuallyValue.length ? (
                            QLStockMarketIns._paintConfig.valueRange.actuallyValue.map((item, index) => (
                                <span
                                    className={`${styles.valueItem} ${index > valueBorder ? styles[`${theme}DownColor`] : ""} ${index < valueBorder ? styles[`${theme}UpColor`] : ""}`}
                                    key={index}
                                    style={{ top: `${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px` }}
                                >{item}</span>
                            ))
                        ) : null
                    }

                </div>
                <div className={styles.content}>
                    <div className={`${styles.marketMess} ${styles[`${theme}GenText`]}`}>
                        <span>{upToData.time || curData.time}</span>
                        {
                            showMess.map((item, index) => {
                                switch (item.key) {
                                    case "rateUpDown":
                                        return (
                                            <span key={index}>
                                                {item.name}:
                                                <span className={`${upOrDown === 'down' ? styles[`${theme}DownColor`] : ""} ${upOrDown === 'up' ? styles[`${theme}UpColor`] : ""}`}>
                                                    {formatNumber((upToData.curPrice ? upToData.curPrice : curData.curPrice) - dataGraph.preClosePrice, decimal)}
                                                </span>
                                            </span>
                                        )
                                    case "rate":
                                        return (
                                            <span key={index}>
                                                {item.name}:
                                                <span className={`${upOrDown === 'down' ? styles[`${theme}DownColor`] : ""} ${upOrDown === 'up' ? styles[`${theme}UpColor`] : ""}`}>
                                                    {splitNumber(upToData[item.key] || curData[item.key])}%
                                                </span>
                                            </span>
                                        )
                                    case "dealMount":
                                    case "totalMoney":
                                        return (
                                            <span key={index}>
                                                {item.name}:
                                                <span className={`${upOrDown === 'down' ? styles[`${theme}DownColor`] : ""} ${upOrDown === 'up' ? styles[`${theme}UpColor`] : ""}`}>
                                                    {splitNumber(upToData[item.key] || curData[item.key])}
                                                </span>
                                            </span>
                                        )
                                    case "curPrice":
                                    case "avPrice":
                                        return (
                                            <span key={index}>
                                                {item.name}:
                                                <span className={`${upOrDown === 'down' ? styles[`${theme}DownColor`] : ""} ${upOrDown === 'up' ? styles[`${theme}UpColor`] : ""}`}>
                                                    {formatNumber(upToData[item.key] || curData[item.key], decimal)}
                                                </span>
                                            </span>
                                        )
                                }
                            })
                        }
                    </div>
                    <div className={styles.qlContainer} id="qlStockMarketT">
                        {
                            upToData.curPrice ? (
                                <div
                                    className={styles.updateValue}
                                    style={{ background: '#f00', top: `${upToData.actuallyY}px` }}
                                >{upToData.curPrice}</div>
                            ) : null
                        }
                        {
                            upToData.rate ? (
                                <div
                                    className={styles.updateRate}
                                    style={{ background: '#f00', top: `${upToData.actuallyY}px` }}
                                >{splitNumber(upToData.rate)}%</div>
                            ) : null
                        }
                        <div
                            className={`${styles.dealMount} ${styles[`${theme}GenText`]}`}
                            style={{ top: `${QLStockMarketIns._paintConfig.dealMountPos}px` }}
                        >
                            成交量:{splitNumber(upToData.dealMount || curData.dealMount)}
                        </div>
                    </div>
                    <div className={styles.marketTime}>
                        {
                            QLStockMarketIns._paintConfig.paintTimeX.length ? (
                                QLStockMarketIns._paintConfig.paintTimeX.map((item, index) => (
                                    <span
                                        className={`${styles.marketTimeItem} ${styles[`${theme}GenText`]}`}
                                        key={index}
                                        style={{ left: `${item}px` }}
                                    >
                                        {timeArr[index]}
                                    </span>
                                ))

                            ) : null
                        }
                    </div>
                </div>
                <div className={styles.rightMess}>
                    {
                        QLStockMarketIns._paintConfig.valueRange.factorInc.length ? (
                            QLStockMarketIns._paintConfig.valueRange.factorInc.map((item, index) => (
                                <span
                                    className={`${styles.valueItem} ${index > valueBorder ? styles[`${theme}DownColor`] : ""} ${index < valueBorder ? styles[`${theme}UpColor`] : ""}`}
                                    key={index}
                                    style={{ top: `${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px` }}
                                >{item + "%"}</span>
                            ))
                        ) : null
                    }
                    {
                        QLStockMarketIns._paintConfig.dealRange.actuallyValue.length ? (
                            QLStockMarketIns._paintConfig.dealRange.actuallyValue.map((item, index) => (
                                <span
                                    className={`${styles.valueItem} ${styles[`${theme}DealMount`]}`}
                                    key={QLStockMarketIns._paintConfig.valueRange.factorInc.length + index}
                                    style={{ top: `${QLStockMarketIns._paintConfig.dealRange.valueYPos[QLStockMarketIns._paintConfig.dealRange.valueYPos.length - 1 - index] || 0}px` }}
                                >{splitNumber(item)}</span>
                            ))
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

export default TimeSharingPC;