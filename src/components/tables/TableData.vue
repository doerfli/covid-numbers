<template>
  <td class="px-2 py-1">
    <slot></slot>
  </td>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TableData extends Vue {

}
</script>

<style scoped>

</style>

