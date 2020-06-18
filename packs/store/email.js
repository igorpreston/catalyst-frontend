import Vue from 'vue'
 
const state = {
  emailBody: '',
  emailSubject: '',
  plainTextBody: '',
  activeTab: 'write',
  isEditingScheduleVal: false
}

const mutations = {
  updatePlainText(state, plainTextBody) {
    state.plainTextBody = plainTextBody
  },
  updateEmailBody(state, body) {
    state.emailBody = body
  },
  updateEmailSubject(state, subject) {
    state.emailSubject = subject
  },
  updateActiveTab(state, activeTab) {
    state.activeTab = activeTab
  },
  updateIsEditingScheduleVal(state, val) {
    state.isEditingScheduleVal = val
  }
}

const actions = {}

const getters = {
  emailNotReady: state => state.emailBody === '' || state.emailSubject === '',
  notPreviewable: state => (state.emailBody === '' || state.emailBody === '<div><br></div>') && state.emailSubject === '',
  isEditingSchedule: state => state.isEditingScheduleVal
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}