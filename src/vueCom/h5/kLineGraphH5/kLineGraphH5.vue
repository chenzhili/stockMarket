<template>
  <div
    :style="{width:width,height:height}"
    :class="[styles.container,styles[`${theme}Bg`]]"
    v-if="flag"
  >
    <div
      v-if="upToData.date"
      :class="[styles.marketMessSpecial,styles[`${theme}GenText`]]"
    >
      <span>{{upToData.date || curData.date}}</span>
      <template v-for="(item,index) of showMess">
        <span :key="index">
          {{item.name || curData.date}}:
          <span :class="{[styles[`${theme}DownColor`]]:upOrDown === 'down',[styles[`${theme}UpColor`]]:upOrDown === 'up'}">{{formatNumber(upToData[item.key] == null ? curData[item.key] : upToData[item.key],decimal)}}{{item.key === 'rate' ? '%' : ''}}</span>
        </span>
      </template>
    </div>
    <div
      :class="styles.qlContainer"
      id="qlStockMarketK"
    >
      <div>
        <template v-for="(item,index) of QLStockMarketIns._paintConfig.valueRange.actuallyValue">
          <span
            :class="[styles.valueItem,{[styles[`${theme}DownColor`]]:index>valueBorder,[styles[`${theme}UpColor`]]:index<valueBorder}]"
            :key="index"
            :style="{top:`${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px`}"
          >{{item}}</span>
        </template>
      </div>
      <div>
        <template v-for="(item,index) of QLStockMarketIns._paintConfig.dealRange.actuallyValue">
          <span
            :class="[styles.valueItem,styles.valueItemRight,styles[`${theme}DealMount`]]"
            :key="index+'bottom'"
            :style="{top:`${QLStockMarketIns._paintConfig.dealRange.valueYPos[QLStockMarketIns._paintConfig.dealRange.valueYPos.length-1-index] || 0}px`}"
          >{{splitNumber(item)}}</span>
        </template>
      </div>
      <!-- MA均线 -->
      <div :class="styles.updateMA">
        <template v-for="(item,index) of QLStockMarketIns._MAConfig">
          <span
            v-if="Object.keys(upToData).length?upToData[`MA${item}`]: curData[`MA${item}`]"
            :class="styles.ma"
            :key="index"
            :style="{color:QLStockMarketIns._theme.k.MAColor[index]}"
          >MA{{item}}:{{Object.keys(upToData).length ? formatNumber(upToData[`MA${item}`],decimal): formatNumber(curData[`MA${item}`],decimal)}}</span>
        </template>
      </div>
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
</template>
<script>
import styles from '../../../common/h5/kLineGraphH5.scss';

import QLStockMarket from '../../../core';
import { splitNumber, formatNumber } from '../../../utils/index';
import { isFunction } from '../../../utils/types';

import dealData from '../../../transformCal';

const showMess = [
  { key: 'open', name: '开' },
  { key: 'high', name: '高' },
  { key: 'low', name: '低' },
  { key: 'close', name: '收' },
  // { key: "rateUpDown", name: "涨跌" },
  { key: 'rate', name: '涨幅' }
];

/* 如果 在 传入的参数 有 需要转换 */
function preDealCurData (data, sTt = []) {
  if (data.curData && data.curData.length) {
    if (sTt.length && sTt.length === 2) {
      return dealData({ curData: data.curData }, sTt);
    } else {
      return data.curData;
    }
  } else {
    return [];
  }
}

export default {
  name: 'KLineGraphComH5',
  data: function () {
    return {
      styles,

      curData: {},
      upOrDown: false, // 看看当前 是 涨还是跌
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
      upToDateY: 0, // 就是 页面中时间显示的位置
      decimal: 100, // 默认的保留位数

      /* 全屏处理 */
      flag: true
    };
  },
  computed: {
    showMess () {
      return showMess;
    },
    theme () {
      return this.config.theme ? this.config.theme : 'light';
    }
  },
  methods: {
    splitNumber,
    formatNumber,
    /* 在 hover 事件 的运用 */
    getUpToDataData (data) {
      //   console.log("==============", data);
      this.upToData = data;
      // 判定当前 是 涨还是 跌;
      this.upOrDown = this.upToData.rate < 0 ? 'down' : 'up';
    },
    /* 当页面 发生移动 或者 缩放的时候 做的 */
    getChangeData (data) {
      //   console.log("===============", data);
      this.$set(this, 'curData', data[data.length - 1]);
      this.upOrDown = this.curData.rate < 0 ? 'down' : 'up';
    },
    // 刷新当前组件
    refresh (bool) {
      bool = bool == null;
      this.flag = bool;
    },
    initQLStockMarket () {
      const curData = preDealCurData(this.dataGraph, this.curSTT);
      const dataGraph = {
        data: dealData({ ...this.dataGraph, curData }, this.sTt)
      };
      // console.log(dataGraph);
      const QLStockMarketIns = new QLStockMarket({
        selector: '#qlStockMarketK',
        data: {
          kData: dataGraph // this.dataGraph
        },
        config: this.config,
        emit: {
          getUpToDataData: this.getUpToDataData,
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
      this.$set(this, 'QLStockMarketIns', QLStockMarketIns);
      this.decimal = QLStockMarketIns._decimal;
      // console.log(
      //   QLStockMarketIns,
      //   QLStockMarketIns._paintConfig,
      //   this.valueBorder
      // );
    }
  },
  watch: {
    // 在 组件接收 dataGraph 的时候，就已经 将当前 引用对象 赋值了，这时候 行情插件能监听到 set 这个操作
    // dataGraph: {
    //   deep: true,
    //   handler(nv) {
    //     console.log("============");
    //     const me = this;
    //     this.QLStockMarketIns._data = {
    //       // data: nv.data
    //       data: dealData(nv, me.sTt)
    //     };
    //   }
    //   // immediate: true,
    // },
    sTt: {
      deep: true,
      handler (nv) {
        // console.log("============", nv);
        const me = this;
        const curData = preDealCurData(me.dataGraph, this.curSTT);
        this.QLStockMarketIns._data = {
          // data: nv.data
          data: dealData({ ...me.dataGraph, curData }, nv)
        };
        // console.log(this.QLStockMarketIns._data);
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
        });
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
        });
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
          });
        }
      }
    },
    curSTT: {
      deep: true,
      handler (nv) {
        const me = this;
        const curData = preDealCurData(me.dataGraph, nv);
        this.QLStockMarketIns._data = {
          // data: nv.data
          data: dealData({ ...me.dataGraph, curData }, me.sTt)
        };
      }
      // immediate: true,
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
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
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
    },
    sTt: {
      // source 到 target 的转换 ，数组(模拟字典)的格式 ['m1','m5']
      type: Array,
      default: function () {
        return [];
      }
    },
    curSTT: {
      type: Array,
      default: function () {
        return [];
      }
    }
  }
};
</script>
