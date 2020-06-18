import axios from 'axios'

const state = {
  ticket: {},
  tickets: []
}

const mutations = {
  setTicket (state, ticket) {
    state.ticket = ticket
  },
  setTickets (state, tickets) {
    state.tickets = tickets
  }
}

const actions = {
  fetchTicketsByAccount ({commit, getters}, id) {
    return axios.get(`/tickets/account/${id}`)
      .then((res) => {
        commit('setTickets', res.data)
        return Promise.resolve(res)
      })
      .catch((err) => {
        console.error('Failed to get tickets by account', id, err)
        return Promise.reject(err)
      })
  },

  updateTicket ({commit}, ticket) {
    commit('updateTicket', ticket)
  }

  // async replyTicket (context, comment) {
  //   await axios.post(`/ticket/${state.ticket.id}`, {comment: comment})
  //        .then(response => console.log('Successfully replied to ticket'))
  //        .catch(err => console.log('Failed to reply to ticket'))
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
