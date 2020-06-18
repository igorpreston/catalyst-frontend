import router from '../router'
import axios from 'axios'

const state = {
}

const mutations = {
}

const actions = {
  changeTab (context, name) {
    router.push({query: {tab: name}})
  },

  fetchIntegration (context, externalServiceName) {
    return axios.get(`/integrations/${externalServiceName}`)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  deleteIntegration (context, externalServiceName) {
    return axios.delete(`/integrations/${externalServiceName}`)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  updateConfig (context, {config, externalServiceName}) {
    return axios.post(`/integrations/${externalServiceName}`, { config })
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  triggerSync (context, externalServiceName) {
    return axios.get(`/integrations/${externalServiceName}/sync`)
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  fetchEventAPI (context) {
    return axios.get('/settings/events/api_key')
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  fetchSegmentEndpoint () {
    return axios.get('/integrations/segment_endpoint')
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  }
}

const getters = {
  activeTab: (state, allGetters, rootState) => {
    if (typeof rootState.route === 'undefined') {
      return ''
    }
    return (rootState.route.query.tab || 'integrations')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
