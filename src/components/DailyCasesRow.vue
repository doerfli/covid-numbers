<template>
  <TableRow :index="index">
    <TableData>{{ day.date }}</TableData>
    <TableData :title="getLastWeekAvgChg()">{{ day.confCases }} / {{ day.confCasesChg }} / {{ day.confCasesChgAvg }}</TableData>
    <TableData>{{ day.currHosp }} / {{ day.currHospChg }}</TableData>
    <TableData>{{ day.currIcu }}  / {{ day.currIcuChg }}</TableData>
    <TableData>{{ day.deceased }} / {{ day.deceasedChg }}</TableData>
  </TableRow>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TableData from '@/components/tables/TableData.vue'
import DailyDataSet from '@/model/dailyDataSet'
import TableRow from '@/components/tables/TableRow.vue'

@Component({
    components: { TableRow, TableData }
  })
  export default class DailyCasesRow extends Vue {
    @Prop()
    private day!: DailyDataSet;
    @Prop({ default: null })
    private lastWeek!: DailyDataSet | null;
    @Prop({ default: null })
    private index!: number | null;

    private getLastWeekAvgChg() {
      if (this.index == 0) {
        return null;
      }
      if (this.lastWeek == null) {
        return null;
      }
      if (this.day.confCasesChgAvg == 0 || this.lastWeek.confCasesChgAvg == 0) {
        return null;
      }
      return (((this.day.confCasesChgAvg - this.lastWeek.confCasesChgAvg)
        / this.lastWeek.confCasesChgAvg) * 100).toFixed(1).concat("%");
    }

  }
</script>

<style scoped>

</style>

