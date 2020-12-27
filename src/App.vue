<template>
  <div id="app">
    <div class="md:container md:mx-auto">
      <Header />
      <router-view/>
      <Footer />
    </div>
  </div>
</template>

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

<style lang="scss">

</style>
