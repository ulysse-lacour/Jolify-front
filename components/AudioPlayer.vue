<template>
  <div class="">
    <audio
      :id="['player-' + trackId]"
      class="audio_player"
      style="display: none"
      controls
      preload="metadata"
    >
      <source :src="previewUrl" type="audio/mpeg" />
    </audio>
    <button
      class="audio_player_button"
      :style="previewUrl ? 'visibility: visible' : 'visibility: hidden'"
      @click="toggleAudio('player-' + trackId)"
    >
      <font-awesome-icon
        v-if="$store.state.audio.whosPlaying == 'player-' + trackId"
        class="pause_audio audio_icon"
        icon="fa-solid fa-circle-pause"
        size="3x"
        beat
      />

      <font-awesome-icon
        v-else
        class="play_audio audio_icon"
        icon="fa-solid fa-circle-play"
        size="3x"
      />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    trackId: { type: String, default: '' },
    previewUrl: { type: String, default: '' }
  },

  methods: {
    toggleAudio(playerID) {
      // Get the player clicked
      const audioPlayer = document.getElementById(playerID)
      // Watch for the audio ending
      audioPlayer.addEventListener('ended', () =>
        this.$store.commit('audio/WhosPlaying', '')
      )
      // Get the others
      const otherPlayers = document.querySelectorAll(
        '.audio_player:not(#' + playerID + ')'
      )
      // Reset all other players before playing clicked one
      for (let i = 0, length = otherPlayers.length; i < length; i++) {
        otherPlayers[i].pause()
        otherPlayers[i].currentTime = 0
      }

      if (audioPlayer.paused) {
        audioPlayer.play()
        this.$store.commit('audio/WhosPlaying', playerID)
      } else {
        audioPlayer.pause()
        this.$store.commit('audio/WhosPlaying', '')
      }
    }
  }
}
</script>

<style scoped>
.audio_player_button {
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0.75;
  color: rgba(255, 255, 255, 1);
  transition: 0.25s;
}

.play_audio {
  opacity: 0;
  transition: 0.5s;
}

@media screen and (max-width: 1024px) {
  .play_audio {
    opacity: 2;
  }
}

@media screen and (min-width: 1024px) {
  .audio_player_button:hover {
    opacity: 1;
    transition: 0.5s;
  }

  .audio_icon:hover {
    font-size: 3.25rem;
    transition: 0.5s !important;
  }

  #cover:hover .play_audio {
    opacity: 2;
    transform: scale(1.25);
    transition: opacity 0.5s, transform 1s;
  }
}
</style>
