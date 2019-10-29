import QLStockMarket from "../../src/core"

import { timeSharing, prevPrice,kData } from "../../src/enums/dataJSON"
import { insType } from "../../src/enums"

import "./index.scss"



new QLStockMarket({
    selector: ".container1", data: {
        chartData: {
            data: timeSharing,
            preClosePrice: prevPrice
        }
    },
    config: {
        insType: insType.timeSharingDiagram,
        theme:"light"
    }
});
new QLStockMarket({
    selector: ".container2", data: {
        kData: {
            data: kData,
        }
    },
    config: {
        insType: insType.kLineGraph,
        theme:"light"
    }
});