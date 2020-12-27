<template>
  <h1 class="text-6xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
    <slot></slot>
  </h1>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H1 extends Vue {

}
</script>

<style scoped>

</style>

