import axios from 'axios'
import Raven from 'raven-js'
import _ from 'lodash'

export default {
  namespaced: true,

  state: {
    messages: [],
    activeName: '-1',
    all: [],
    isLoadingActivities: true
  },

  getters: {
    recentActivities (state) {
      return state.all.reduce((result, current) => [
        ...result,
        ..._.take(current.list, 10 - result.length)
      ], [])
    }
  },

  actions: {
    getAccountActivities (context, accountId) {
      context.commit('setLoadingActivities', true)
      axios.get(`/activity/account/${accountId}`)
        .then((res) => {
          context.commit('setActivities', res.data)
          context.commit('setLoadingActivities', false)
          return Promise.resolve(res)
        })
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    getContactActivities (context, contactId) {
      context.commit('setLoadingActivities', true)
      axios.get(`/activity/contact/${contactId}`)
        .then((res) => {
          context.commit('setActivities', res.data)
          context.commit('setLoadingActivities', false)
          return Promise.resolve(res)
        })
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    getEmails (context, threadId) {
      return axios.get(`/emails/${threadId}`)
        .then((res) => {
          context.commit('setMessages', res.data)
          context.commit('setActiveName', res.data.length - 1)
          return Promise.resolve(res)
        })
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    }

  },

  mutations: {
    setMessages (state, messages) {
      state.messages = messages
    },

    setActiveName (state, activeName) {
      state.activeName = activeName
    },

    setActivities (state, activities) {
      state.all = activities
    },

    setLoadingActivities (state, loading) {
      state.isLoadingActivities = loading
    }
  }
}
