<template>
  <tr class="border-b-2 border-solid dark:border-teal-500 text-left">
    <slot></slot>
  </tr>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TableRowHeader extends Vue {

}
</script>

<style scoped>

</style>

