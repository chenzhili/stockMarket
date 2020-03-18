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
      value: ""
    };
  },
  computed: {},
  methods: {
      changeInput(e) {
        console.log(e.target.value);
        this.value = e.target.value;
      }
  },
  watch: {},
  async mounted() {},
  destroyed() {},
  props: {}
};
</script>
<style lang="scss" scoped>
</style>>