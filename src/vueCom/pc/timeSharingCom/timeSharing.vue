<template>
  <div :style="{width:width,height:height}" :class="styles.container">
    <div :class="styles.leftMess">
      <template v-if="QLStockMarketIns._paintConfig.valueRange.actuallyValue.length" v-for="(item,index) of QLStockMarketIns._paintConfig.valueRange.actuallyValue">
        <span
          :class="[styles.valueItem,{[styles.downColor]:index>valueBorder,[styles.upColor]:index<valueBorder}]"
          :key="index"
          :style="{top:`${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px`}"
        >{{item}}</span>
      </template>
    </div>
    <div :class="styles.content">
      <div :class="styles.marketMess">
        <span>{{upToData.time || curData.time}}</span>
        <span>现价:<span :class="{[styles.downColor]:upOrDown === 'down',[styles.upColor]:upOrDown === 'up'}">{{splitNumber(upToData.curPrice || curData.curPrice)}}</span></span>
        <span>均价:<span :class="{[styles.downColor]:upOrDown === 'down',[styles.upColor]:upOrDown === 'up'}">{{splitNumber(upToData.avPrice || curData.avPrice)}}</span></span>
        <span>涨跌:<span :class="{[styles.downColor]:upOrDown === 'down',[styles.upColor]:upOrDown === 'up'}">{{splitNumber(upToData.rate || curData.rate)}}</span></span>
        <span>涨幅:<span :class="{[styles.downColor]:upOrDown === 'down',[styles.upColor]:upOrDown === 'up'}">{{splitNumber(upToData.rate || curData.rate)}}%</span></span>
        <span>量:<span :class="{[styles.downColor]:upOrDown === 'down',[styles.upColor]:upOrDown === 'up'}">{{splitNumber(upToData.dealMount || curData.dealMount)}}</span></span>
        <span>额:<span :class="{[styles.downColor]:upOrDown === 'down',[styles.upColor]:upOrDown === 'up'}">{{splitNumber(upToData.totalMoney || curData.totalMoney)}}</span></span>
      </div>
      <div :class="styles.qlContainer" id="qlStockMarket">
        <div v-if="upToData.curPrice" :class="styles.updateValue" :style="{background:'#f00',top:upToData.actuallyY+'px'}">{{upToData.curPrice}}</div>
        <div v-if="upToData.rate" :class="styles.updateRate" :style="{background:'#f00',top:upToData.actuallyY+'px'}">{{splitNumber(upToData.rate)}}%</div>
        <div
          :class="styles.dealMount"
          :style="{top:QLStockMarketIns._paintConfig.dealMountPos+'px'}"
        >成交量:{{splitNumber(upToData.dealMount || curData.dealMount)}}</div>
      </div>
      <div :class="styles.marketTime">
        <template v-for="(item,index) of QLStockMarketIns._paintConfig.paintTimeX">
          <span
            :class="styles.marketTimeItem"
            :key="index"
            :style="{left:item+'px'}"
          >{{timeArr[index]}}</span>
        </template>
      </div>
    </div>
    <div :class="styles.rightMess">
      <template v-if="QLStockMarketIns._paintConfig.valueRange.factorInc.length" v-for="(item,index) of QLStockMarketIns._paintConfig.valueRange.factorInc">
        <span
          :class="[styles.valueItem,{[styles.downColor]:index>valueBorder,[styles.upColor]:index<valueBorder}]"
          :key="index"
          :style="{top:`${QLStockMarketIns._paintConfig.valueRange.valueYPos[index] || 0}px`}"
        >{{item+"%"}}</span>
      </template>
      <template v-if="QLStockMarketIns._paintConfig.dealRange.actuallyValue.length" v-for="(item,index) of QLStockMarketIns._paintConfig.dealRange.actuallyValue">
        <span
          :class="[styles.valueItem]"
          :key="QLStockMarketIns._paintConfig.valueRange.factorInc.length+index"
          :style="{top:`${QLStockMarketIns._paintConfig.dealRange.valueYPos[QLStockMarketIns._paintConfig.dealRange.valueYPos.length-1-index] || 0}px`}"
        >{{splitNumber(item)}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import styles from "./timeSharing.scss";

import QLStockMarket from "../../../core";
import {splitNumber} from "../../../utils/index"

// 外部传进来
import { timeSharing, prevPrice, kData } from "../../../enums/dataJSON";
import { insType } from "../../../enums";

const timeArr = ["09:30", "10:30", "11::30/13:00", "14:00", "15:00"];

console.log(styles);
export default {
  name: "TimeSharing",
  data: function() {
    return {
      styles,

      curData:{},
      timeArr,
      stockMarketMess: {}, //存储 所有的 动态 走势 信息
      QLStockMarketIns: {
        _paintConfig: {
          paintTimeX: [],
          valueRange: {
            actuallyValue: [],
            valueYPos: [],
            factorInc:[]
          },
          dealRange:{
            actuallyValue: [],
            valueYPos: [],
          }
        }
      }, //存储 实例化的 走势 对象
      valueBorder:null,
      upToData:{},//时时数据
      upOrDown:false,//看看当前 是 涨还是跌
    };
  },
  computed:{
    
  },
  methods:{
    splitNumber,
    getUpToDataData(data){
      // console.log("==============",data);
      this.upToData = data;
      // 判定当前 是 涨还是 跌;
      this.upOrDown = this.upToData.rate<0?'down':'up';
    }
  },
  async mounted() {
    // console.log(this.$emit); //用这个进行 子组件向 父组件 传值
    let QLStockMarketIns = new QLStockMarket({
      selector: "#qlStockMarket",
      data: {
        chartData: {
          data: timeSharing,
          preClosePrice: prevPrice
        }
      },
      config: {
        insType: insType.timeSharingDiagram,
        theme: "light",
      },
      emit:{
          getUpToDataData:this.getUpToDataData
      }
    });

    let {Theme} = await import("../../../enums");
    console.log(Theme);

    this.valueBorder = Math.ceil(QLStockMarketIns._paintConfig.valueRange.actuallyValue.length/2) -1;
    this.$set(this, "QLStockMarketIns", QLStockMarketIns);
    this.$set(this,"curData",QLStockMarketIns._data.data[QLStockMarketIns._data.data.length-1]);
    // 判定当前 是 涨还是 跌;
    this.upOrDown = this.curData.rate<0?'down':'up';
    console.log(this.QLStockMarketIns,QLStockMarketIns._paintConfig);
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
    data: {
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

