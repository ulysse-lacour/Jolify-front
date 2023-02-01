<template>
  <main>
    <FontAwesomeIcon
      icon="fa-solid fa-house"
      size="2x"
      @click="$router.push('/home')"
    />
  </main>
</template>

<script>
export default {
  components: {},

  head() {
    return {
      title: this.$config.app.title + this.$config.app.titleSeparator + 'soon',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$config.app.description
        }
      ]
    }
  }
}
</script>

<style scoped></style>
