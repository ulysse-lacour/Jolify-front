<template>
  <div id="content" class="flex-head w-screen">
    <div class="flex-head w-3/4">
      <HomeDetails v-if="!$store.state.auth.isAuth" />
      <div class="spotify_header" style="margin-top: 1rem">
        Looking for sounds to dev ?
      </div>

      <select id="select_playlist" v-model="chosenPlaylist" class="w-80">
        <option value="643XSQTnOVEpy79SaCHL2n" selected>deep thinking</option>
        <option value="3m9rNevQKo8YywNF8Rf6rQ">chill</option>
        <option value="0Sy2FekTmarSS9SAlFl73N">motivate me</option>
      </select>

      <div v-if="chosenPlaylist == '643XSQTnOVEpy79SaCHL2n'" class="mt-2">
        <div class="playlist_header">
          For deep thinking and focus optimized try
          <a
            class="underline font-black"
            href="https://open.spotify.com/playlist/643XSQTnOVEpy79SaCHL2n"
            >this one</a
          >.
        </div>
        <div class="playlist_header">
          It's mainly composed of ambient music, jazz, classical, ost and
          spiritual music. It doesn't have any words or distincted voice to
          disturb mind, have a look bellow.
        </div>
      </div>

      <div v-if="chosenPlaylist == '3m9rNevQKo8YywNF8Rf6rQ'" class="mt-2">
        <div class="playlist_header">
          If you looking for an intermediate mood and are not against words try
          <a
            class="underline font-black"
            href="https://open.spotify.com/playlist/3m9rNevQKo8YywNF8Rf6rQ"
            >this one</a
          >.
        </div>
        <div class="playlist_header">
          This playlist is a melting pot of everything I like and I could think
          of as a good companion of work.
        </div>
      </div>

      <div v-if="chosenPlaylist == '0Sy2FekTmarSS9SAlFl73N'">
        <div class="playlist_header">
          If needing more motivation with more upbeat music try
          <a
            class="underline font-black"
            href="https://open.spotify.com/playlist/0Sy2FekTmarSS9SAlFl73N"
            >this one</a
          >.
        </div>
        <div class="playlist_header">
          This playlist is a collection of very diverse style of music aiming to
          keep yourself focus and efficient, including some energetic gems to
          give you a kick, surrounded by peacefulls and multifaceted musicals
          atmospheres.
        </div>
      </div>
    </div>
    <DisplayPlaylist :chosen-playlist="chosenPlaylist" />
  </div>
</template>

<script>
import HomeDetails from './HomeDetails/index.vue'
import DisplayPlaylist from './DisplayPlaylist/index.vue'

export default {
  components: { HomeDetails, DisplayPlaylist },

  data() {
    return {
      chosenPlaylist: '643XSQTnOVEpy79SaCHL2n'
    }
  },

  head() {
    return {
      title: this.$config.app.title,

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

<style scoped>
select {
  font-family: 'Chillax-Medium';
  color: rgb(12, 12, 12);
  background-color: #ffff;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  border: 1px solid rgb(12, 12, 12);
  border-radius: 16px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em;
}

.spotify_header {
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
</style>
