<template>
  <div id="content" class="flexxx w-screen">
    <SpotifyAuthLink v-if="!is_spotify_linked" />

    <DisplayPlaylists v-else />
  </div>
</template>

<script>
// COMPONENTS IMPORTS
import DisplayPlaylists from './DisplayPlaylists/index.vue'
import SpotifyAuthLink from '~/components/SpotifyAuthLink.vue'

// GRAPHQL IMPORTS
import WhoamI from '~/gql/WhoAmI.gql'

export default {
  components: { SpotifyAuthLink, DisplayPlaylists },

  middleware: 'isAuth',

  data() {
    return {
      error: false,
      loading: true,
      is_spotify_linked: false
    }
  },

  head() {
    return {
      title:
        this.$config.app.title + this.$config.app.titleSeparator + 'playlists',

      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$config.app.description
        }
      ]
    }
  },

  mounted() {
    this.IsSpotifyLinked()
  },

  methods: {
    async IsSpotifyLinked() {
      try {
        this.loading = true
        await this.$apollo
          .query({
            query: WhoamI
          })
          .then(({ data }) => {
            this.loading = false
            this.is_spotify_linked = data.whoami.hasSpotifyToken
          })
          .catch(error => {
            this.loading = false
            this.error = error
          })
      } catch (e) {
        this.loading = false
        this.error = e
      }
    }
  }
}
</script>
