<template>
  <div class="container" ref="container">
    <div class="header">头部内容</div>
    <div
      class="content"
      :class="full?'active-full':''"
      :style="{transformOrigin:totalWidth/2 + 'px',width:width,height:height}"
    >
      <!-- <TimeSharingH5
        :dataGraph="dataGraphForTime"
        :config="configForTime"
        :height="height"
        :width="width"
      ></TimeSharingH5>-->
      <KLineGraphComH5
        :dataGraph="dataGraphForK"
        :config="configForK"
        :height="height"
        :width="width"
        :sTt="sTt"
        :curSTT="curSTT"
      ></KLineGraphComH5>
    </div>
    <div class="btn" @click="click">click</div>
    <div class="btn" @click="changeSize">全屏处理</div>
  </div>
</template>
<script>
import { timeSharing, prevPrice, kData } from '../../src/enums/dataJSON';
import { insType } from '../../src/enums';

// console.log(mData)
// k线周期 转换的数据
import { mData, dData } from '../response';

export default {
  data () {
    return {
      title: 'Lorem ipsum dolor sit amet consectetur',
      dataGraphForTime: {
        data: timeSharing,
        preClosePrice: prevPrice
      },
      dataGraphForK: {
        data: mData, // dData //mData//kData
        curData: mData.slice(0, 20)
      },
      sTt: ['m1', 'm15'],
      curSTT: [],
      /* 全屏的 处理 */
      height: '267px',
      width: '100%',

      /* 屏幕宽高 */
      totalHeight: 0,
      totalWidth: 0,
      full: false
    };
  },
  methods: {
    click () {
      // this.$set(this.dataGraphForTime, "data", timeSharing.slice(0, 100));
      // this.$set(this.dataGraphForK, "data", kData.slice(0, 500));
      // this.isShow = !this.isShow;

      this.sTt = this.isShow ? [] : ['m1', 'm60'];
      this.curSTT = ['m1', 'm5'];
    },
    changeSize () {
      // this.height = "400px";
      // this.width = "300px";
      console.log(this.totalHeight, this.totalWidth);
      this.full = true;
      this.width = this.totalHeight + 'px';
      this.height = this.totalWidth + 'px';
    }
  },
  mounted () {
    console.log(this.$refs.container);
    this.totalHeight = this.$refs.container.offsetHeight;
    this.totalWidth = this.$refs.container.offsetWidth;
  },
  computed: {
    configForTime () {
      return {
        insType: insType.timeSharingDiagram,
        theme: 'light'
      };
    },
    configForK () {
      return {
        insType: insType.kLineGraph,
        theme: 'light'
      };
    }
  }
};
</script>
<style lang="scss" scoped>
:global .container {
  width: 100%;
  height: 100%;
  .header {
    line-height: 80px;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
  .content {
    // padding: 0 6px;
    height: 267px;
    border-bottom: 1px solid #ddd;
  }

  /* 全屏处理 */
  .active-full {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: rotate(90deg);
    z-index: 99;
    padding-left: 0;
  }
}
</style>
