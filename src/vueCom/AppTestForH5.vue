<template>
  <div class="container">
    <div class="header">
      头部内容
    </div>
    <div class="content">
      <!-- <TimeSharingH5 :dataGraph="dataGraphForTime" :config="configForTime" height="267px"></TimeSharingH5> -->
      <KLineGraphComH5 :dataGraph="dataGraphForK" :config="configForK" height="267px"></KLineGraphComH5>
    </div>
    <div class="btn" @click="click">click</div>
  </div>
</template>
<script>
import { timeSharing, prevPrice, kData } from "../enums/dataJSON";
import { insType } from "../enums";

export default {
  data() {
    return {
      title: "Lorem ipsum dolor sit amet consectetur",
      dataGraphForTime: {
        data: timeSharing,
        preClosePrice: prevPrice
      },
      dataGraphForK: {
        data: kData
      }
    };
  },
  methods: {
    click() {
      console.log(1111111);
      // this.$set(this.dataGraphForTime, "data", timeSharing.slice(0, 100));
      this.$set(this.dataGraphForK,"data",kData.slice(0,50))
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
  width:100%;
  .header{
    line-height:80px;
    border-bottom:1px solid #ddd;
    text-align:center;
  }
  .content{
    padding:0 6px;
    height:267px;
    border-bottom:1px solid #ddd;
  }
}
</style>
