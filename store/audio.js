// STATE
export const state = () => ({
  whosPlaying: '',
})

// ACTIONS
// None

// MUTATIONS
export const mutations = {
  WhosPlaying(state, value) {
    state.whosPlaying = value
  },
}

// GETTERS
export const getters = {
  myWhosPlayingGetter(state) {
    return state.whosPlaying
  },
}
