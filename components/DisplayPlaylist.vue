<template>
  <div id="display_playlist" class="flexxx w-full">
    <div v-if="!loading" class="flexxx">
      <h1 class="playlist_name">
        {{ playlistData.playlistName }}
      </h1>
      <h1 v-if="playlistData.playlistDescription" class="playlist_header mb-4">
        "{{ playlistData.playlistDescription }}"
      </h1>
      <h1 class="playlist_header mb-4">
        made by
        <span class="font-bold">{{ playlistData.ownerName }}</span>
      </h1>

      <div class="mb-4">
        <button
          class="playlist-button"
          @click="OpenInNewWindow(playlistData.playlistUrl)"
        >
          <font-awesome-icon
            id="spotify_icon"
            class="playlist_icon"
            icon="fa-brands fa-spotify"
          />
        </button>

        <button
          class="playlist-button"
          @click="CopytoClipboard(chosenPlaylist)"
        >
          <font-awesome-icon
            id="copy_button"
            class="playlist_icon"
            :icon="copied ? 'fa-solid fa-check' : 'fa-solid fa-link'"
            style="transition: 0.5s"
          />
        </button>

        <!-- <button v-if="this.$store.state.auth.isAuth" class="playlist-button">
          <font-awesome-icon
            class="playlist_icon"
            icon="fa-solid fa-heart"
            size="1x"
          />
        </button> -->

        <button
          class="playlist-button"
          @click="OpenInNewWindow(playlistData.ownerUrl)"
        >
          <font-awesome-icon class="playlist_icon" icon="fa-solid fa-user" />
        </button>
      </div>
    </div>

    <div v-if="tracks" class="flex flex-row flex-wrap justify-evenly">
      <div
        v-for="track in tracks"
        id="song_card"
        :key="track.id"
        class="flexxx"
      >
        <div id="cover">
          <AudioPlayer
            v-if="track.preview"
            class="player_button"
            :track-id="track.id"
            :preview-url="track.preview"
          />
          <img :src="track.cover" class="cover_image lazyload" />
        </div>

        <a
          id="title"
          class="text-center mb-1 text-sm"
          :href="track.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ track.title }} - {{ track.artist }}
        </a>
      </div>
    </div>

    <h1 v-if="error" class="error text-red-600">{{ error }}</h1>

    <button
      v-if="!reachedLastPage"
      class="load_more"
      :style="[!loading ? { display: 'unset' } : { display: 'none' }]"
      @click="FetchMore()"
    ></button>

    <button
      v-if="reachedLastPage && tracks.length > 20"
      class="scroll_top"
      :style="[!loading ? { display: 'unset' } : { display: 'none' }]"
      @click="ScrolltoTop()"
    ></button>

    <div
      v-if="!reachedLastPage"
      class="loader"
      :style="[loading ? { visibility: 'visible' } : { visibility: 'hidden' }]"
    >
      <div class="lds-dual-ring"></div>
    </div>
  </div>
</template>

<script>
// GRAPHQL IMPORTS
import specificPlaylistData from '../gql/specificPlaylistData.gql'

// COMPONENTS IMPORTS
import AudioPlayer from '~/components/AudioPlayer.vue'

// Define initial data of component
function initialState(
  error = false,
  loading = false,
  canLoadMore = false,
  offset = 0,
  reachedLastPage = false,
  playlistData = {},
  tracks = [],
  copied = false
) {
  return {
    error,
    loading,
    canLoadMore,
    offset,
    reachedLastPage,
    playlistData,
    tracks,
    copied
  }
}

