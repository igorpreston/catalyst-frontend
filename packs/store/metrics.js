import axios from 'axios'
import moment from 'moment-timezone'
import _ from 'lodash'

const state = {
  isLoadingMetrics: true,
  all: [],
  selected: [],
  formulas: [],
  charts: {},
  eventNames: [],
  currentMetricIndex: 0,
  options: {
    dateRange: null,
    period: null
  }
}

const getters = {
  metricsNum: state => {
    return state.all.length
  },

  selectedMetricsNum: state => {
    return state.selected.length
  },

  singleMetricSelected: (state, getters) => {
    return getters.selectedMetricsNum === 1
  },

  anyMetricsSelected: (state, getters) => {
    return getters.selectedMetricsNum >= 1
  },

  selectedMetricsIds: state => {
    return state.selected.map(metric => metric.id)
  },

  editedMetric: state => {
    const defaultMetric = {
      name: '',
      event_type: '',
      default_formula: '',
      days_count: 30
    }
    return state.selected[0] || defaultMetric
  },

  scopeEntity: (state, getters, rootState) => {
    if (rootState.contacts && rootState.contacts.contact) {
      return 'contact'
    } else if (rootState.accounts && rootState.accounts.account) {
      return 'account'
    }
  },

  scopeEntityId: (state, getters, rootState) => {
    if (rootState.contacts && rootState.contacts.contact) {
      return rootState.contacts.contact.id
    } else if (rootState.accounts && rootState.accounts.account) {
      return rootState.accounts.account.id
    }
  },

  scopeEntityUrlString: (state, getters) => {
    return `filter=${getters.scopeEntity}s&${getters.scopeEntity}_id=${getters.scopeEntityId}`
  },

  currentMetric: state => {
    const index = state.currentMetricIndex

    return state.all[index]
  },

  currentChart: (state, getters) => {
    return getters.currentMetric && state.charts[getters.currentMetric.id]
  },

  isFirstMetric: state => {
    return state.currentMetricIndex === 0
  },

  isLastMetric: state => {
    return state.currentMetricIndex === (state.all.length - 1)
  },

  contactMetrics: state => {
    return [...state.all].filter(metric => metric.default_formula === 'total_number_of_events')
  },

  accountMetrics: state => {
    return state.all
  },

  getMetricsNameById: state => id => {
    const metric = _.find(state.all, { id })

    return metric && metric.name
  },

  fetchChartParams: (state, getters, rootState) => currentMetric => {
    return {
      default_formula: currentMetric.default_formula,
      days_count: currentMetric.days_count,
      event_type: currentMetric.event_type,
      date_from: state.options.dateRange[0] && moment(state.options.dateRange[0])
        .tz((rootState.auth.currentUser &&
          rootState.auth.currentUser.time_zone) || 'UTC')
        .tz('UTC').format('YYYY-MM-DD'),
      date_to: state.options.dateRange[1] && moment(state.options.dateRange[1])
        .tz((rootState.auth.currentUser &&
          rootState.auth.currentUser.time_zone) || 'UTC')
        .tz('UTC').format('YYYY-MM-DD'),
      period: state.options.period
    }
  }
}

const mutations = {
  setMetrics (state, metrics) {
    state.all = metrics
  },

  setMetric (state, { index, metric }) {
    let newMetrics = [ ...state.all ]
    newMetrics[index] = metric

    state.all = newMetrics
  },

  setMetricAttribute (state, { index, key, value }) {
    state.all[index][key] = value
  },

  setFormulas (state, formulas) {
    state.formulas = formulas
  },

  setSelectedMetrics (state, metrics) {
    state.selected = metrics
  },

  addChartData (state, { metricIndex, data }) {
    let newCharts = { ...state.charts }
    newCharts[metricIndex] = data

    state.charts = newCharts
  },

  setOption (state, { index, value }) {
    let newOptions = { ...state.options }

    newOptions[index] = value
    state.options = newOptions
  },

  setMetricIndex (state, index) {
    state.currentMetricIndex = index
  },

  setLoadingMetrics (state, loading) {
    state.isLoadingMetrics = loading
  },

  setEventNames (state, eventNames) {
    state.eventNames = eventNames
  }
}

const actions = {
  fetchMetrics ({ commit }) {
    return axios.get('/metrics')
      .then(res => {
        commit('setMetrics', res.data)
        return Promise.resolve(res)
      }).catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  fetchFormulas ({ commit, getters }) {
    return axios.get('/metrics/formulas', {
      params: {
        'filter': getters.scopeEntity
      }
    }).then(res => {
      commit('setFormulas', res.data)
      return Promise.resolve(res)
    }).catch(err => {
      console.error(err)
      return Promise.reject(err)
    })
  },

  deleteMetrics ({ dispatch, getters }) {
    const deleted = getters.selectedMetricsIds.map(templateId => dispatch('deleteMetric', templateId))

    Promise.all(deleted)
      .then(res => {
        return dispatch('fetchMetrics')
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  deleteMetric (context, id) {
    return axios.delete(`/metrics/${id}`)
  },

  selectMetrics ({ commit }, metrics) {
    commit('setSelectedMetrics', metrics)
  },

  fetchMetricsByAccount ({ commit, getters, state }, id) {
    const accountId = id || getters.account.id
    commit('setLoadingMetrics', true)
    return axios.get(`/metrics?filter=accounts&account_id=${accountId}`)
      .then(res => {
        commit('setMetrics', res.data)
        commit('setLoadingMetrics', false)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error('something went wrong while fetching metrics', err)
        return Promise.reject(err)
      })
  },

  fetchMetricsByContact ({ commit, getters, state }, id) {
    const contactId = id || getters.contact.id
    commit('setLoadingMetrics', true)
    return axios.get(`/metrics?filter=contacts&contact_id=${contactId}`)
      .then(res => {
        commit('setMetrics', res.data)
        commit('setLoadingMetrics', false)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error('something went wrong while fetching metrics', err)
        return Promise.reject(err)
      })
  },

  customizeMetric ({ commit, state, getters }, index) {
    const metric = state.all[index]

    return axios.patch(`/metrics/customize/${metric.id}?${getters.scopeEntityUrlString}`, metric)
      .then(res => {
        commit('setMetric', { index, metric: res.data })
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  fetchChartByAccount ({ dispatch, getters, commit }, {metric, id}) {
    const params = getters.fetchChartParams(metric)
    return axios.get(`/accounts/${id}/events.json`, {
      params: params
    }).then(res => {
      commit('addChartData', { metricIndex: metric.id, data: res.data })
      return Promise.resolve(res)
    }).catch(err => {
      console.error(err)
      return Promise.reject(err)
    })
  },

  fetchChartByContact ({ dispatch, getters, commit }, {metric, id}) {
    const params = getters.fetchChartParams(metric)
    return axios.get(`/contacts/${id}/events.json`, {
      params: params
    }).then(res => {
      commit('addChartData', { metricIndex: metric.id, data: res.data })
      return Promise.resolve(res)
    }).catch(err => {
      console.error(err)
      return Promise.reject(err)
    })
  },

  fetchEventNames ({ commit }) {
    return axios.get('/metrics/event_types')
      .then(res => {
        commit('setEventNames', res.data)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
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
