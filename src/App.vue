<template>
  <div id="app">
    <router-view/>
    <div class="navgitor">
      <div v-for="item in nav" :key="item.value" @click="handleRouter(item.value)">{{ item.label }}</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      nav: [
        {
          label: '4326',
          value: '4326'
        },
        {
          label: '3857',
          value: '3857',
        },
        {
          label: '弹出坐标',
          value: 'mouse-click',
        },
        {
          label: '显示坐标',
          value: 'mouse-move',
        },
        {
          label: '绘制',
          value: 'draw',
        },
        {
          label: 'GeoJSON',
          value: 'vector-layer',
        },
        {
          label: '修改层级/服务样式',
          value: 'index',
        },
        {
          label: '行政区分级',
          value: 'cover',
        },
      ],
    }
  },
  methods: {
    handleRouter(name) {
      this.$router.push({ name: name })
    },
  },
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}
.navgitor {
  position: absolute;
  top: 30%;
  right: 50px;
  color: red;
  border: 1px solid black;
  padding: 20px;
  background: #fff;
  div {
    cursor: pointer;
    margin-bottom: 20px;
  }
}
</style>
