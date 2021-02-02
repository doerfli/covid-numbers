<template>
  <h1 class="text-2xl lg:text-3xl font-bold leading-normal mt-0 mb-2
             text-emerald-800 dark:text-teal-100">
    <slot></slot>
  </h1>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H1 extends Vue {

}
</script>

<style scoped>

</style>

