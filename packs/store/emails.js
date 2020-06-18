import Vue from 'vue'
import moment from 'moment-timezone'
import router from '../router'
import axios from 'axios'

const state = {
  activeEmailIndex: 0,
  emails: []
}

const mutations = {
  updateScheduleOffset (state, offset) {
    state.emails[state.activeEmailIndex].schedule_offset =
      moment.duration(
        parseInt(offset.scalar), offset.unit
      ).asSeconds()
  },
  updateIsEditingScheduleVal (state, val = false) {
    state.emails[state.activeEmailIndex].isEditingScheduleVal = val
  },
  updateEmails (state, emails) {
    state.emails = emails
  },
  updateActiveIndex (state, index) {
    state.activeEmailIndex = index
    state.emails[index].isEditingScheduleVal = false
    router.push({query: {tab: 'emails', email: state.activeEmailIndex}})
  },
  updateBody (state, body) {
    state.emails[state.activeEmailIndex].body = body
  },
  updateSubject (state, subject) {
    state.emails[state.activeEmailIndex].subject = subject
  },
  updateId (state, id) {
    let email = state.emails[state.activeEmailIndex]
    email.id = id
    Vue.set(state.emails, state.activeEmailIndex, email)
  },
  addEmail (state, data = {}) {
    let values = {
      subject: '',
      body: '',
      isNew: true,
      schedule_offset: 0
    }

    Object.assign(values, data.object)

    state.emails.push(values)
    state.activeEmailIndex = state.emails.length - 1
  },
  updateIsNew (state, isNew) {
    let email = state.emails[state.activeEmailIndex]
    email.isNew = isNew
    Vue.set(state.emails, state.activeEmailIndex, email)
  },
  deleteEmail (state) {
    state.emails.splice(state.activeEmailIndex, 1)
    state.activeEmailIndex = Math.max(0, state.activeEmailIndex - 1)
  }
}

const actions = {
  cloneEmail ({commit}, payload) {
    // If trying to clone an unsaved email, treat it as adding a new email.
    if (payload.id === undefined) {
      return commit('addEmail', { object: payload })
    }

    return axios.post(`/campaign_emails/${payload.id}/clone`)
      .then(res => {
        commit('addEmail', { object: res.data })
        commit('updateId', res.data.id)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  }
}

const getIfMailPresent = (fn, fallback = '') => (
  (state.emails.length === 0) ? fallback : fn()
)

const getters = {
  activeTab: (state, allGetters, rootState) => rootState.route.query.tab || 'overview',
  hasEmails: state => state.emails.length > 0,
  subject: state => getIfMailPresent(
    () => state.emails[state.activeEmailIndex].subject
  ),
  body: state => getIfMailPresent(
    () => state.emails[state.activeEmailIndex].body
  ),
  isNewEmail: state => getIfMailPresent(
    () => state.emails[state.activeEmailIndex].isNew, false
  ),
  isFirstEmail: state => getIfMailPresent(
    () => state.activeEmailIndex === 0, true
  ),
  id: state => getIfMailPresent(
    () => state.emails[state.activeEmailIndex].id
  ),
  scheduleOffset: state => getIfMailPresent(
    () => state.emails[state.activeEmailIndex].schedule_offset, 0
  ),
  activeEmailIndex: (state, allGetters, rootState) => {
    let emailQueryParam = parseInt(rootState.route.query.email)
    if (emailQueryParam && emailQueryParam < state.emails.length) {
      return emailQueryParam
    } else {
      return state.activeEmailIndex
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
