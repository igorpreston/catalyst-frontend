import axios from 'axios'
import Raven from 'raven-js'
import _ from 'lodash'
export const sidepanel = {
  methods: {
    getAccounts (accountQuery = null, forNav = false) {
      let query = (accountQuery === null || accountQuery === '') ? null : accountQuery
      return axios.get('/accounts', {params: {page: 1, per_page: 25, query: query}})
        .then((res) => {
          if (forNav) {
            this.setAccountsForNav(_.map(res.data.accounts, (a) => _.extend({}, a, {type: 'account'})))
            return
          }
          this.accounts = res.data.accounts
          return Promise.resolve()
        })
        .catch((err) => {
          Raven.captureException(err)
        })
    },

    getContacts (contactQuery = null, forNav = false) {
      let query = (contactQuery === null || contactQuery === '') ? null : contactQuery
      return axios.get('/contacts', {params: {page: 1, per_page: 25, query: query}})
        .then((res) => {
          if (forNav) {
            this.setContactsForNav(_.map(res.data.contacts, (c) => _.extend({}, c, {type: 'contact'})))
            return
          }
          this.contacts = res.data.contacts
          return Promise.resolve()
        })
        .catch((err) => {
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchContactsByAccount (accountId) {
      return axios.get(`/accounts/${accountId}/contacts`)
        .then((res) => {
          this.contacts = res.data
          return Promise.resolve()
        })
        .catch((err) => {
          Raven.captureException(err)
          return Promise.reject(err)
        })
    }
  }
}
