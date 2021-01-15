<template>
  <td class="p-2 bg-indigo-100">
    <slot></slot>
  </td>
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

