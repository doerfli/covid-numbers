<template>
  <tr v-bind:class="{
    'dark:bg-teal-900': this.index % 2 === 1,
    'dark:bg-black': this.index % 2 === 0
  }">
    <slot></slot>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: {}
  })
  export default class TableRow extends Vue {
    @Prop({ default: null })
    private index!: number | null;
  }
</script>

<style scoped>

</style>

