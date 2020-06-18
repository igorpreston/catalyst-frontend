// store.js
import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import accounts from './accounts'
import activities from './activities'
import auth from './auth'
import campaignSegments from './campaignSegments'
import common from './common'
import contacts from './contacts'
import email from './email'
import emails from './emails'
import goals from './goals'
import metrics from './metrics'
import notes from './notes'
import playbooks from './playbooks'
import realLang from './realLang'
import segments from './segments'
import salesforceUsers from './salesforceUsers'
import settings from './settings'
import tasks from './tasks'
import templates from './templates'
import tickets from './tickets'
import tokens from './tokens'
import users from './users'

Vue.use(Vuex)

// Export one singleton instance of a store
export default new Vuex.Store({
  modules: {
    account: account,
    accounts: accounts,
    activities: activities,
    auth: auth,
    campaignSegments: campaignSegments,
    common: common,
    contacts: contacts,
    email: email,
    emails: emails,
    goals: goals,
    metrics: metrics,
    notes: notes,
    playbooks: playbooks,
    realLang: realLang,
    salesforceUsers: salesforceUsers,
    segments: segments,
    settings: settings,
    tasks: tasks,
    templates: templates,
    tickets: tickets,
    tokens: tokens,
    users: users
  }
})
