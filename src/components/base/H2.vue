<template>
  <h2 class="text-xl lg:text-3xl font-normal leading-normal mt-0 mb-2
             text-gray-900 dark:text-teal-100">
    <slot></slot>
  </h2>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H2 extends Vue {

}
</script>

<style scoped>

</style>

