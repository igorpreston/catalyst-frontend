import axios from 'axios'
import _ from 'lodash'

const formDataDefault = () => ({
  name: '',
  title: '',
  email: '',
  admin: false
})

export default {
  state: {
    all: [],
    filter: '',
    user: null,
    selected: [],
    edit: null,
    form: formDataDefault()
  },

  getters: {
    filteredUsers: (state) => {
      if (state.filter === '') {
        return _.take(state.all, 10)
      }
      const filtered = state.all.filter(user =>
        user.name.toLowerCase().indexOf(state.filter.toLowerCase()) > -1
      )
      if (filtered.length > 10) {
        return _.take(filtered, 10)
      }

      return filtered
    },

    userFormData: state => {
      return state.form
    },

    usersNum: state => {
      return state.all.length
    },

    selectedUsersNum: state => {
      return state.selected.length
    },

    selectedUserIds: state => {
      return state.selected.map(user => user.id)
    },

    anyUsersSelected: (state, getters) => {
      return getters.selectedUsersNum >= 1
    }
  },

  actions: {
    fetchUsers ({ commit }) {
      return axios.get('/api/v1.0/users')
        .then(res => {
          commit('setUsers', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching users', err)
          return Promise.reject(err)
        })
    },

    filterUsers ({ commit }, filter) {
      commit('setUserFilter', filter)
    },

    selectUsers ({ commit }, users) {
      commit('setSelectedUsers', users)
    },

    createUser ({ commit, dispatch, getters }) {
      return axios.post('/api/v1.0/users/', {...getters.userFormData})
        .then(res => {
          commit('resetUserFormData')
          return dispatch('fetchUsers')
        })
        .catch(err => {
          console.error('Error creating user', err)
          return Promise.reject(err)
        })
    },

    updateUser ({ dispatch, getters }) {
      return axios.put(`/api/v1.0/users/${getters.userFormData.id}`, { ...getters.userFormData })
        .then(res => {
          return dispatch('fetchUsers')
        })
        .catch(err => {
          console.error('Error updating user', err)
          return Promise.reject(err)
        })
    },

    deleteUser (context, id) {
      return axios.delete(`/api/v1.0/users/${id}`)
    },

    deleteUsers ({ dispatch, getters }) {
      const deleted = getters.selectedUserIds.map(userId => dispatch('deleteUser', userId))

      Promise.all(deleted)
        .then(res => {
          dispatch('fetchUsers')
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },

    updateUserForm ({ commit, state }, user) {
      commit('setEditForm', user)
      if (state.edit) {
        for (const [key, value] of Object.entries(state.edit)) {
          commit('setUserFormData', { key, value })
        }
      }
    }
  },

  mutations: {
    setUser (state, user) {
      state.user = user
    },

    setUsers (state, users) {
      state.all = users
    },

    setUserFilter (state, filter) {
      state.filter = filter
    },

    setSelectedUsers (state, selected) {
      state.selected = selected
    },

    setEditForm (state, user) {
      state.edit = user
    },

    setUserFormData (state, { key, value }) {
      state.form[key] = value
    },

    resetUserFormData (state) {
      state.form = formDataDefault()
    }
  }
}
