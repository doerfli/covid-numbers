<template>
  <div id="app" class="text-gray-200 p-2">
    <div class="container mx-auto">
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
