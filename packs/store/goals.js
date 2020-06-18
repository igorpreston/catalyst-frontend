import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'

axios.defaults.headers.common['X-CSRF-Token'] = document.getElementsByName(
  'csrf-token'
)[0].getAttribute('content')
axios.defaults.headers.common['Accept'] = 'application/json'

const state = {
  campaignId: '',
  comparisons: {
    'gt': 'Increase',
    'lt': 'Decrease'
  },
  criterias: {
    'product_usage': {
      'type': 'numeric',
      'label': 'Product Usage',
      'name': 'product_usage'
    },
    'link_clicks': {
      'type': 'numeric',
      'label': 'Link Clicks',
      'name': 'link_clicks'
    }
  },
  defaultGoal: {
    criteria: '',
    compare: '',
    threshold: ''
  },
  goal_ids: [],
  goals: {
    'default': {
      criteria: '',
      compare: '',
      threshold: ''
    }
  }
}

const mutations = {
  addGoal (state, goal_id) {
    if (state.goal_ids.indexOf(goal_id) === -1) {
      state.goal_ids.push(goal_id)
    }
  },
  deleteGoal (state, goal_id) {
    if (goal_id == 'default') {
      return false
    }

    let modified = _.clone(state.goals)
    delete modified[goal_id]

    Vue.set(state, 'goals', modified)
  },
  removeGoal (state, goal_id) {
    let index = state.goal_ids.indexOf(goal_id)
    if (index >= 0) {
      state.goal_ids.splice(index, 1)
    }
  },
  resetDefault (state) {
    Vue.set(state.goals, 'default', _.clone(state.defaultGoal))
  },
  saveGoal (state, goal) {
    Vue.set(state.goals, goal.id, goal)
  },
  setCampaignId (state, campaignId) {
    state.campaignId = campaignId
  }
}

const actions = {
  deleteGoal (context, obj) {
    return axios.delete(`/campaigns/${context.state.campaignId}/goals/${obj.id}`)
      .then(response => {
        context.commit('removeGoal', obj.id)
        context.commit('deleteGoal', obj.id)
        context.dispatch('manageDefault')
        return response
      })
  },
  loadCampaign (context, obj) {
    context.commit('setCampaignId', obj)

    axios.get(`/campaigns/${context.state.campaignId}/goals`)
      .then(response => {
        if (response.data.length > 0) {
          response.data.forEach(function (goal) {
            context.commit('addGoal', goal.id)
            context.commit('saveGoal', goal)
          })
        }
        context.dispatch('manageDefault')
      }).catch(err => {
        console.error(`/campaigns/${context.state.campaignId}/goals call failed`, err)
      })
  },
  manageDefault (context, obj) {
    // If doesn't have goals.
    if (!context.getters.hasGoals) {
      // Only add if don't already have a default.
      if (!context.getters.hasDefault) {
        context.commit('addGoal', 'default')
      }
    } else {
      // Has goals, remove the default if it exists.
      if (context.getters.hasDefault) {
        context.commit('removeGoal', 'default')
      }
    }

    context.commit('resetDefault')
  },
  saveGoal (context, obj) {
    return axios.post(`/campaigns/${context.state.campaignId}/goals/${obj.id || ''}`, {
      goal_id: obj.id,
      metric_id: obj.criteria,
      threshold: obj.threshold,
      compare: obj.compare
    })
      .then(response => {
        let goal = response.data
        context.commit('addGoal', goal.id)
        context.commit('saveGoal', goal)

        context.dispatch('manageDefault')

        return response
      })
  }
}

const getters = {
  goals: (state, getters) => {
    if (getters.hasGoals) {
      return _.map(state.goal_ids, id => state.goals[id])
    } else {
      return _.map(['default'], id => state.goals[id])
    }
  },
  hasDefault: (state, getters) => state.goal_ids.indexOf('default') >= 0,
  hasGoals: (state, getters) => state.goal_ids.length > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
