<template>
  <div class="bg-gray-800 p-2">
    <div class="flex flex-wrap">
      <div class="py-2 pr-2">Cantons: </div>
      <div v-for="canton in cantons"
           :key="canton.name"
           class="pr-3 py-2"
           >
        <input type="checkbox" :checked="canton.show" @change="toggle(canton.name)" class="mr-0.5"/>
        {{ canton.name }}
      </div>
    </div>
    <div class="p-2 text-sm inline-block text-blue-500" @click="selectAll()">Select all</div>
    <div class="p-2 text-sm inline-block text-blue-500" @click="selectNone()">Select none</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CantonConfig from '@/model/cantonconfig'

@Component({
  components: {}
})
export default class ViewOptions extends Vue {

  private get cantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons;
  }

  private toggle(canton: string) {
    this.$store.dispatch("viewProps/toggleCanton", { canton: canton });
  }

  private selectAll() {
    this.$store.dispatch("viewProps/selectAll");
  }

  private selectNone() {
    this.$store.dispatch("viewProps/selectNone");
  }

}
</script>

<style scoped>

</style>

