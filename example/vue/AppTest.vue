<template>
  <div class="container">
    <h2 class="title">{{title}}</h2>
    <div class="content">
      <div class="left">
        左侧内容：Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis provident, necessitatibus quae labore, similique id dignissimos sit mollitia vero ullam repudiandae veniam molestias, ratione possimus magnam nihil nobis enim.
        <div class="btn" @click="click">点击</div>
      </div>
      <div class="main">
        <!-- <TimeSharing :dataGraph="dataGraphForTime" :config="configForTime"></TimeSharing> -->
        <KLineGraphCom :dataGraph="dataGraphForK" :config="configForK" :sTt="sTt"></KLineGraphCom>
      </div>
      <div
        class="right"
      >右侧内容：Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam nobis ullam voluptate. A maxime autem velit ducimus quos modi, natus esse molestias id officia inventore odit doloribus quod maiores deserunt?</div>
    </div>
  </div>
</template>
<script>
import { timeSharing, prevPrice, kData } from "../../src/enums/dataJSON";
import { insType } from "../../src/enums";

import { mData, dData } from "../../src/transformCal/response";

var test = [{"amount":"3083589.00","close":"0.2930","datetime":"20200204","high":"0.2960","leavesqty":"0","low":"0.2205","open":"0.2205","position":"703","presettlepx":"0.2180","settleprice":"0.2930","status":"0","volume":"1117","date":"20200204","dealMount":"1117","rate":1.328798185941043},{"amount":"3464529.00","close":"0.3030","datetime":"20200205","high":"0.3203","leavesqty":"703","low":"0.2878","open":"0.2998","position":"1140","presettlepx":"0.2930","settleprice":"0.3030","status":"0","volume":"1131","date":"20200205","dealMount":"1131","rate":1.0341296928327646},{"amount":"2246949.00","close":"0.3435","datetime":"20200206","high":"0.3660","leavesqty":"1140","low":"0.3044","open":"0.3150","position":"1192","presettlepx":"0.3030","settleprice":"0.3435","status":"0","volume":"674","date":"20200206","dealMount":"674","rate":1.1336633663366338},{"amount":"1644973.00","close":"0.3477","datetime":"20200207","high":"0.3477","leavesqty":"1192","low":"0.3198","open":"0.3313","position":"1103","presettlepx":"0.3435","settleprice":"0.3471","status":"0","volume":"500","date":"20200207","dealMount":"500","rate":1.0122270742358077},{"amount":"832197.00","close":"0.3378","datetime":"20200210","high":"0.3480","leavesqty":"1335","low":"0.3250","open":"0.3332","position":"1372","presettlepx":"0.3471","settleprice":"0.3399","status":"0","volume":"246","date":"20200210","dealMount":"246","rate":0.9715271786022432},{"amount":"2122405.00","close":"0.3655","datetime":"20200211","high":"0.3752","leavesqty":"1372","low":"0.3453","open":"0.3513","position":"1371","presettlepx":"0.3399","settleprice":"0.3700","status":"0","volume":"575","date":"20200211","dealMount":"575","rate":1.082001184132623},{"amount":"1334848.00","close":"0.3743","datetime":"20200212","high":"0.3793","leavesqty":"1371","low":"0.3569","open":"0.3569","position":"1202","presettlepx":"0.3700","settleprice":"0.3830","status":"0","volume":"361","date":"20200212","dealMount":"361","rate":1.024076607387141},{"amount":"1438025.00","close":"0.3630","datetime":"20200213","high":"0.3902","leavesqty":"1480","low":"0.3581","open":"0.3775","position":"1559","presettlepx":"0.3830","settleprice":"0.3690","status":"0","volume":"384","date":"20200213","dealMount":"384","rate":0.969810312583489},{"amount":"1055422.00","close":"0.3850","datetime":"20200214","high":"0.3881","leavesqty":"1559","low":"0.3637","open":"0.3637","position":"1204","presettlepx":"0.3690","settleprice":"0.3850","status":"0","volume":"278","date":"20200214","dealMount":"278","rate":1.0606060606060606},{"amount":"2194930.00","close":"0.4379","datetime":"20200217","high":"0.4441","leavesqty":"1498","low":"0.3880","open":"0.3880","position":"1548","presettlepx":"0.3850","settleprice":"0.4390","status":"0","volume":"534","date":"20200217","dealMount":"534","rate":1.1374025974025974},{"amount":"1719795.00","close":"0.4165","datetime":"20200218","high":"0.4381","leavesqty":"1548","low":"0.4072","open":"0.4350","position":"1605","presettlepx":"0.4390","settleprice":"0.4165","status":"0","volume":"406","date":"20200218","dealMount":"406","rate":0.951130395067367},{"amount":"1079323.00","close":"0.4154","datetime":"20200219","high":"0.4385","leavesqty":"1605","low":"0.4107","open":"0.4179","position":"1631","presettlepx":"0.4165","settleprice":"0.4188","status":"0","volume":"253","date":"20200219","dealMount":"253","rate":0.997358943577431},{"amount":"3273500.00","close":"0.4672","datetime":"20200220","high":"0.4710","leavesqty":"1631","low":"0.4156","open":"0.4245","position":"1689","presettlepx":"0.4188","settleprice":"0.4672","status":"0","volume":"739","date":"20200220","dealMount":"739","rate":1.124699085219066},{"amount":"1841667.00","close":"0.4599","datetime":"20200221","high":"0.4896","leavesqty":"1689","low":"0.4550","open":"0.4698","position":"1702","presettlepx":"0.4672","settleprice":"0.4599","status":"0","volume":"397","date":"20200221","dealMount":"397","rate":0.9843749999999999},{"amount":"1830710.00","close":"0.4180","datetime":"20200224","high":"0.4566","leavesqty":"1702","low":"0.4148","open":"0.4398","position":"1764","presettlepx":"0.4599","settleprice":"0.4240","status":"0","volume":"424","date":"20200224","dealMount":"424","rate":0.908893237660361},{"amount":"1831153.00","close":"0.4063","datetime":"20200225","high":"0.4100","leavesqty":"1764","low":"0.3710","open":"0.3842","position":"1755","presettlepx":"0.4240","settleprice":"0.4063","status":"0","volume":"463","date":"20200225","dealMount":"463","rate":0.9720095693779904},{"amount":"4427993.00","close":"0.4034","datetime":"20200226","high":"0.4263","leavesqty":"1755","low":"0.3700","open":"0.3869","position":"1799","presettlepx":"0.4063","settleprice":"0.4034","status":"0","volume":"1082","date":"20200226","dealMount":"1082","rate":0.9928624169333005}];
console.log(test);

