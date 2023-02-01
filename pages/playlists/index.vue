<template>
  <div id="content" class="flexxx w-screen">
    <div v-if="!$store.state.auth.isAuth" class="playlist_header mt-2">
      <div>You need to be connected to view your playlists !</div>
      <div class="mt-2">
        Please <a href="/login" class="font-bold">connect</a> or
        <a href="/register" class="font-bold">register</a> to access this page.
      </div>
    </div>

    <SpotifyAuthLink v-else-if="!is_spotify_linked" />

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
