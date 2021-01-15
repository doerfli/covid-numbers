<template>
  <th class="px-2 py-1 text-left dark:bg-teal-700 ">
    <slot></slot>
  </th>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
    components: {}
  })
  export default class TableHeader extends Vue {

  }
</script>

<style scoped>

</style>

