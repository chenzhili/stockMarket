import React, { Component } from "react"
import ReactDOM from "react-dom"

import styles from "./app.scss"

import KLineGraphCom from "./pc/kLineGraphCom"
import TimeSharingCom from "./pc/timeSharingCom"

// 外部传进来
import { timeSharing, prevPrice, kData } from "../enums/dataJSON";
import { insType } from "../enums";


class App extends Component {
    constructor() {
        super();
        this.state = {
            timeSharingData: timeSharing,
            kData: kData
        }
    }
    click() {
        this.setState({
            // timeSharingData: timeSharing.slice(0, 100),
            kData:kData.slice(0, 50)
        })
    }
    render() {
        const { timeSharingData,kData } = this.state;

        const timeProps = {
            dataGraph: {
                data: timeSharingData,
                preClosePrice: prevPrice
            },
            config: {
                insType: insType.timeSharingDiagram,
                theme: "light"
            }
        }
        const kProps = {
            dataGraph: {
                data: kData,
            },
            config: {
                insType: insType.kLineGraph,
                theme: "light"
            }
        }
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis</h2>
                <div className={styles.content}>
                    <div className={styles.left}>
                        左侧内容：Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis provident, necessitatibus quae labore, similique id dignissimos sit mollitia vero ullam repudiandae veniam molestias, ratione possimus magnam nihil nobis enim.
                    <div className={styles.btn} onClick={this.click.bind(this)}>点击</div>
                    </div>
                    <div className={styles.main}>
                        {/* <TimeSharingCom {...timeProps} /> */}
                        <KLineGraphCom {...kProps} />
                    </div>
                    <div
                        className={styles.right}
                    >右侧内容：Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam nobis ullam voluptate. A maxime autem velit ducimus quos modi, natus esse molestias id officia inventore odit doloribus quod maiores deserunt?</div>
                </div >
            </div >
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
