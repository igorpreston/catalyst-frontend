import axios from 'axios'
import Raven from 'raven-js'
import _ from 'lodash'

const formDataDefault = () => ({
  name: '',
  type: '',
  terms: [{
    field: '',
    operator: '',
    value: ''
  }],
  user_id: ''
})

const state = {
  all: [],
  selected: [],
  filter: [],
  viewId: null,
  activities: [],
  form: formDataDefault(),
  mode: null
}

const getters = {
  segmentsNum: state => {
    return state.all && state.all.length
  },

  selectedSegmentsNum: state => {
    return state.selected.length
  },

  anySegmentsSelected: (state, getters) => {
    return getters.selectedSegmentsNum >= 1
  },

  singleSegmentSelected: (state, getters) => {
    return getters.selectedSegmentsNum === 1
  },

  selectedSegmentIds: state => {
    return state.selected.map(segment => segment.id)
  },

  accountSegments: state => {
    return state.all.filter(segment => segment.type === 'Account')
  },

  contactSegments: state => {
    return state.all.filter(segment => segment.type === 'Contact')
  },

  getSegmentNameById: state => id => {
    const segment = _.find(state.all, { id })

    return segment && segment.name
  },

  segmentFormData: state => {
    return state.form
  },

  getCurrentSegment: state => {
    return _.find(state.all, ['id', state.viewId])
  },

  notEmptyFilters: (state, getters) => {
    return getters.segmentFormData.terms.filter(row => {
      if (row.operator === 'blank' || row.operator === 'present') {
        return !_.isEmpty(row.field)
      } else {
        return !_.isEmpty(row.field) && !_.isEmpty(row.operator) && !_.isEmpty(row.value)
      }
    })
  }
}

const actions = {
  fetchSegments ({commit}) {
    return axios.get('/segments.json')
      .then(res => {
        commit('setSegments', res.data)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error('segments.json call failed', err)
        Raven.captureException(err)
        return Promise.reject(err)
      })
  },

  saveSegment ({ dispatch, commit, state, getters }) {
    const segment = {
      name: state.form.name,
      query_meta: {
        terms: state.form.terms,
        type: state.form.type
      },
      user_id: state.form.user_id
    }
    return axios.post(`/segments/`, segment)
      .then(res => {
        commit('setSegmentViewId', res.data.id)
        return dispatch('fetchSegments')
      })
      .then(res => {
        return dispatch('setSegmentView')
      })
      .catch(err => {
        console.error('Error creating a segment', err)
        Raven.captureException(err)
        return Promise.reject(err)
      })
  },

  updateSegment ({ dispatch, commit, state }) {
    const segment = {
      name: state.form.name,
      query_meta: {
        terms: state.form.terms,
        type: state.form.type
      }
    }
    return axios.post(`/segments/${state.viewId}`, segment)
      .then(res => {
        return dispatch('fetchSegments')
      })
      .then(res => {
        return dispatch('setSegmentView')
      })
      .then(res => {
        return dispatch('handleSegmentFilter')
      })
      .catch(err => {
        console.error('Error updating a segment', err)
        Raven.captureException(err)
        return Promise.reject(err)
      })
  },

  deleteSegment (context, id) {
    return axios.delete(`/segments/${id}`)
  },

  deleteSegments ({ dispatch, getters }) {
    const deleted = getters.selectedSegmentIds.map(segmentId => dispatch('deleteSegment', segmentId))

    return Promise.all(deleted)
      .then(() => {
        return dispatch('fetchSegments')
      })
      .catch(err => {
        Raven.captureException(err)
        return Promise.reject(err)
      })
  },

  selectSegments ({ commit }, segments) {
    commit('setSelectedSegments', segments)
  },

  handleSegmentFilter ({ state, getters, commit, dispatch }) {
    let terms = getters.notEmptyFilters
    switch (state.form.type) {
      case 'Account':
        return dispatch('applyAccountFilter', terms, {root: true})

      case 'Contact':
        return dispatch('applyContactFilter', terms, {root: true})
    }
  },

  getSegmentActivities ({ state, commit }) {
    axios.get(`/segments/${state.viewId}/history.json`)
      .then(res => {
        commit('setActivities', res.data)
        return Promise.resolve(res)
      })
      .catch(err => {
        Raven.captureException(err)
        return Promise.reject(err)
      })
  },

  setSegmentView ({ commit, getters, state }) {
    commit('setSegmentFormData', { key: 'name', value: getters.getCurrentSegment.name })
    commit('setSegmentFormData', { key: 'type', value: getters.getCurrentSegment.query_meta.type })
    commit('setSegmentFormData', { key: 'terms', value: getters.getCurrentSegment.query_meta.terms })
    commit('setSegmentFormData', { key: 'user_id', value: getters.getCurrentSegment.user_id })
    commit('setSegmentFormData', { key: 'id', value: state.viewId })
  },

  resetTerms (context) {
    state.form.terms = [{
      field: null,
      operator: null,
      value: ''
    }]
  },

  updateSegmentMode ({ commit }, mode) {
    commit('setSegmentMode', mode)
  },

  updateSegmentFormData ({ commit }, data) {
    commit('setSegmentFormData', data)
  }
}

const mutations = {
  setSegments (state, segments) {
    state.all = segments
  },

  setSelectedSegments (state, segments) {
    state.selected = segments
  },

  setCurrentSelectedSegment (state, current) {
    state.currentSelected = current
  },

  setFilter (state, value) {
    state.filter = value
  },

  setSegmentFormData (state, { key, value }) {
    state.form[key] = value
  },

  addTerm (state) {
    state.form.terms.push({})
  },

  deleteTerm (state, index) {
    if (index !== 0 || state.form.terms.length > 1) {
      state.form.terms.splice(index, 1)
    } else {
      state.form.terms = [{
        field: '',
        operator: '',
        value: ''
      }]
    }
  },

  deleteSingleTerm (state, index) {
    state.form.terms.splice(index, 1)
  },

  setTerm (state, { index, term, replace }) {
    let newTerms = [...state.form.terms]
    if (replace) {
      newTerms[index] = term
    } else {
      newTerms[index] = { ...newTerms[index], ...term }
    }
    state.form.terms = newTerms
  },

  resetSegmentFormData (state) {
    state.form = formDataDefault()
  },

  setSegmentViewId (state, id) {
    state.viewId = id
  },

  setActivities (state, activities) {
    state.activities = activities
  },

  setSegmentMode (state, mode) {
    state.mode = mode
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
