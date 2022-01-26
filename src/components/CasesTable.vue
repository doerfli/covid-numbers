<template>
  <Table>
    <slot name="header">
      <TableRowHeader>
        <TableHeader>Date</TableHeader>
        <TableHeader>Confirmed cases (Total/Change/Average)</TableHeader>
        <TableHeader>Hospitalized (Current/Change)</TableHeader>
        <TableHeader>Icu (Current/Change)</TableHeader>
        <TableHeader>Deceased (Total/Change)</TableHeader>
      </TableRowHeader>
    </slot>
    <tr is="daily-cases-row"
      v-for="(day,idx) in cases"
      v-bind:key="day.date"
      v-bind:index="idx"
      :day="day"
      :last-week="getLastWeek(cases, idx)"
    ></tr>
  </Table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import CantonData from '@/model/cantondata'
import Table from '@/components/tables/Table.vue'
import TableRow from '@/components/tables/TableRow.vue'
import TableData from '@/components/tables/TableData.vue'
import DataSetEntity from '@/model/dataSetEntity'
import TableHeader from '@/components/tables/TableHeader.vue'
import TableRowHeader from '@/components/tables/TableRowHeader.vue'
import DailyCasesRow from '@/components/DailyCasesRow.vue'

@Component({
  components: { DailyCasesRow, TableRowHeader, TableHeader, TableData, TableRow, Table }
})
export default class CasesTable extends Vue {

  @Prop()
  private canton!: string;
  @Prop()
  private rowsToRender!: number;

  private get cases(): Array<DataSetEntity> {
    const t = this.$store.state.cases.cases;
    // console.log(t);
    if (t.length === 0) {
      return [];
    }
    // use slice to copy data as reverse is working inplace
    const dt = t.find((x: CantonData) => { return x.canton == this.canton}).data;
    return dt.slice(Math.max(-dt.length, -this.rowsToRender)).reverse();
  }

  private getLastWeek(cases: Array<DataSetEntity>, currIdx: number): DataSetEntity | null {
    if (currIdx + 7 >= cases.length) {
      return null;
    }
    return cases[currIdx + 7];
  }

}
</script>

<style scoped>

</style>

