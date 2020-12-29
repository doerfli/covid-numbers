<template>
  <div>
    Choose which cantons to show
    <div class="flex flex-wrap">
      <div v-for="canton in cantons"
           :key="canton.name"
           class="p-2"
           >
        <input type="checkbox" :checked="canton.show" @change="toggle(canton.name)"/>
        {{ canton.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CantonConfig from '@/model/cantonconfig'

@Component({
  components: {}
})
export default class CantonSelect extends Vue {

  private get cantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons;
  }

  private toggle(canton: string) {
    this.$store.dispatch("viewProps/toggleCanton", { canton: canton });
  }

}
</script>

<style scoped>

</style>

