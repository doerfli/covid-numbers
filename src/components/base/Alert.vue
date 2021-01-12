<template>
  <div class="my-4">
    <div class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-pink-500 dark:bg-pink-600">
      <span class="text-xl inline-block mr-3 align-middle">
        <i class="fas fa-exclamation-circle"></i>
      </span>
          <span class="inline-block align-middle mr-8">
        <b class="capitalize mr-1">{{ getTitle }}</b> {{ getText }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Alert extends Vue {

  @Prop()
  private title!: string;
  @Prop()
  private text!: string;

  private get getTitle() {
    return this.title;
  }

  private get getText() {
    return this.text;
  }

}
</script>

<style scoped>

</style>

