<template>
  <Table>
    <slot name="header">
      <TableHeader>Date</TableHeader>
      <TableHeader>Confirmed cases</TableHeader>
      <TableHeader>Hospitalized</TableHeader>
      <TableHeader>Icu</TableHeader>
      <TableHeader>Deceased</TableHeader>
    </slot>
    <TableRow
      v-for="(day,idx) in cases"
      v-bind:key="day.date"
      v-bind:index="idx"
    >
      <TableData>{{ day.date }}</TableData>
      <TableData>{{ day.confCases }}</TableData>
      <TableData>{{ day.currHosp }}</TableData>
      <TableData>{{ day.currIcu }}</TableData>
      <TableData>{{ day.deceased }}</TableData>
    </TableRow>
  </Table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import CantonData from '@/model/cantondata'
import Table from '@/components/tables/Table.vue'
import TableRow from '@/components/tables/TableRow.vue'
import TableData from '@/components/tables/TableData.vue'
import DailyDataSet from '@/model/dailyDataSet'
import TableHeader from '@/components/tables/TableHeader.vue'

@Component({
  components: { TableHeader, TableData, TableRow, Table }
})
export default class CasesTable extends Vue {

  @Prop()
  private canton!: string;

  get cases(): Array<DailyDataSet> {
    const t = this.$store.state.cases.cases;
    // console.log(t);
    if (t.length === 0) {
      return [];
    }
    return t.find((x: CantonData) => { return x.canton == this.canton}).data.reverse();
  }

}
</script>

<style scoped>

</style>

