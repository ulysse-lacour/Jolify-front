<template>
  <div id="content" class="flexxx w-screen">
    <DisplayPlaylist :chosen-playlist="chosenPlaylist" />
  </div>
</template>

<script>
import DisplayPlaylist from '~/components/DisplayPlaylist.vue'

export default {
  components: { DisplayPlaylist },

  data() {
    return {
      chosenPlaylist: this.$route.params.playlist
    }
  },

  head() {
    return {
      title: 'Playlist - ' + this.$route.params.playlist
    }
  },

  watch: {},

  methods: {}
}
</script>
