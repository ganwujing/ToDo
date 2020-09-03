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
  background-size: 100vw;
  background-repeat: repeat-y;
  height: 100vh;
  position: relative;
}
.showindex{
  z-index: 100;
  width: 100vw;
  position: absolute;
  
}
.showtodo{
  z-index: 105;
  position: absolute;
}


</style>
