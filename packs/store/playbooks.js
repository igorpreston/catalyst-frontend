import axios from 'axios'
import _ from 'lodash'

const formDataDefault = () => ({
  name: '',
  description: '',
  active: true,
  object: '',
  conditions: [{}],
  actions: [{}]
})

const state = {
  all: [],
  filters: {
    my: false,
    my_team: false,
    page: 1
  },
  selected: [],
  form: formDataDefault(),
  playbookViewId: -1,
  campaigns: [],
  members: [],
  memberCount: 0
}

const getters = {
  playbooksNum: state => {
    return state.all.length
  },

  myPlaybooksNum: (state, getters, rootState) => {
    return state.all.filter(playbook => playbook.user_id === rootState.auth.currentUser.id).length
  },

  playBookCurrentPage: state => {
    return state.filters.page
  },

  filteredPlaybooks: (state, getters) => {
    let playbooks = state.all

    playbooks = getters.filteredByMyPlaybooks(playbooks)
    playbooks = getters.filteredByMyTeam(playbooks)
    playbooks = getters.paginatedPlaybooks(playbooks)

    return playbooks
  },

  filteredByMyPlaybooks: (state, getters, rootState) => playbooks => {
    if (!state.filters.my) {
      return playbooks
    }
    return playbooks.filter(playbook => playbook.user_id === rootState.auth.currentUser.id)
  },

  filteredByMyTeam: (state, getters, rootState) => playbooks => {
    if (state.filters.my_team) {
      return state.all
    }
    return playbooks
  },

  paginatedPlaybooks: (state, getters) => playbooks => {
    const page = getters.playBookCurrentPage

    if (page === 1) {
      return _.take(playbooks, 10)
    }

    const perPage = 10
    const offset = (page - 1) * perPage

    const paginated = _(playbooks).drop(offset).take(perPage).value()

    return paginated
  },

  playbookFormData: state => {
    return state.form
  },

  selectedPlaybooksNum: state => {
    return state.selected.length
  },

  anyPlaybooksSelected: (state, getters) => {
    return getters.selectedPlaybooksNum >= 1
  },

  singlePlaybookSelected: (state, getters) => {
    return getters.selectedPlaybooksNum === 1
  },

  selectedPlaybookIds: state => {
    return state.selected.map(playbook => playbook.id)
  },

  playbookView: (state) => {
    if (state.playbookViewId === -1) {
      return null
    }

    return _.find(state.all, { id: state.playbookViewId })
  },

  getCampaignNameById: state => id => {
    const campaign = _.find(state.campaigns, { id })

    return campaign && campaign.name
  }
}

const mutations = {
  setPlaybooks (state, playbooks) {
    state.all = playbooks
  },

  setPlaybooksPage (state, page) {
    state.filters.page = page
  },

  setPlaybookStatus (state, { id, status }) {
    _.find(state.all, { id }).active = status
  },

  setPlaybookFormdata (state, { key, value }) {
    state.form[key] = value
  },

  addCondition (state) {
    state.form.conditions.push({})
  },

  deleteCondition (state, index) {
    if (index !== 0 || state.form.conditions.length > 1) {
      state.form.conditions.splice(index, 1)
    } else {
      state.form.object = ''
      state.form.conditions = [{ type: '' }]
    }
  },

  setConditions (state, conditions) {
    state.form.conditions = conditions
  },

  setCondition (state, { index, condition, replace }) {
    console.log('condition', condition)
    let newConditions = [...state.form.conditions]
    if (replace) {
      newConditions[index] = {}
    } else {
      newConditions[index] = { ...newConditions[index], ...condition }
    }
    state.form.conditions = newConditions
  },

  addAction (state) {
    state.form.actions.push({})
  },

  deleteAction (state, index) {
    if (index !== 0 || state.form.actions.length > 1) {
      state.form.actions.splice(index, 1)
    } else {
      state.form.actions = [{ type: '' }]
    }
  },

  setAction (state, { index, action, replace }) {
    let newActions = [...state.form.actions]
    if (replace) {
      newActions[index] = action
    } else {
      newActions[index] = { ...newActions[index], ...action }
    }
    state.form.actions = newActions
  },

  resetPlaybookFormData (state) {
    state.form = formDataDefault()
  },

  updateFilters (state, filters) {
    ['my', 'my_team'].forEach((f) => { state.filters[f] = false })
    filters.forEach((f) => { state.filters[f] = true })
  },

  setSelectedPlaybooks (state, playbooks) {
    state.selected = playbooks
  },

  setPlaybookViewId (state, id) {
    state.playbookViewId = id
  },

  setPlaybookViewIdIfNotNull (state, id) {
    if (state.playbookViewId !== -1) {
      state.playbookViewId = id
    }
  },

  setPlaybookFormData (state, form) {
    state.form = form
  },

  setCampaigns (state, campaigns) {
    state.campaigns = campaigns
  },

  setMembers (state, members) {
    state.members = members
  },

  setMemberCount (state, count) {
    state.memberCount = count
  }
}

const actions = {
  fetchPlaybooks ({ commit }) {
    return axios.get('/playbooks.json')
      .then(res => {
        commit('setPlaybooks', res.data)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error('Error fetching playbooks', err)
      })
  },

  onDeleteCondition ({commit, dispatch}, index) {
    commit('deleteCondition', index)
    return dispatch('filterMembers')
  },

  updatePlaybook ({ dispatch }, { id, data }) {
    return axios.patch(`/playbooks/${id}`, data)
      .then(res => {
        return dispatch('fetchPlaybooks')
      })
      .catch(err => console.error('Error updating playbooks', err))
  },

  createPlaybook ({ commit, dispatch, rootState }, { data }) {
    return axios.post('/playbooks', { ...data, user_id: rootState.auth.currentUser.id })
      .then(res => {
        commit('resetPlaybookFormData')
        dispatch('fetchPlaybooks')
        return Promise.resolve(res)
      })
      .catch(err => console.error('Error creating playbook', err))
  },

  updatePlaybookStatus ({ commit }, { id, status }) {
    return axios.patch(`/playbooks/${id}`, { active: status })
      .then(res => {
        commit('setPlaybookStatus', { id, status })
        return Promise.resolve(res)
      })
      .catch((err) => console.error(err))
  },

  selectPlaybooks ({ commit }, playbooks) {
    commit('setSelectedPlaybooks', playbooks)
  },

  deletePlaybook (context, id) {
    return axios.delete(`/playbooks/${id}`)
  },

  deletePlaybooks ({ dispatch, getters }) {
    const deleted = getters.selectedPlaybookIds.map(playbookId => dispatch('deletePlaybook', playbookId))

    Promise.all(deleted)
      .then(res => {
        dispatch('fetchPlaybooks')
        return Promise.resolve(res)
      })
      .catch((err) => console.error(err))
  },

  updatePlaybookForm ({ commit, state }) {
    if (state.selected.length === 1) {
      commit('setPlaybookFormData', state.selected[0])
    }
  },

  fetchCampaigns ({ commit }) {
    return axios.get('/campaigns.json')
      .then(res => {
        commit('setCampaigns', res.data)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
      })
  },

  filterMembers ({ state, commit }, playbook = { object: '', conditions: null }) {
    const getMembers = {
      object: playbook.object || state.form.object,
      conditions: playbook.conditions || state.form.conditions
    }

    return axios.post('/playbooks/preview.json', getMembers)
      .then(res => {
        commit('setMembers', res.data.entities)
        commit('setMemberCount', res.data.count)
        return Promise.resolve(res)
      })
      .catch(err => {
        console.error(err)
        commit('setMembersIds', [])
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
