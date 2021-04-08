<template>
  <div id="app" class="text-gray-700 dark:text-gray-200 p-2">
    <div class="container md:mx-auto">
      <Header />
      <router-view/>
      <Footer />
    </div>
    <div class="absolute w-full h-full top-0 left-0 flex h-screen bg-gray-700 opacity-80 z-100" v-if="showSpinner()">
      <div class="m-auto flex-col justify-center">
        <div>
          <i class="fas fa-circle-notch fa-6x text-emerald-600 dark:text-teal-300 fa-spin"></i>
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

  public mounted() {
    console.log("App component mounted");
    this.$store.dispatch("viewProps/init");
    this.$store.dispatch("cases/fetch");
    this.$store.dispatch("vacc/fetch");
  }

  private showSpinner(): boolean {
    return this.$store.state.cases.cases.length == 0;
  }

}
</script>

<style lang="scss">
  body {
    @apply bg-white dark:bg-black;
  }
</style>
