import axios from 'axios'
import router from '../router'
import _ from 'lodash'

const state = {
  id: '',
  accountName: '',
  users: [],
  salesforceUserRoles: [],
  contactIds: [],
  contacts: [],
  contactRoles: [],
  contract_value: 0.0,
  stage: '',
  starred: false,
  account: {},
  accountInfo: [],
  ticket: {},
  campaigns: []
}

const mutations = {
  setId (state, id) {
    state.id = id
  },

  setUsers (state, users) {
    state.users = users
  },

  setContacts (state, contacts) {
    state.contacts = contacts
  },

  setCampaigns (state, campaigns) {
    state.campaigns = campaigns
  },

  setRoles (state, roles) {
    let salesforceUserRoles = []
    let contactRoles = []

    roles['SalesforceUser'] && roles['SalesforceUser'].forEach((role) => salesforceUserRoles.push(addValueToRole(state.users, role)))
    roles['Contact'] && roles['Contact'].forEach((role) => contactRoles.push(addValueToRole(state.contacts, role)))

    state.salesforceUserRoles = salesforceUserRoles
    state.contactRoles = contactRoles
  },

  updateAccount (state, account) {
    state.id = account.id
    state.accountName = account.name
    state.contactIds = account.contacts
    state.contract_value = account.contract_value
    state.stage = account.stage
    state.starred = account.starred
    state.account = account
    const blacklist = [
      'contacts',
      'errors',
      'id',
      'starred',
      'time_zone',
      'name_initials',
      'decimal_contract_value',
      'salesforce_attributes'
    ]
    state.accountInfo = _.toPairs(_.omit(_.mapValues(account, _.method('toString')), blacklist))
  },

  updateUserRole (state, role) {
    state.salesforceUserRoles.splice(state.salesforceUserRoles.findIndex(item => item.id === role.id), 1, addValueToRole(state.users, role))
  },

  updateContactRole (state, role) {
    state.contactRoles.splice(state.contactRoles.findIndex(item => item.id === role.id), 1, addValueToRole(state.contacts, role))
  },

  updateStar (state, starred) {
    state.starred = starred
  },

  updateTicket (state, ticket) {
    state.ticket = ticket
  }
}

const actions = {
  getContacts ({ dispatch }) {
    return dispatch('updateContacts')
      .then(() => dispatch('getUsers'))
  },

  getUsers ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      axios.get(`/api/v1.0/users`)
        .then((response) => {
          commit('setUsers', response.data)
          resolve()
        })
        .catch(err => console.error('users JSON failed: ' + err))
    }).then(() => dispatch('getRoles'))
  },

  getRoles ({ commit, state }) {
    return new Promise((resolve) => {
      axios.get(`/accounts/${state.id}/roles`)
        .then((response) => {
          commit('setRoles', response.data)
        })
        .then(() => resolve())
        .catch(err => console.error('roles JSON failed: ' + err))
    })
  },

  fetchCampaigns ({ commit }) {
    return axios.get('/campaigns.json')
      .then(res => commit('setCampaigns', res.data))
      .catch(err => console.error(err))
  },

  updateRoles ({ commit, state }, roles) {
    let promises = roles.map(function (role) {
      if (role.multiple === true) {
        var ids = role.value.map((r) => r.id)
      } else {
        if (role.value === undefined) {
          var ids = []
        } else {
          var ids = [role.value.id]
        }
      }
      return axios.post(`/roles/${role.id}/assignments`, { assignments: ids, account_id: state.id })
        .then(response => commit('update' + role.role_model + 'Role', response.data))
    })
    return Promise.all(promises)
  },

  updateStar (context, starred) {
    context.commit('updateStar', starred)
  },

  updateContacts ({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios.post(`/contacts/fetch`, { ids: state.contactIds })
        .then(response => {
          commit('setContacts', response.data)
          resolve()
        })
        .catch(err => console.error('contacts JSON failed: ' + err))
    })
  },

  deleteContacts ({ dispatch, commit, state }, contacts) {
    return new Promise((resolve, reject) => {
      const promises = contacts.map(contact => dispatch('deleteContact', contact))

      Promise.all(promises)
        .then(() => {
          state.account = {}
          dispatch('getAccount', state.id)
        })
        .catch((err) => reject(err))
    })
  },

  deleteContact (context, id) {
    return axios.delete(`/contacts/${id}`)
  },

  addContactsToCampaign ({ dispatch, commit }, [ contacts, campaignId ]) {
    return new Promise((resolve, reject) => {
      const promises = contacts.map(contact => dispatch('addContactToCampaign', [ contact, campaignId ]))

      Promise.all(promises)
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  },

  addContactToCampaign (context, [ contactId, campaignId ]) {
    return axios.post(`/campaigns/${campaignId}/contacts/${contactId}`)
  },

  updateTicket (context, ticket) {
    context.commit('updateTicket', ticket)
  },

  replyTicket (context, comment) {
    axios.post(`/ticket/${state.ticket.id}`, { comment: comment })
      .then(response => console.log('Successfully replied to ticket'))
      .catch(err => console.error('Failed to reply to ticket'))
  }
}

const getters = {
  activeTab: (state, allGetters, rootState) => {
    if (typeof rootState.route === 'undefined') {
      return ''
    }
    return (rootState.route.query.tab || 'overview')
  },
  accountCampaigns: (state, allGetters, rootState) => (_.get(state.account, 'campaigns', []))
}
// This function looks up the assigned objects in the state, and attaches them to the role.
// It's called from all over so I feel fine leaving it as its own function, as it doesn't really fit
// the theme of the designated locations.
function addValueToRole (state, role) {
  role.value = []
  role.assignments && role.assignments.forEach((user_id) => role.value.push(state.find(item => item.id === user_id)))
  if (role.multiple === false) {
    role.value = role.value[0]
  }

  return role
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
