<template>
  <table class="border-collapse table-auto w-full">
    <thead>
      <slot name="header"></slot>
    </thead>
    <tbody>
      <slot></slot>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
    components: {}
  })
  export default class Table extends Vue {

  }
</script>

<style scoped>

</style>

