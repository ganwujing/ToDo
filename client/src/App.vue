<template>
  <div id="app">
    <index class="showindex"></index>
    <!--路由匹配的组件渲染到这里-->
     <router-view class="showtodo"></router-view>
  </div>
</template>

<script>
import index from './components/index.vue'

export default {
  name: 'App',
  components: {
    index,
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: url('../src/assets/bg2.png');
  background-size: 100vw;
  background-repeat: repeat-y;
  height: 100vh;
}
.showindex{
  z-index: 100;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.showtodo{
  z-index: 105;
  position: absolute;
}


</style>
