<template>
  <div :style="{width:width,height:height}" :class="[styles.container,styles[`${theme}Bg`]]">
    <div :class="styles.content">
      <div :class="[styles.marketMess,styles[`${theme}GenText`]]">
        <span>{{upToData.date || curData.date}}</span>
        <template v-for="(item,index) of showMess">
          <span :key="index">
            {{item.name || curData.date}}:
            <span
              :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}"
            >{{splitNumber(upToData[item.key] || curData[item.key])}}</span>
          </span>
        </template>
      </div>
      <div :class="styles.qlContainer" id="qlStockMarketK">
        <div
          v-if="upToData.close"
          :class="[styles.updateValue,styles[upToData.rate>0?`${theme}UpColorBg`:`${theme}DownColorBg`]]"
          :style="{top:upToData.actuallyY+'px'}"
        >{{upToData.close}}</div>
        <div
          v-if="upToData.date"
          :class="styles.updateDate"
          :style="{background:'#000',color:'#fff',top:upToDateY+'px',left:upToData.actuallyX+'px'}"
        >{{upToData.date}}</div>
      </div>
      <div :class="[styles.marketMess,styles[`${theme}GenText`]]">预留地方</div>
    </div>
    <div :class="styles.rightMess">
      <template v-for="(item,index) of QLStockMarketIns._paintConfig.valueRange.actuallyValue">
        <span
          :class="[styles.valueItem,{[styles[`${theme}DownColor`]]:index>valueBorder,[styles[`${theme}UpColor`]]:index<valueBorder}]"
          :key="index"
          :style="{top:`${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px`}"
        >{{item}}</span>
      </template>
      <template v-for="(item,index) of QLStockMarketIns._paintConfig.dealRange.actuallyValue">
        <span
          :class="[styles.valueItem,styles[`${theme}DealMount`]]"
          :key="QLStockMarketIns._paintConfig.valueRange.actuallyValue.length+index"
          :style="{top:`${QLStockMarketIns._paintConfig.dealRange.valueYPos[QLStockMarketIns._paintConfig.dealRange.valueYPos.length-1-index] || 0}px`}"
        >{{splitNumber(item)}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import styles from "../../../common/pc/kLineGraph.scss";

import QLStockMarket from "../../../core";
import { splitNumber } from "../../../utils/index";

const showMess = [
  { key: "open", name: "开" },
  { key: "high", name: "高" },
  { key: "low", name: "低" },
  { key: "close", name: "收" },
  { key: "rate", name: "涨跌" },
  { key: "rate", name: "涨幅" }
];

export default {
  name: "KLineGraphCom",
  data: function() {
    return {
      styles,

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
      upToDateY: 0 //就是 页面中时间显示的位置
    };
  },
  computed: {
    showMess() {
      return showMess;
    },
    theme() {
      return this.config.theme ? this.config.theme : "light";
    }
  },
  methods: {
    splitNumber,
    /* 在 hover 事件 的运用 */
    getUpToDataData(data) {
      console.log("==============", data);
      this.upToData = data;
      // 判定当前 是 涨还是 跌;
      this.upOrDown = this.upToData.rate < 0 ? "down" : "up";
    },
    /* 当页面 发生移动 或者 缩放的时候 做的 */
    getChangeData(data) {
      //   console.log("===============", data);
      this.$set(this, "curData", data[data.length - 1]);
      this.upOrDown = this.curData.rate < 0 ? "down" : "up";
    }
  },
  watch: {
    dataGraph: {
      deep: true,
      handler(nv) {
        // console.log("============");
        this.QLStockMarketIns._data = {
          data: nv.data,
        };
      }
      // immediate: true,
    }
  },
  async mounted() {
    let QLStockMarketIns = new QLStockMarket({
      selector: "#qlStockMarketK",
      data: {
        kData: this.dataGraph
      },
      config: this.config,
      emit: {
        getUpToDataData: this.getUpToDataData.bind(this),
        getChangeData: this.getChangeData
      }
    });
    this.valueBorder =
      Math.ceil(
        QLStockMarketIns._paintConfig.valueRange.actuallyValue.length / 2
      ) - 1;
    this.upToDateY =
      QLStockMarketIns._paintConfig.valueRange.valueYPos[
        QLStockMarketIns._paintConfig.valueRange.valueYPos.length - 1
      ];
    this.$set(this, "QLStockMarketIns", QLStockMarketIns);

    console.log(
      QLStockMarketIns,
      QLStockMarketIns._paintConfig,
      this.valueBorder
    );
  },
  destroyed() {
    this.QLStockMarketIns.cancelEventListener();
  },
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    dataGraph: {
      type: Object,
      default: function() {
        return {};
      }
    },
    config: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>

