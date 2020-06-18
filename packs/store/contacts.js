import axios from 'axios'
import _ from 'lodash'
import Raven from 'raven-js'
import router from '../router'

export default {
  state: {
    all: [],
    navbar: [],
    selected: [],
    contact: null,
    filterQuery: '',
    initialAllCount: null,
    terms: [],
    page: 1,
    pageSize: 25,
    contacts: [],
    count: 0,
    total: 0,
    isFiltered: false,
    order: null,
    sortColumn: null,
    isLoadingContacts: true,
    includes: null,
    isLoadingContact: true
  },

  getters: {
    activeTab: (state, allGetters, rootState) => {
      if (typeof rootState.route === 'undefined') {
        return ''
      }
      return (rootState.route.query.tab || 'overview')
    },

    contact: state => state.contact,

    getContactById: state => id => {
      return _.find(state.all, { id })
    },

    selectedContactIds: state => {
      return state.selected.map(contact => contact.id)
    },

    anyContactsSelected: (state, getters) => {
      return getters.selectedContactsNum >= 1
    },

    singleContactSelected: (state, getters) => {
      return getters.selectedContactsNum === 1
    },

    selectedContactsNum: state => {
      return state.selected.length
    },

    numOfContacts (state) {
      return state.all.length
    }
  },

  actions: {
    changeTab (context, name) {
      router.push({query: {tab: name}})
    },
    getContacts (context, params) {
      context.commit('setLoadingContacts', true)
      return axios.get('/contacts', {params: params})
        .then(res => {
          context.commit('setCount', res.data.count)
          context.commit('setFetchedContacts', res.data.contacts)
          context.commit('setTotal', res.data.total_count)
          context.commit('setLoadingContacts', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchContact ({ state, commit }, id) {
      commit('setLoadingContact', true)
      return axios.get(`/contacts/${id}`)
        .then(res => {
          commit('setContact', res.data)
          commit('setLoadingContact', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchSalesforceFieldsForContact ({ state, commit }, id) {
      return axios.get(`/contacts/${id}/salesforce_fields`)
        .then(res => {
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    getFilteredContacts (context, page) {
      context.commit('setLoadingContacts', true)
      return axios.post('/contacts/filter', {
        page: page,
        per_page: context.state.pageSize,
        terms: context.state.terms,
        prop: context.state.sortColumn,
        order: context.state.order,
        includes: context.state.includes
      })
        .then(response => {
          context.commit('setCount', response.data.count)
          context.commit('setFetchedContacts', response.data.contacts)
          context.commit('setTotal', response.data.total_count)
          context.commit('setLoadingContacts', false)
          Promise.resolve()
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          Promise.reject(err)
        })
    },

    applyContactFilter (context, terms) {
      context.commit('setPage', 1)
      context.commit('setFiltered', true)
      context.commit('setContactTerms', terms)
      return context.dispatch('getFilteredContacts', 1)
    },

    fetchContactsByAccount ({ commit }, id) {
      return axios.get(`/accounts/${id}/contacts`)
        .then(res => {
          commit('setContacts', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          Raven.captureException(err)
          console.error(err)
          return Promise.reject(err)
        })
    },

    fetchContactSegmentFields () {
      return axios.get('/contacts/filters')
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    updateContactInfo ({ state, commit }, {info}) {
      return axios.patch(`/contacts/${state.contact.id}`, {...info})
        .then(res => {
          commit('setContact', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },
    getContactsByIds ({state, getters}, ids) {
      let filteredContacts = []

      ids.forEach(function (id) {
        filteredContacts.push(getters.getContactById(id))
      })
      return filteredContacts
    },

    selectContacts ({ commit }, contacts) {
      commit('setSelectedContacts', contacts)
    },

    updateContact (context, contact) {
      context.commit('setContact', contact)
    },

    updateSortColumn (context, sortColumn) {
      context.commit('setSortColumn', sortColumn)
    },

    updateOrder (context, order) {
      context.commit('setOrder', order)
    },

    updateLoadingContacts (context, loading) {
      context.commit('setLoadingContacts', loading)
    },

    updateTotal (context, total) {
      context.commit('setTotal', total)
    },

    updatePage (context, page) {
      context.commit('setPage', page)
    },

    updateIncludes (context, includes) {
      context.commit('setIncludes', includes)
    },

    updateContactsFiltered (context, isFiltered) {
      context.commit('setFiltered', isFiltered)
    },

    resetContact (context) {
      context.commit('setContact', null)
    }
  },

  mutations: {
    setContacts (state, contacts) {
      state.all = contacts
    },

    setContact (state, contact) {
      state.contact = {...contact}
      const whiteList = [
        'address',
        'email',
        'first_name',
        'last_name',
        'phone',
        'time_zone',
        'title'
      ]
      state.contact.contactInfo = _.toPairs(_.pick(_.mapValues(contact, _.method('toString')), whiteList))
    },

    setContactsForNav (state, contacts) {
      state.navbar = contacts
    },

    setContactsFilterQuery (state, query) {
      state.filterQuery = query
    },

    setSelectedContacts (state, selected) {
      state.selected = selected
    },

    setInitialContactsCount (state, count) {
      state.initialAllCount = count
    },

    setSortColumn (state, sortColumn) {
      state.sortColumn = sortColumn
    },

    setOrder (state, order) {
      state.order = order
    },

    setLoadingContacts (state, loading) {
      state.isLoadingContacts = loading
    },

    setLoadingContact (state, loading) {
      state.isLoadingContact = loading
    },

    setTotal (state, total) {
      state.total = total
    },

    setFetchedContacts (state, contacts) {
      state.all = contacts
    },

    setCount (state, count) {
      state.count = count
    },

    setFiltered (state, isFiltered) {
      state.isFiltered = isFiltered
    },

    setContactTerms (state, terms) {
      state.terms = terms
    },

    setIncludes (state, includes) {
      state.includes = includes
    },

    setPage (state, page) {
      state.page = page
    }
  }
}
