// STATE
export const state = () => ({
  isAuth: false,
})

// ACTIONS
// none

// MUTATIONS
export const mutations = {
  logInOutUser(state, value) {
    state.isAuth = value
  },
}

// GETTERS
export const getters = {
  myIsAuthGetter(state) {
    return state.isAuth
  },
}
