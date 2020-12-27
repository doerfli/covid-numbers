<template>
  <a :href="getUri"
      class="text-blue-500">
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Ref extends Vue {
  @Prop()
  private uri!: string;

  get getUri(): string {
    return this.uri;
  }
}
</script>

<style scoped>

</style>

