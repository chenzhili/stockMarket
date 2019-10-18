<template>
  <div class="container">
    <h2 class="title">{{title}}</h2>
    <div class="content">
        <div class="left">
            左侧内容：Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis perspiciatis provident, necessitatibus quae labore, similique id dignissimos sit mollitia vero ullam repudiandae veniam molestias, ratione possimus magnam nihil nobis enim.
        </div>
        <div class="main">
            <TimeSharing title="ceshi"></TimeSharing>
        </div>
        <div class="right">
            右侧内容：Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam nobis ullam voluptate. A maxime autem velit ducimus quos modi, natus esse molestias id officia inventore odit doloribus quod maiores deserunt?
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title:"Lorem ipsum dolor sit amet consectetur",
      }
    },
  }
</script>
<style lang="scss">
    :global .container{
        border:1px solid #ddd;
        height:100%;
        .title{
            text-align:center;
        }
        .content{
            display:flex;
            height:100%;
            align-items:flex-start;
            text-align:center;
            .main{
                width:578px;
                height:555px;
                border:1px solid #f00;
            }
            .left,.right{
                flex:2
            }
        }
    }
</style>
