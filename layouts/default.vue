<template>
  <div id="__default">
    <HeaderComponent />
    <Nuxt />
  </div>
</template>

<script>
import { canonical, facebook, twitter, appLdJson } from '~/utils/getHeadData'
import HeaderComponent from '~/components/HeaderComponent.vue'

export default {
  components: { HeaderComponent },

  head() {
    const { path } = this.$route

    return {
      meta: [...facebook(path), ...twitter()],

      link: [...canonical(path)],

      script: [...appLdJson(path)]
    }
  }
}
</script>
