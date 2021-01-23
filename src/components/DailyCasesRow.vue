<template>
  <TableRow :index="index">
    <TableData>{{ day.date }}</TableData>
    <TableData>{{ day.confCases }} / {{ day.confCasesChg }} / {{ day.confCasesChgAvg }}</TableData>
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
    private index!: number | null;
  }
</script>

<style scoped>

</style>

