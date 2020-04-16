<template>
  <div class="container">
    <div class="header">头部内容</div>
    <div class="content">
      <TimeSharingH5 :dataGraph="dataGraphForTime" :config="configForTime" :height="height" :width="width"></TimeSharingH5>
      <!-- <KLineGraphComH5 :dataGraph="dataGraphForK" :config="configForK" :height="height" :width="width" :sTt="sTt"></KLineGraphComH5> -->
    </div>
    <div class="btn" @click="click">click</div>
    <div class="btn" @click="changeSize">全屏处理</div>
  </div>
</template>
<script>
import { timeSharing, prevPrice, kData } from "../../src/enums/dataJSON";
import { insType } from "../../src/enums";

// k线周期 转换的数据
import { mData, dData } from "../../src/transformCal/response";

export default {
  data() {
    return {
      title: "Lorem ipsum dolor sit amet consectetur",
      dataGraphForTime: {
        data: timeSharing,
        preClosePrice: prevPrice
      },
      dataGraphForK: {
        data: dData //mData//kData
      },
      sTt: ["d", "w"],
      /* 全屏的 处理 */
      height: "267px",
      width: "100%"
    };
  },
  methods: {
    click() {
      // this.$set(this.dataGraphForTime, "data", timeSharing.slice(0, 100));
      this.$set(this.dataGraphForK, "data", kData.slice(0, 500));
      this.isShow = !this.isShow;

      this.sTt = this.isShow ? [] : ["d", "w"];
    },
    changeSize() {
      this.height = "400px";
      // this.width = "300px";
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
        theme: "light"
      };
    }
  }
};
</script>
<style lang="scss">
:global .container {
  width: 100%;
  .header {
    line-height: 80px;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
  .content {
    padding: 0 6px;
    height: 267px;
    border-bottom: 1px solid #ddd;
  }
}
</style>
