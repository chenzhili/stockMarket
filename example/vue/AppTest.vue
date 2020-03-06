<template>
  <div class="container">
    <h2 class="title">{{title}}</h2>
    <div class="content">
      <div class="left">
        左侧内容：Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis provident, necessitatibus quae labore, similique id dignissimos sit mollitia vero ullam repudiandae veniam molestias, ratione possimus magnam nihil nobis enim.
        <div class="btn" @click="click">点击切换日k和周K</div>
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

export default {
  data() {
    return {
      title: "Lorem ipsum dolor sit amet consectetur",
      dataGraphForTime: {
        data: timeSharing.slice(0, 50),
        preClosePrice: prevPrice
      },
      dataGraphForK: {
        data: dData //.slice(0,50)//dData //mData//kData
      },
      sTt: [
        /* "m1", "m5" */
        "d", "w"
      ],
      isShow: true
    };
  },
  methods: {
    click() {
      // this.$set(this.dataGraphForTime, "data", timeSharing.slice(0, 100));
      this.$set(this.dataGraphForK, "data", dData.slice(0, 500));
      this.isShow = !this.isShow;

      this.sTt = this.isShow ? [] : ["d", "w"];
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
        initShowN: 40
        // rectLineHeight:1
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
