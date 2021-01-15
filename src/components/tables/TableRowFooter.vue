<template>
  <tr class="border-t-2 border-solid border-indigo-400 text-left">
    <slot></slot>
  </tr>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class TableRowFooter extends Vue {

}
</script>

<style scoped>

</style>

