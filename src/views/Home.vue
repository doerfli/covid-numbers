<template>
  <div class="home">
    Hello
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class Home extends Vue {

  public mounted() {
    console.log("Home.mounted");
    this.$store.dispatch("cases/fetchZh");
  }

}
</script>