export default {
  components: {
    AudioPlayer
  },

  props: {
    chosenPlaylist: { type: String, default: '' }
  },

  data() {
    return initialState()
  },

  mounted() {
    this.specificPlaylistData()
    this.scroll()
  },

  methods: {
    // Fetch playlist data
    async specificPlaylistData() {
      try {
        this.loading = true
        this.canLoadMore = false
        await this.$apollo
          .query({
            query: specificPlaylistData,
            variables: {
              playlistId: this.chosenPlaylist,
              offset: 0
            }
          })
          .then(({ data }) => {
            if (data.specificPlaylistData.lastPage) {
              this.reachedLastPage = data.specificPlaylistData.lastPage
            }
            this.loading = false
            this.canLoadMore = true
            this.playlistData = data.specificPlaylistData.playlist
            this.tracks = [...this.tracks, ...data.specificPlaylistData.tracks]
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

    // Fetch more tracks
    async FetchMore() {
      try {
        this.loading = true
        this.canLoadMore = false
        this.offset += 20
        await this.$apollo
          .query({
            query: specificPlaylistData,
            variables: {
              playlistId: this.chosenPlaylist,
              offset: this.offset
            }
          })
          .then(({ data }) => {
            if (data.specificPlaylistData.lastPage) {
              this.reachedLastPage = data.specificPlaylistData.lastPage
            }
            this.loading = false
            this.canLoadMore = true
            this.tracks = [...this.tracks, ...data.specificPlaylistData.tracks]
          })
          .catch(error => {
            this.loading = false
            this.error = error
          })
      } catch (e) {
        this.error = e
      }
    },

    // Fetch more tracks when scrolling bottom
    scroll() {
      window.onscroll = () => {
        const isBottom =
          window.innerHeight + window.pageYOffset >= document.body.offsetHeight
        // Check if at bottom, other requests are finished, is last page and if error
        if (
          isBottom &&
          this.canLoadMore &&
          !this.reachedLastPage &&
          !this.error
        ) {
          this.FetchMore()
        }
      }
    },

    ScrolltoTop() {
      window.scrollTo(0, 0)
    },

    OpenInNewWindow(url) {
      window.open(url, '_blank').focus()
    },

    CopytoClipboard(playlistId) {
      // Copy url
      navigator.clipboard.writeText(
        'jolify.ulysselacour.com/playlist/' + playlistId
      )
      // Smooth feedback
      const button = document.getElementById('copy_button')
      button.style.opacity = 0
      setTimeout(() => {
        this.copied = true
        button.style.opacity = 1
        setTimeout(() => {
          this.copied = false
        }, 1500)
      }, 250)
    }
  }
}
</script>

<style scoped>
#display_playlist {
  margin-top: 1rem;
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

#title {
  font-family: 'Chillax-Medium';
  width: 16rem;
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 2rem;
  opacity: 0;
  transition: 0.5s;
}

@media screen and (max-width: 1024px) {
  #title {
    opacity: 2;
  }

  #title {
    transform: scale(1.25);
    padding-top: 1rem;
    white-space: initial;

    /* either not clickable */
    pointer-events: none;

    /* or clickable */
    /* text-decoration: underline;
    text-decoration-thickness: 0.5px; */
  }
}

@media screen and (min-width: 1024px) {
  #cover:hover {
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 4px,
      0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  #title:hover {
    text-decoration: underline;
    text-decoration-thickness: 1px;
  }

  #cover:hover + #title,
  #title:hover {
    opacity: 2;
    transform: scale(1.25);
    transition: opacity 0.5s, transform 1s;
  }
}

#display_playlist {
  margin-top: 1rem;
  background-color: #ffff;
}

.playlist_name {
  font-family: 'Chillax-Medium';
  text-align: center;
  font-size: x-large;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.playlist_header {
  font-family: 'Chillax-Regular';
  text-align: center;
  font-size: large;
}

.playlist_icon {
  font-size: 1.5rem;
  transition: 0.25s;
}

#spotify_icon {
  font-size: 1.75rem;
}

.playlist-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #ffff;
  color: rgb(12, 12, 12);
  border: 1px solid rgb(12, 12, 12);
  border-radius: 50%;
  padding: 0.25rem;
  margin: 1rem;
  transition: 0.25s;
}

.playlist-button:hover {
  background-color: rgb(12, 12, 12);
  color: #ffff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: 0.5s;
}

.playlist-button:hover .playlist_icon {
  transform: scale(1.25);
  transition: 0.5s;
}

@media screen and (min-width: 1024px) {
  .playlist-button {
    margin-left: 3rem;
    margin-right: 3rem;
  }
}
</style>
