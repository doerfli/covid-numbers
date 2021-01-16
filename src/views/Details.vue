<template>
  <div>
    <H2>Details for canton {{ getCanton }}</H2>

    <CasesTable :canton="getCanton" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import H1 from '@/components/base/H1.vue'
import H2 from '@/components/base/H2.vue'
import CasesTable from '@/components/CasesTable.vue'

@Component({
    components: { CasesTable, H2, H1 }
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

