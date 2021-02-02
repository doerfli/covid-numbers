<template>
  <h2 class="text lg:text-lg font-normal leading-normal mt-0 mb-2
             text-emerald-800 dark:text-teal-100">
    <slot></slot>
  </h2>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H3 extends Vue {

}
</script>

<style scoped>

</style>

