<template>
  <div class="select-none">
    <i class="far fa-check-square text-emerald-700 dark:text-teal-500 cursor-pointer"
       @click="toggle"
       v-if="isChecked"
    ></i>
    <i class="far fa-square text-indigo-700 dark:text-teal-500 cursor-pointer"
       @click="toggle"
       v-else
    ></i>
    <span>
      {{ displayText }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Checkbox extends Vue {

  @Prop({ default: false })
  private checked!: boolean;
  @Prop()
  private text!: string;

  private get isChecked() {
    return this.checked;
  }

  private get displayText() {
    return this.text;
  }

  private toggle() {
    this.$emit("change")
  }

}
</script>

<style scoped>

</style>

