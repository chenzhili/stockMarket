<template>
  <div :style="{width:width,height:height}">
    
  </div>
</template>
<script>
import styles from "./timeSharing.scss";

export default {
  name: "TimeSharing",
  data:function(){
      return {
          styles,
          
          stockMarketMess:{},//存储 所有的 动态 走势 信息
          QLStockMarketIns:null,//存储 实例化的 走势 对象
      }
  },
  created(){
      console.log(this.$emit);//用这个进行 子组件向 父组件 传值
  },
  props: {
    width:{
        type:String,
        default:"100%",
    },
    height:{
        type:String,
        default:"100%"
    },
    data:{
        type:Object,
        default:function(){
            return {};
        }
    },
    config:{
        type:Object,
        default:function(){
            return {};
        }
    }
  }
};
</script>

