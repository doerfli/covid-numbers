<template>
  <div id="app" class="text-gray-200 p-2">
    <div class="container mx-auto">
      <Header />
      <router-view/>
      <Footer />
    </div>
    <div class="absolute w-full h-full top-0 left-0 flex h-screen bg-gray-700 opacity-80 z-100" v-if="showSpinner()">
      <div class="m-auto flex-col justify-center">
        <div>
          <i class="fas fa-circle-notch fa-6x text-teal-300 fa-spin"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

@Component({
  components: { Footer, Header }
})
export default class App extends Vue {

  private showSpinner(): boolean {
    return this.$store.state.cases.cases.length == 0;
  }

}
</script>

<style lang="scss">

</style>
