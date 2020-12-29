<template>
  <div :class="getClasses()">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
    components: {}
  })
  export default class Hideable extends Vue {
    @Prop({default: true})
    private visible!: boolean;

    private getClasses(): string {
      if (this.visible) {
        return "visible";
      } else {
        return "invisible h-0";
      }
    }
  }
</script>

<style scoped>

</style>

