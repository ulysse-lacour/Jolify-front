<template>
  <div id="display_playlist" class="flexxx w-full">
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
          <img :src="track.cover" class="cover_image" />
        </div>

        <a
          id="title"
          class="mb-1 text-sm"
          :href="track.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ track.title }} - {{ track.artist }}
        </a>
      </div>
    </div>

    <span v-if="error" class="error text-red-600">{{ error }}</span>

    <button
      v-if="!reachedLastPage"
      class="load_more"
      :style="[!loading ? { display: 'unset' } : { display: 'none' }]"
      @click="FetchMore()"
    ></button>

    <button
      v-if="reachedLastPage"
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
import mySuggestions from '~/gql/DisplaySuggestions.gql'

// COMPONENTS IMPORTS
import AudioPlayer from '~/components/AudioPlayer.vue'

// Define initial data of component
function initialState(
  error = false,
  loading = false,
  canLoadMore = false,
  offset = 0,
  reachedLastPage = false,
  tracks = []
) {
  return {
    error,
    loading,
    canLoadMore,
    offset,
    reachedLastPage,
    tracks
  }
}

export default {
  name: 'DisplaySuggestions',

  components: {
    AudioPlayer
  },

  props: {
    chosenPlaylist: { type: String, default: '643XSQTnOVEpy79SaCHL2n' }
  },

  data() {
    return initialState()
  },

  watch: {
    // Watch for new playlist is chosen
    chosenPlaylist: function (newVal, oldVal) {
      //   reset component data
      Object.assign(this.$data, initialState())
      //   refetch data for new playlist
      this.DisplaySuggestions()
    }
  },

  mounted() {
    this.DisplaySuggestions()
    this.scroll()
  },

  methods: {
    // Fetch playlist data
    async DisplaySuggestions() {
      try {
        this.loading = true
        this.canLoadMore = false
        await this.$apollo
          .query({
            query: mySuggestions,
            variables: {
              playlistId: this.chosenPlaylist,
              offset: 0
            }
          })
          .then(({ data }) => {
            if (data.mySuggestions.lastPage) {
              this.reachedLastPage = data.mySuggestions.lastPage
            }
            this.loading = false
            this.canLoadMore = true
            this.tracks = [...this.tracks, ...data.mySuggestions.tracks]
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
            query: mySuggestions,
            variables: {
              playlistId: this.chosenPlaylist,
              offset: this.offset
            }
          })
          .then(({ data }) => {
            if (data.mySuggestions.lastPage) {
              this.reachedLastPage = data.mySuggestions.lastPage
            }
            this.loading = false
            this.canLoadMore = true
            this.tracks = [...this.tracks, ...data.mySuggestions.tracks]
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
    }
  }
}
</script>

<style scoped>
#display_playlist {
  margin-top: 1rem;
  background-color: #ffff;
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
</style>