export default {
  data() {
    return {
      title: "Lorem ipsum dolor sit amet consectetur",
      dataGraphForTime: {
        data: timeSharing,
        preClosePrice: prevPrice
      },
      dataGraphForK: { 
        data: test//mData.slice(0,50)//dData //mData//kData
      },
      sTt: [],
      isShow: true
    };
  },
  methods: {
    click() {
      // this.$set(this.dataGraphForTime, "data", timeSharing.slice(0, 100));
      this.$set(this.dataGraphForK, "data", mData.slice(0, 500));
      this.isShow = !this.isShow;

      this.sTt = this.isShow ? [] : ["m1", "m5"];
    }
  },
  computed: {
    configForTime() {
      return {
        insType: insType.timeSharingDiagram,
        theme: "light"
      };
    },
    configForK() {
      return {
        insType: insType.kLineGraph,
        theme: "light",
        // initShowN:40
      };
    }
  }
};
</script>
<style lang="scss">
:global .container {
  border: 1px solid #ddd;
  height: 100%;
  .btn {
    padding: 4px 6px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .title {
    text-align: center;
  }
  .content {
    display: flex;
    height: 100%;
    align-items: flex-start;
    text-align: center;
    .main {
      width: 578px;
      height: 555px;
      border: 1px solid #f00;
    }
    .left,
    .right {
      flex: 2;
    }
  }
}
</style>
