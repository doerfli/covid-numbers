<template>
  <div>
    <div class="text-2xl 2xl:text-pink-600 font-bold py-4">
      The requested page does not exist
    </div>
    <div>
      Go to the <Ref uri="/">Homepage (/)</Ref><br/>
      Go to the <Ref uri="/sitemap.xml">Sitemap (/sitemap.xml)</Ref>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Ref from '@/components/base/Ref.vue'

@Component({
    components: { Ref }
  })
  export default class NotFoundComponent extends Vue {

  }
</script>

<style scoped>

</style>

