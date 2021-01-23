<template>
  <Table>
    <slot name="header">
      <TableRowHeader>
        <TableHeader>Date</TableHeader>
        <TableHeader>Confirmed cases (Total/Change)</TableHeader>
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
    ></tr>
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
import TableRowHeader from '@/components/tables/TableRowHeader.vue'
import DailyCasesRow from '@/components/DailyCasesRow.vue'

@Component({
  components: { DailyCasesRow, TableRowHeader, TableHeader, TableData, TableRow, Table }
})
export default class CasesTable extends Vue {

  @Prop()
  private canton!: string;

  private get cases(): Array<DailyDataSet> {
    const t = this.$store.state.cases.cases;
    // console.log(t);
    if (t.length === 0) {
      return [];
    }
    // use slice to copy data as reverse is working inplace
    return t.find((x: CantonData) => { return x.canton == this.canton}).data.slice().reverse();
  }

}
</script>

<style scoped>

</style>

