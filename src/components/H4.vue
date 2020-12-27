<template>
  <h4 class="text-3xl font-normal leading-normal mt-0 mb-2 text-indigo-800">
    <slot></slot>
  </h4>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class H4 extends Vue {

}
</script>

<style scoped>

</style>

