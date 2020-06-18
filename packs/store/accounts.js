import axios from 'axios'
import Raven from 'raven-js'
import _ from 'lodash'

export default {
  state: {
    all: [],
    navbar: [],
    account: {
      id: null,
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
      campaigns: [],
      salesforceAttributes: []
    },
    filterQuery: '',
    initialAllCount: null,
    terms: [],
    page: 1,
    pageSize: 25,
    accounts: [],
    count: 0,
    total: 0,
    isFiltered: false,
    order: null,
    sortColumn: null,
    isLoadingAccounts: true,
    isLoadingAccount: true
  },

  getters: {
    account: state => state.account,
    getAccountById: state => id => {
      return _.find(state.all, { id })
    },
    accountCampaigns: (state, rootState) => (_.get(state.account, 'campaigns', []))
  },

  actions: {
    getAccounts (context) {
      context.commit('setLoadingAccounts', true)
      return axios.get('/accounts', {
        params: {
          page: context.state.page,
          per_page: context.state.pageSize,
          terms: context.state.terms,
          prop: context.state.sortColumn,
          order: context.state.order
        }
      })
        .then(response => {
          context.commit('setCount', response.data.count)
          context.commit('setAccounts', response.data.accounts)
          context.commit('setTotal', response.data.total_count)
          context.commit('setLoadingAccounts', false)
          return Promise.resolve()
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    getFilteredAccounts (context, page) {
      context.commit('setLoadingAccounts', true)
      return axios.post('/accounts/filter', {
        page: page,
        per_page: context.state.pageSize,
        terms: context.state.terms,
        prop: context.state.sortColumn,
        order: context.state.order})
        .then(res => {
          context.commit('setCount', res.data.count)
          context.commit('setAccounts', res.data.accounts)
          context.commit('setTotal', res.data.total_count)
          context.commit('setLoadingAccounts', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    applyAccountFilter (context, terms) {
      context.commit('setPage', 1)
      context.commit('setFiltered', true)
      context.commit('setAccountTerms', terms)
      return context.dispatch('getFilteredAccounts', 1)
    },

    addContactsToCampaign ({ dispatch }, [ contacts, campaignId ]) {
      const promises = contacts.map(contact => dispatch('addContactToCampaign', [ contact, campaignId ]))

      return Promise.all(promises)
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    addContactToCampaign (context, [ contactId, campaignId ]) {
      return axios.post(`/campaigns/${campaignId}/contacts/${contactId}`)
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    deleteContact (context, id) {
      return axios.delete(`/contacts/${id}`)
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    deleteContacts ({ dispatch, commit, state }, contacts) {
      const promises = contacts.map(contact => dispatch('deleteContact', contact))

      return Promise.all(promises)
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchAccount ({commit, getters, dispatch}, id) {
      commit('setLoadingAccount', true)
      return axios.get(`/accounts/${id}`)
        .then(res => {
          commit('setAccount', res.data)
          return dispatch('fetchRoles', id)
        })
        .then(res => {
          commit('setLoadingAccount', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchSalesforceFieldsForAccount ({ state, commit }, id) {
      return axios.get(`/accounts/${id}/salesforce_fields`)
        .then(res => {
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchRoles ({ commit, state }, id) {
      return axios.get(`/accounts/${id}/roles`)
        .then((res) => {
          commit('setAccountRoles', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchCampaigns ({ commit }) {
      return axios.get('/campaigns.json')
        .then(res => {
          commit('setCampaigns', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    updateInfo (context, {info}) {
      return axios.post(`/accounts/${context.state.account.id}`, { ...info })
        .then(res => {
          context.commit('setAccount', res.data)
          return context.dispatch('fetchRoles', context.state.account.id)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    updateRoles ({ commit, state }, roles) {
      const promises = roles.map(function (role) {
        let ids = []
        if (role.multiple === true) {
          ids = role.value.map((r) => r.id)
        } else if (role.value) {
          ids = [role.value.id]
        }
        return axios.post(`/roles/${role.id}/assignments`, { assignments: ids, account_id: state.account.id })
      })
      return Promise.all(promises)
        .catch((err) => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    updateSortColumn (context, sortColumn) {
      context.commit('setSortColumn', sortColumn)
    },

    updateOrder (context, order) {
      context.commit('setOrder', order)
    },

    updateLoadingAccounts (context, loading) {
      context.commit('setLoadingAccounts', loading)
    },

    updateTotal (context, total) {
      context.commit('setTotal', total)
    },

    updatePage (context, page) {
      context.commit('setPage', page)
    },

    updateAccountsFiltered (context, isFiltered) {
      context.commit('setFiltered', isFiltered)
    },

    fetchAccountSegmentFields () {
      return axios.get('/accounts/filters')
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    }
  },

  mutations: {
    setAccounts (state, accounts) {
      state.all = accounts
    },

    setAccount (state, account) {
      state.account = {...account}
      const whiteList = [
        'account_type',
        'address',
        'contract_signed_date',
        'contract_value',
        'description',
        'industry',
        'name',
        'phone',
        'renewal_date',
        'seats_purchased',
        'seats_used',
        'size',
        'stage',
        'time_zone',
        'website',
        'twitter',
        'linkedin'
      ]
      state.account.accountInfo = _.toPairs(_.pick(_.mapValues(account, _.method('toString')), whiteList))
    },

    setAccountRoles (state, roles) {
      let salesforceUserRoles = []
      let contactRoles = []
      roles['SalesforceUser'] && roles['SalesforceUser'].forEach((role) => salesforceUserRoles.push(role))
      roles['Contact'] && roles['Contact'].forEach((role) => contactRoles.push(role))
      state.account.salesforceUserRoles = salesforceUserRoles
      state.account.contactRoles = contactRoles
      state.account.salesforceUserRoles.forEach(role => {
        if (!role.multiple) role.value = (role.value && role.value[0]) || {}
      })
      state.account.contactRoles.forEach(role => {
        if (!role.multiple) role.value = (role.value && role.value[0]) || {}
      })
    },

    setAccountsForNav (state, accounts) {
      state.navbar = accounts
    },

    setAccountsFilterQuery (state, query) {
      state.filterQuery = query
    },

    setCampaigns (state, campaigns) {
      state.account.campaigns = campaigns
    },

    setInitialAccountsCount (state, count) {
      state.initialAllCount = count
    },

    setSortColumn (state, sortColumn) {
      state.sortColumn = sortColumn
    },

    setOrder (state, order) {
      state.order = order
    },

    setLoadingAccounts (state, loading) {
      state.isLoadingAccounts = loading
    },

    setLoadingAccount (state, loading) {
      state.isLoadingAccount = loading
    },

    setTotal (state, total) {
      state.total = total
    },

    setFetchedAccounts (state, accounts) {
      state.all = accounts
    },

    setCount (state, count) {
      state.count = count
    },

    setFiltered (state, isFiltered) {
      state.isFiltered = isFiltered
    },

    setAccountTerms (state, terms) {
      state.terms = terms
    },

    setPage (state, page) {
      state.page = page
    }
  }
}
