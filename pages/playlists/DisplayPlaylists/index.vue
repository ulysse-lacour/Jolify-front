<template>
  <div v-if="playlists" id="display_playlist" class="flexxx w-full">
    <div
      v-if="error == 'Account not accepted.'"
      class="text-center font-bold text-xl"
    >
      <h1>Your account is waiting for approval by an admin.</h1>
      <h2>
        The app is currently in beta mode and approval must be made manually.
      </h2>
    </div>
    <span v-else-if="error" class="error text-red-600">{{ error }}</span>

    <div v-else-if="playlists" class="flex-head w-screen">
      <h1 class="spotify_header">My playlists :</h1>
    </div>
    <div v-if="playlists" class="flex flex-row flex-wrap justify-evenly mt-4">
      <div
        v-for="playlist in playlists"
        id="song_card"
        :key="playlist.id"
        class="flexxx"
        style="margin-bottom: 1rem"
      >
        <div id="cover">
          <NuxtLink :to="'/playlist/' + playlist.id">
            <img :src="playlist.image" class="cover_image" />
          </NuxtLink>
        </div>

        <div class="playlist_details flexxx">
          <div
            :id="'playlist_title_' + playlist.id"
            class="playlist_name playlist_title"
            style="display: flex"
          >
            {{ playlist.name }}
          </div>
          <div
            :id="'copy_text_' + playlist.id"
            class="copy_text playlist_title text-m"
            style="display: none; font-weight: 900; font-size: large"
          >
            URL copied to clipboard !
          </div>

          <div class="mt-0 mb-0 flex items-center">
            <button
              class="playlist-button"
              style="
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                margin-right: 1rem;
                width: 2.8rem;
                height: 2.8rem;
                line-height: 0em;
              "
              @click="
                OpenInNewWindow(
                  'https://jolify.ulysselacour.com/playlist/' + playlist.id
                )
              "
            >
              <font-awesome-icon
                class="playlist_icon"
                icon="fa-solid fa-music"
                size="1x"
              />
            </button>
            <button
              class="playlist-button"
              style="
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                margin-left: 1rem;
                margin-right: 1rem;
                width: 2.8rem;
                height: 2.8rem;
                line-height: 0em;
              "
              @click="CopytoClipboard(playlist.id)"
            >
              <font-awesome-icon
                class="playlist_icon"
                icon="fa-solid fa-link"
                size="1x"
              />
            </button>
            <button
              class="playlist-button"
              style="
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                margin-left: 1rem;
                width: 2.8rem;
                height: 2.8rem;
                line-height: 0em;
              "
              @click="OpenInNewWindow(playlist.href)"
            >
              <font-awesome-icon
                class="playlist_icon"
                icon="fa-brands fa-spotify"
                size="1x"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!reached_last_page"
      class="loader"
      :style="[loading ? { visibility: 'visible' } : { visibility: 'hidden' }]"
    >
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
import userPlaylistsData from '~/gql/userPlaylistsData.gql'

export default {
  components: {},

  data() {
    return {
      error: false,
      loading: false,
      can_load_more: false,
      offset: 0,
      reached_last_page: false,
      owner: {},
      playlists: []
    }
  },

  mounted() {
    this.DisplaySuggestionss()
    this.scroll()
  },

  methods: {
    // Fetch playlist data
    async DisplaySuggestionss() {
      try {
        this.loading = true
        this.can_load_more = false
        await this.$apollo
          .query({
            query: userPlaylistsData,
            variables: {
              offset: 0
            }
          })
          .then(({ data }) => {
            if (data.userPlaylistsData.success === false) {
              this.error = data.userPlaylistsData.details
            }

            if (data.userPlaylistsData.lastPage) {
              this.reached_last_page = data.userPlaylistsData.lastPage
            }

            this.owner = data.userPlaylistsData.owner
            this.loading = false
            this.can_load_more = true

            this.playlists = [
              ...this.playlists,
              ...data.userPlaylistsData.playlists
            ]
          })
          .catch(error => {
            this.loading = false
            this.error = error
          })
      } catch (e) {
        this.loading = false
        this.error = e
      }
    },

    // Fetch more playlists
    async FetchMore() {
      try {
        this.loading = true
        this.can_load_more = false
        this.offset += 50
        await this.$apollo
          .query({
            query: userPlaylistsData,
            variables: {
              offset: this.offset
            }
          })
          .then(({ data }) => {
            if (data.userPlaylistsData.lastPage) {
              this.reached_last_page = data.userPlaylistsData.lastPage
            }
            this.loading = false
            this.can_load_more = true
            this.playlists = [
              ...this.playlists,
              ...data.userPlaylistsData.playlists
            ]
          })
          .catch(error => {
            this.loading = false
            this.error = error
          })
      } catch (e) {
        this.error = e
      }
    },

    // Fetch more playlists when scrolling bottom
    scroll() {
      window.onscroll = () => {
        const isBottom =
          window.innerHeight + window.pageYOffset >= document.body.offsetHeight
        // Check if at bottom, other requests are finished, is last page and if error
        if (
          isBottom &&
          this.can_load_more &&
          !this.reached_last_page &&
          !this.error
        ) {
          this.FetchMore()
        }
      }
    },

    OpenInNewWindow(url) {
      window.open(url, '_blank').focus()
    },

    CopytoClipboard(playlistId) {
      navigator.clipboard.writeText(
        'jolify.ulysselacour.com/playlist/' + playlistId
      )

      const copiedTexts = document.getElementsByClassName('copy_text')
      const playlistNames = document.getElementsByClassName('playlist_name')

      /* eslint-disable */
      for (let elem of copiedTexts) {
        elem.style.display = 'none'
      }

      for (let elem of playlistNames) {
        elem.style.display = 'flex'
      }
      /* eslint-enable */

      document.getElementById('playlist_title_' + playlistId).style.display =
        'none'
      document.getElementById('copy_text_' + playlistId).style.display = 'flex'
    }
  }
}
</script>

<style scoped>
#display_playlist {
  margin-top: 1rem;
  background-color: #ffff;
}

.spotify_header {
  font-family: 'Chillax-Medium';
  text-align: center;
  font-size: x-large;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.playlist_title {
  font-family: 'Chillax-Medium';
  width: 16rem;
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  line-height: 2rem;
  transition: 0.5s;
}

.playlist_details {
  opacity: 0;
  transition: 0.5s;
}

.playlist_icon {
  transform: scale(1.3);
}

#song_card {
  margin-bottom: 2rem;
  white-space: nowrap;
}

#cover {
  position: relative;
  height: 16rem;
  width: 16rem;
  margin-left: 2rem;
  margin-right: 2rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px;
  transition: 0.5s;
}

.playlist-button {
  width: 3rem;
  height: 3rem;
  background-color: #ffff;
  color: rgb(12, 12, 12);
  border: 1px solid rgb(12, 12, 12);
  border-radius: 50%;
  padding: 0.25rem;
  margin: 1rem;
  transition: 0.5s;
}

.playlist-button:hover {
  background-color: rgb(12, 12, 12);
  color: #ffff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: 0.5s;
}

@media screen and (max-width: 1024px) {
  .playlist_details {
    margin-bottom: 2rem;
    opacity: 2;
    transform: scale(1.25);
  }
}

@media screen and (min-width: 1024px) {
  .playlist-button {
    margin-left: 3rem;
    margin-right: 3rem;
  }

  #cover:hover {
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px,
      0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  #cover:hover + .playlist_details,
  .playlist_details:hover {
    opacity: 2;
    transition: opacity 0.5s, transform 1s;
  }
}
</style>
