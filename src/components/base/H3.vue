<template>
  <h3 class="text-4xl font-normal leading-normal mt-0 mb-2 text-teal-100">
    <slot></slot>
  </h3>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H3 extends Vue {

}
</script>

<style scoped>

</style>

