<template>
  <div>
    <h1>初始 测试 vue {{value}}</h1>
    <input  v-model="value"/><!--  @input="changeInput" -->
  </div>
</template>
<script>
export default {
  name: 'VueTest',
  data: function() {
    return {
      value: "111"
    };
  },
  computed: {},
  methods: {
      changeInput(e) {
        console.log(e.target.value);
        this.value = e.target.value;
      }
  },
  mounted() {
    console.log(this);
  },
  watch: {},
  destroyed() {},
  props: {}
};
</script>
<style lang="scss" scoped>
</style>>