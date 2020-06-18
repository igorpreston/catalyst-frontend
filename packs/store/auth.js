import axios from 'axios'

const state = {
  currentUser: null
}

const getters = {
  // TODO remove this getter and all related logic to it after beta (see CAT-550, use `git grep "isJustworks"` to find other entries with this getter)
  isJustworks (state) {
    return state.currentUser && state.currentUser.customer.name === 'Justworks'
  }
}

const mutations = {
  setCurrentUser (state, user) {
    state.currentUser = user
  }
}

const actions = {
  fetchCurrentUser ({ commit }) {
    return axios.get('/api/v1.0/users/current')
      .then(res => {
        commit('setCurrentUser', res.data)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error('Fetch current user: error ' + err)
        return Promise.reject(err)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
