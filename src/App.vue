<template>
  <div id="app">
    <Header />
    <router-view/>
    <Footer />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import Vue from 'vue'
import Header from '@/components/Header'
import { Component } from 'vue-property-decorator'
import Footer from '@/components/Footer'

@Component({
  components: { Footer, Header }
})
export default class App extends Vue {
}
</script>
