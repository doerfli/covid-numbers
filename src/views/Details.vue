<template>
  <div>
    <H2>Details for canton {{ getCanton }}</H2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import H1 from '@/components/base/H1.vue'
import H2 from '@/components/base/H2.vue'

@Component({
    components: { H2, H1 }
  })
  export default class Details extends Vue {
    @Prop()
    private canton!: string;

    private get getCanton() {
      return this.canton;
    }

  }
</script>

<style scoped>

</style>

