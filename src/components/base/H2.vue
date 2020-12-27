<template>
  <h2 class="text-5xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
    <slot></slot>
  </h2>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H2 extends Vue {

}
</script>

<style scoped>

</style>

