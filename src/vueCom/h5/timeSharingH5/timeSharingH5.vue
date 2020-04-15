<template>
  <div
    :style="{width:width,height:height}"
    :class="[styles.container,styles[`${theme}Bg`]]"
    v-if="flag"
  >
    <div :class="[styles.marketMess,styles[`${theme}GenText`]]">
      <span>{{upToData.time || curData.time}}</span>
      <template v-for="(item,index) of showMess">
        <span :key="index">
          <span
            v-if="item.key==='rateUpDown'"
            :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}"
          >{{formatNumber((upToData.curPrice?upToData.curPrice:curData.curPrice) - dataGraph.preClosePrice,decimal)}}</span>

          <span
            v-else-if="item.key==='dealMount' || item.key==='totalMoney'"
            :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}"
          >{{splitNumber(upToData[item.key] == null ? curData[item.key] : upToData[item.key])}}</span>

          <span
            v-else-if="item.key==='rate'"
            :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}"
          >{{splitNumber(upToData[item.key] == null ? curData[item.key] : upToData[item.key])}}%</span>

          <span
            v-else-if="item.key==='curPrice'||item.key==='avPrice'"
            :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}"
          >{{formatNumber(upToData[item.key] == null ? curData[item.key] : upToData[item.key],decimal)}}</span>
          <!-- <span
            :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}"
          >{{splitNumber(upToData[item.key] || curData[item.key])}}</span>-->
        </span>
      </template>
    </div>
    <div
      :class="styles.qlContainer"
      id="qlStockMarketT"
    >
      <div>
        <template v-for="(item,index) of QLStockMarketIns._paintConfig.valueRange.factorInc">
          <span
            v-if="index%2===0"
            :class="[styles.valueItem,styles.valueItemRight,{[styles[`${theme}DownColor`]]:index>valueBorder,[styles[`${theme}UpColor`]]:index<valueBorder}]"
            :key="index+'right'"
            :style="{top:`${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px`}"
          >{{item+"%"}}</span>
        </template>
      </div>
      <div>
        <template v-for="(item,index) of QLStockMarketIns._paintConfig.valueRange.actuallyValue">
          <span
            v-if="index%2===0"
            :class="[styles.valueItem,{[styles[`${theme}DownColor`]]:index>valueBorder,[styles[`${theme}UpColor`]]:index<valueBorder}]"
            :key="index"
            :style="{top:`${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px`}"
          >{{item}}</span>
        </template>
      </div>
      <div
        v-if="upToData.curPrice"
        :class="styles.updateValue"
        :style="{background:'#f00',top:upToData.actuallyY+'px'}"
      >{{upToData.curPrice}}</div>
      <div
        v-if="upToData.rate"
        :class="styles.updateRate"
        :style="{background:'#f00',top:upToData.actuallyY+'px'}"
      >{{splitNumber(upToData.rate)}}%</div>
      <div
        :class="[styles.dealMount,styles[`${theme}GenText`]]"
        :style="{top:QLStockMarketIns._paintConfig.dealMountPos+'px'}"
      >成交量:{{splitNumber(upToData.dealMount == null ? curData.dealMount : upToData.dealMount)}}</div>
    </div>
    <div :class="styles.marketTime">
      <template v-for="(item,index) of QLStockMarketIns._paintConfig.paintTimeX">
        <span
          :class="[styles.marketTimeItem,styles[`${theme}GenText`]]"
          :key="index"
          :style="{left:item+'px'}"
        >{{timeArr[index]}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import styles from "../../../common/h5/timeSharingH5.scss";

import QLStockMarket from "../../../core";
import { splitNumber, formatNumber } from "../../../utils/index";
import { isFunction } from "../../../utils/types";

const timeArr = ["09:30", "10:30", "11:30/13:00", "14:00", "15:00"];
const showMess = [
  { key: "curPrice", name: "现价" },
  { key: "avPrice", name: "均价" },
  { key: "rateUpDown", name: "涨跌" },
  { key: "rate", name: "涨幅" },
  { key: "dealMount", name: "量" },
  { key: "totalMoney", name: "额" }
];

export default {
  name: "TimeSharingH5",
  data: function () {
    return {
      styles,

      curData: {},
      stockMarketMess: {}, //存储 所有的 动态 走势 信息
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
      decimal: 100, // 默认的保留位数

      // 刷新 当前 组件的 控制
      flag: true
    };
  },
  computed: {
    showMess () {
      return showMess;
    },
    timeArr () {
      return timeArr;
    },
    theme () {
      return this.config.theme ? this.config.theme : "light";
    }
  },
  methods: {
    splitNumber,
    formatNumber,
    getUpToDataData (data) {
      // console.log("==============",data);
      this.upToData = data;
      // 判定当前 是 涨还是 跌;
      this.upOrDown = this.upToData.rate < 0 ? "down" : "up";
    },
    // 刷新当前组件
    refresh (bool) {
      bool = bool == undefined ? true : false;
      this.flag = bool;
    },
    initQLStockMarket () {
      // console.log(this.$emit); //用这个进行 子组件向 父组件 传值
      let QLStockMarketIns = new QLStockMarket({
        selector: "#qlStockMarketT",
        data: {
          chartData: this.dataGraph
        },
        config: this.config,
        emit: {
          getUpToDataData: this.getUpToDataData,
          // refresh: this.refresh
        }
      });

      /* 动态加入 感觉没意义 */
      /* let {Theme} = await import("../../../enums");
      console.log(Theme); */

      this.valueBorder =
        Math.ceil(
          QLStockMarketIns._paintConfig.valueRange.actuallyValue.length / 2
        ) - 1;
      this.$set(this, "QLStockMarketIns", QLStockMarketIns);
      this.$set(
        this,
        "curData",
        QLStockMarketIns._data.data[QLStockMarketIns._data.data.length - 1]
      );
      // 判定当前 是 涨还是 跌;
      this.upOrDown = this.curData.rate < 0 ? "down" : "up";
      this.decimal = QLStockMarketIns._decimal;
      console.log(this, this.QLStockMarketIns, QLStockMarketIns._paintConfig);
    }
  },
  watch: {
    dataGraph: {
      deep: true,
      handler (nv) {
        console.log("============");
        this.QLStockMarketIns._data = {
          data: nv.data,
          preClosePrice: nv.preClosePrice
        };
      }
      // immediate: true,
    },
    /* 全屏处理 */
    width: {
      deep: true,
      handler (nv) {
        // console.log("width:" + nv);
        // this.QLStockMarketIns._DOMWidth = parseFloat(nv);
        this.refresh(false);
        setTimeout(() => {
          this.refresh();
        })
      }
      // immediate: true,
    },
    height: {
      deep: true,
      handler (nv) {
        // console.log("height:" + nv);
        // this.QLStockMarketIns._DOMHeight = parseFloat(nv);
        this.refresh(false);
        setTimeout(() => {
          this.refresh();
        })
      }
      // immediate: true,
    },
    flag: {
      deep: true,
      handler (nv) {
        console.log(nv);
        // this.QLStockMarketIns._DOMHeight = 0;
        if (nv) {
          setTimeout(() => {
            this.initQLStockMarket();
          })
        }
      }
    }
  },
  async mounted () {
    this.initQLStockMarket();
  },
  destroyed () {
    if (
      this.QLStockMarketIns &&
      isFunction(this.QLStockMarketIns.cancelEventListener)
    ) {
      this.QLStockMarketIns.cancelEventListener();
    }
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
      default: function () {
        return {};
      }
    },
    config: {
      type: Object,
      default: function () {
        return {};
      }
    }
  }
};
</script>

