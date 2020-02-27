import React, { Component } from "react"

import { splitNumber } from "../../../utils/index";
import QLStockMarket from "../../../core"
import { isFunction } from "../../../utils/types"
import styles from "../../../common/h5/KLineGraphH5.scss"

import dealData from "../../../transformCal";

/* 
    传入的props的值：
        dataGraph
        config
        width
        height
*/

const showMess = [
    { key: "open", name: "开" },
    { key: "high", name: "高" },
    { key: "low", name: "低" },
    { key: "close", name: "收" },
    { key: "rate", name: "涨跌" },
    { key: "rate", name: "涨幅" }
];
class KLineGraphH5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curData: {},
            upOrDown: false, //看看当前 是 涨还是跌
            QLStockMarketIns: {
                _paintConfig: {
                    valueRange: {
                        actuallyValue: [],
                        valueYPos: []
                    },
                    dealRange: {
                        actuallyValue: [],
                        valueYPos: []
                    }
                }
            },
            valueBorder: null,
            upToData: {},
            upToDateY: 0, //就是 页面中时间显示的位置

            curDataGraph: props.dataGraph, // 用于 存储 从 props 传进来的 原始的 dataGraph
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log(nextProps);
        const resultObj = {};
        if (nextProps.dataGraph && prevState.QLStockMarketIns._data && !(_.isEqual(prevState.curDataGraph, nextProps.dataGraph))) {
            console.log(prevState.curDataGraph, nextProps.dataGraph);
            // 这里如果 去修改 对应的 实例的化，导致 数据更新 混乱；
            /* prevState.QLStockMarketIns._data = {
                data: dealData(nextProps.dataGraph, nextProps.sTt)//nextProps.dataGraph.data,
            } */

            resultObj.curDataGraph = nextProps.dataGraph;
        }
        if (!(_.isEqual(prevState.curSTT, nextProps.sTt))) {
            resultObj.curSTT = nextProps.sTt;
        }

        return resultObj;
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (!(_.isEqual(this.state.curDataGraph, nextState.curDataGraph)) || !(_.isEqual(this.state.curSTT, nextState.curSTT))) {
            // console.log(nextState);
            nextState.QLStockMarketIns._data = {
                data: dealData(nextState.curDataGraph, nextProps.sTt)
            }
        }
        return true;
    }
    getUpToDataData(data) {
        let upToData = data;
        // 判定当前 是 涨还是 跌;
        let upOrDown = upToData.rate < 0 ? "down" : "up";
        this.setState({ upToData, upOrDown })
    }
    getChangeData(data) {
        let curData = data[data.length - 1];
        let upOrDown = curData.rate < 0 ? "down" : "up";
        this.setState({ curData, upOrDown })
    }
    componentDidMount() {
        const me = this;
        const tempData = {
            data: dealData(me.state.curDataGraph, me.props.sTt)
        }

        let QLStockMarketIns = new QLStockMarket({
            selector: "#qlStockMarketK",
            data: {
                kData: tempData || {},
            },
            config: me.props.config || {},
            emit: {
                getUpToDataData: me.getUpToDataData.bind(me),
                getChangeData: this.getChangeData.bind(me)
            }
        });
        // console.log(QLStockMarketIns);
        let valueBorder = Math.ceil(
            QLStockMarketIns._paintConfig.valueRange.actuallyValue.length / 2
        ) - 1;
        let upToDateY = QLStockMarketIns._paintConfig.valueRange.valueYPos[
            QLStockMarketIns._paintConfig.valueRange.valueYPos.length - 1
        ];

        this.setState({
            valueBorder, upToDateY, QLStockMarketIns
        });
    }
    componentWillUnmount() {
        if (this.QLStockMarketIns && isFunction(this.QLStockMarketIns.cancelEventListener)) {
            this.QLStockMarketIns.cancelEventListener();
        }
    }
    render() {
        let { width, height, config } = this.props;
        width = width || "100%", height = height || "100%";
        const theme = config && config.theme ? config.theme : "light";
        const { upToData, curData, QLStockMarketIns, upOrDown, valueBorder, upToDateY } = this.state;
        return (
            <div style={{ width: width, height: height }} className={`${styles.container} ${styles[`${theme}Bg`]}`}>
                {
                    upToData.date ? (
                        <div className={`${styles.marketMessSpecial} ${styles[`${theme}GenText`]}`}>
                            <span>{upToData.date || curData.date}</span>
                            {
                                showMess.map((item, index) => (
                                    <span key={index}>
                                        {item.name || curData.date}:
                                    <span
                                            className={`${upOrDown === 'down' ? [styles[`${theme}DownColor`]] : ""} ${upOrDown === 'up' ? [styles[`${theme}UpColor`]] : ""}`}
                                        >{splitNumber(upToData[item.key] || curData[item.key])}</span>
                                    </span>
                                ))
                            }
                        </div>
                    ) : null
                }
                <div className={styles.qlContainer} id="qlStockMarketK">
                    <div>
                        {
                            QLStockMarketIns._paintConfig.valueRange.actuallyValue.length ? (QLStockMarketIns._paintConfig.valueRange.actuallyValue.map((item, index) => (
                                <span
                                    className={`${styles.valueItem} ${index > valueBorder ? [styles[`${theme}DownColor`]] : ""} ${index < valueBorder ? [styles[`${theme}UpColor`]] : ""}`}
                                    key={index}
                                    style={{ top: `${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px` }}
                                >{item}</span>
                            ))) : null
                        }
                    </div>
                    <div>
                        {
                            QLStockMarketIns._paintConfig.dealRange.actuallyValue.length ? (QLStockMarketIns._paintConfig.dealRange.actuallyValue.map((item, index) => (
                                <span
                                    className={`${styles.valueItem} ${styles.valueItemRight} ${styles[`${theme}DealMount`]}`}
                                    key={`${index}bottom`}
                                    style={{ top: `${QLStockMarketIns._paintConfig.dealRange.valueYPos[QLStockMarketIns._paintConfig.dealRange.valueYPos.length - 1 - index] || 0}px` }}
                                >{splitNumber(item)}</span>
                            ))) : null
                        }
                    </div>
                    {
                        upToData.close ? (
                            <div
                                className={`${styles.updateValue} ${styles[upToData.rate > 0 ? `${theme}UpColorBg` : `${theme}DownColorBg`]}`}
                                style={{ top: upToData.actuallyY + 'px' }}
                            >{upToData.close}</div>
                        ) : null
                    }
                    {
                        upToData.date ? (
                            <div
                                className={styles.updateDate}
                                style={{ background: '#000', color: '#fff', top: upToDateY + 'px', left: upToData.actuallyX + 'px' }}
                            >{upToData.date}</div>
                        ) : null
                    }
                </div>
                <div className={`${styles.marketMess} ${styles[`${theme}GenText`]}`}>预留地方</div>
            </div>
        )
    }
}

export default KLineGraphH5;