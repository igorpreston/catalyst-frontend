import axios from 'axios'
import _ from 'lodash'

export default {
  state: {
    all: [],
    filter: '',
    salesforceUser: null
  },

  getters: {
    filteredSalesforceUsers: (state) => {
      if (state.filter === '') {
        return _.take(state.all, 10)
      }
      const filtered = state.all.filter(salesforceUser =>
        salesforceUser.name.toLowerCase().indexOf(state.filter.toLowerCase()) > -1
      )
      if (filtered.length > 10) {
        return _.take(filtered, 10)
      }

      return filtered
    },

    salesforceUsersNum: state => {
      return state.all.length
    }
  },

  actions: {
    fetchSalesforceUsers ({ commit }) {
      return axios.get('/api/v1.0/salesforce_users')
        .then(res => {
          commit('setSalesforceUsers', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching salesforce users', err)
          return Promise.reject(err)
        })
    },

    filterSalesforceUsers ({ commit }, filter) {
      commit('setSalesforceUserFilter', filter)
    }
  },

  mutations: {
    setSalesforceUser (state, salesforceUser) {
      state.salesforceUser = salesforceUser
    },

    setSalesforceUsers (state, salesforceUsers) {
      state.all = salesforceUsers
    },

    setSalesforceUserFilter (state, filter) {
      state.filter = filter
    }
  }
}
