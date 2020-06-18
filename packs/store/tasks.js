import axios from 'axios'
import Raven from 'raven-js'
import _ from 'lodash'
import router from '../router'

const emailFormDefault = () => ({
  recipient: null,
  subject: null,
  text_plain: null,
  text_html: null
})

const callFormDefault = () => ({
  recipient: null,
  contactFilterQuery: '',
  title: null,
  text_plain: null,
  text_html: null,
  sync: false,

  taskFormOpened: false,

  taskAccount: null,
  taskContact: null,

  taskDescription: '',

  taskType: null,
  taskPriority: false,

  taskDueDate: null,
  taskDueTime: null,

  taskUser: null,

  taskAccountFilterQuery: '',
  taskContactFilterQuery: '',
  taskUserFilterQuery: ''
})

export default {
  state: {
    all: [],
    task: null,
    selected: [],
    reviewIds: [],
    reviewIndex: 0,
    reviewBackUrl: '',
    filters: {
      status: [false],
      type: ['to_do', 'email', 'call'],
      due: [],
      owner_id: null
    },
    forms: {
      email: emailFormDefault(),
      call: callFormDefault()
    },
    page: 1,
    pageSize: 25,
    count: 0,
    total: 0,
    order: null,
    sortColumn: null,
    isLoadingTasks: true,
    includes: null,
    isLoadingTask: true
  },

  getters: {
    selectedTaskIds: state => {
      return state.selected.map(task => task.id)
    },

    reviewNum: state => {
      return state.reviewIds.length
    },

    selectedTasksNum: state => {
      return state.selected.length
    },

    singleTaskSelected: (state, getters) => {
      return getters.selectedTasksNum === 1
    },

    firstSelectedTask: state => {
      return _.first(state.selected)
    },

    reviewIndex: (state, getters) => {
      return state.reviewIndex
    },

    isThereNoNextTask: (state, getters) => {
      const index = getters.reviewIndex
      const tasks = getters.reviewNum

      if (index === (tasks - 1)) {
        return true
      }

      return false
    },

    isThereNoPrevTask: (state, getters) => {
      const index = getters.reviewIndex

      if (index === 0) {
        return true
      }

      return false
    },

    anyTasksSelected: (state, getters) => {
      return getters.selectedTasksNum >= 1
    },

    getColorWithStatus: state => isCompleted => {
      if (isCompleted) {
        return {
          text_color: 'light-gray-accent',
          desp_color: 'light-gray',
          icon_color: 'light-gray-accent',
          icon_bg_color: 'b--light-gray bg-off-white'
        }
      } else {
        return {
          text_color: 'dark-gray',
          desp_color: 'mid-gray',
          icon_color: 'purple',
          icon_bg_color: 'b--purple-gray bg-off-purple'
        }
      }
    },

    tasksFilters: state => tasks => {
      return state.filters
    },

    alteredUsers: (state, getters, rootState) => {
      const altered = rootState.users.all.map(user => {
        const isCurrent = user.id === rootState.auth.currentUser.id
        return {
          ...user,
          name: user.name + (isCurrent ? ' (Me)' : ''),
          name_initials: isCurrent ? 'ME' : user.name_initials
        }
      })
      if (rootState.users.filter === '') {
        return _.take(altered, 10)
      }
      const filtered = altered.filter(user =>
        user.name.toLowerCase().indexOf(rootState.users.filter.toLowerCase()) > -1
      )
      if (filtered.length > 10) {
        return _.take(filtered, 10)
      }
      return filtered
    },

    getReviewIndex: (state) => id => {
      return state.reviewIds.findIndex(reviewId => reviewId === id)
    },

    getDestinationId: (state, getters, rootState) => destination => {
      let id = null
      if (destination === 'account') {
        id = rootState.accounts.account && rootState.accounts.account.id
      } else if (destination === 'contact') {
        id = rootState.contacts.contact && rootState.contacts.contact.id
      }
      return id
    }
  },

  actions: {
    updateTaskPage ({ commit }, page) {
      commit('setTaskPage', page)
    },

    getTasks (context, page) {
      context.commit('setLoadingTasks', true)
      const taskParams = {
        filter_conditions: context.state.filters,
        page: page,
        per_page: context.state.pageSize,
        prop: context.state.sortColumn,
        order: context.state.order,
        includes: context.state.includes
      }
      return axios.post('/tasks/filter', {task: taskParams, page: page, per_page: context.state.pageSize})
        .then(response => {
          context.commit('setCount', response.data.count)
          context.commit('setTasks', response.data.tasks)
          context.commit('setTotal', response.data.total_count)
          context.commit('setLoadingTasks', false)
          return Promise.resolve()
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchTask ({state, commit}, id) {
      commit('setLoadingTask', false)
      return axios.get(`/tasks/${id}`)
        .then(res => {
          commit('setTask', res.data)
          commit('setLoadingTask', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching task', id, err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchTasksByAccount (context, params) {
      context.commit('setLoadingTasks', true)
      const taskParams = {
        filter_conditions: context.state.filters,
        account_id: params.id,
        page: params.page,
        per_page: context.state.pageSize,
        prop: context.state.sortColumn,
        order: context.state.order,
        includes: context.state.includes
      }
      return axios.post('/tasks/filter', {task: taskParams, page: params.page, per_page: context.state.pageSize})
        .then(res => {
          context.commit('setTasks', res.data.tasks)
          context.commit('setCount', res.data.count)
          context.commit('setTotal', res.data.total_count)
          context.commit('setLoadingTasks', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching tasks by account', params.id, err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchTasksByContact (context, params) {
      context.commit('setLoadingTasks', true)
      const taskParams = {
        filter_conditions: context.state.filters,
        contact_id: params.id,
        page: params.page,
        per_page: context.state.pageSize,
        prop: context.state.sortColumn,
        order: context.state.order,
        includes: context.state.includes
      }
      return axios.post('/tasks/filter', {task: taskParams, page: params.page, per_page: context.state.pageSize})
        .then(res => {
          context.commit('setLoadingTasks', false)
          context.commit('setTasks', res.data.tasks)
          context.commit('setCount', res.data.count)
          context.commit('setTotal', res.data.total_count)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching tasks by contact', params.id, err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchTasksByDestination ({ getters, dispatch }, { page, destination, id }) {
      const tempId = id || getters.getDestinationId(destination)
      if (destination === 'dashboard') {
        return dispatch('getTasks', page)
      } else if (destination === 'account') {
        return dispatch('fetchTasksByAccount', {page: page, id: tempId})
      } else if (destination === 'contact') {
        return dispatch('fetchTasksByContact', {page: page, id: tempId})
      }
    },

    selectTasks ({ commit }, tasks) {
      commit('setSelectedTasks', tasks)
    },

    nextTask ({ state, commit, getters, dispatch }) {
      const reviewNum = getters.reviewNum
      const current = getters.reviewIndex

      if ((current + 1) >= reviewNum) {
        return
      }

      // const account = state.review[current + 1].account
      // const contact = state.review[current + 1].contact

      commit('setReviewIndex', current + 1)
      // commit('account/updateAccount', account)
      // if (account) {
      //   dispatch('fetchTasksByAccount', account.id)
      // }
      // if (contact) {
      //   dispatch('fetchTasksByContact', contact.id)
      // }
      // commit('setContact', contact)
      // commit('resetFormdata')
      commit('setNoteFields', [])
      const newTaskId = state.reviewIds[current + 1]
      router.push({path: `/tasks/${newTaskId}`})

      // dispatch('account/updateContacts')
    },

    prevTask ({ state, commit, getters, dispatch }) {
      const current = getters.reviewIndex

      if ((current - 1) < 0) {
        return
      }

      // const account = state.review[current - 1].account
      // const contact = state.review[current - 1].contact

      commit('setReviewIndex', current - 1)
      // commit('account/updateAccount', account)
      // if (account) {
      //   dispatch('fetchTasksByAccount', account.id)
      // }
      // if (contact) {
      //   dispatch('fetchTasksByContact', contact.id)
      // }
      // commit('setContact', contact)
      // commit('resetFormdata')
      commit('setNoteFields', [])
      const newTaskId = state.reviewIds[current - 1]
      router.push({path: `/tasks/${newTaskId}`})

      // dispatch('account/updateContacts')
    },

    deleteTasks ({ dispatch, getters }) {
      const tasks = getters.selectedTaskIds.map(id => dispatch('deleteTask', id))

      return Promise.all(tasks)
        .catch(err => {
          console.error('Error deleting selected tasks', err)
          return Promise.reject(err)
        })
    },

    rescheduleTasks ({ dispatch, getters }, { data }) {
      const tasks = getters.selectedTaskIds.map(id => dispatch('rescheduleTask', { id, data }))

      return Promise.all(tasks)
        .catch(err => {
          console.error('Error rescheduling selected tasks', err)
          return Promise.reject(err)
        })
    },

    rescheduleTask (context, { id, data }) {
      return axios.patch(`/tasks/${id}`, data)
        .catch(err => {
          console.error('Error rescheduling task', id, err)
          return Promise.reject(err)
        })
    },

    deleteTask (context, id) {
      return axios.delete(`/tasks/${id}`)
        .catch(err => {
          console.error('Error deleting task', id, err)
          return Promise.reject(err)
        })
    },

    createTask ({ dispatch }, {data}) {
      return axios.post('/tasks', data)
        .catch(err => {
          console.error('Error creating task', err)
          return Promise.reject(err)
        })
    },

    updateTask ({ dispatch }, { data, id }) {
      return axios.put(`/tasks/${id}`, data)
        .catch(err => {
          console.error('Error updating task', id, err)
          return Promise.reject(err)
        })
    },

    completeTask ({ dispatch, commit, state, getters }, data) {
      const id = state.task && state.task.id

      if (!id) {
        return Promise.resolve()
      }

      return axios.patch(`/tasks/${id}/complete`, data)
        .then(res => {
          state.task.is_completed = true
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error completing task', id, err)
          return Promise.reject(err)
        })
    },

    completeTodoTask ({ dispatch }) {
      return dispatch('completeTask', {})
    },

    completeEmailTask ({ dispatch }, data) {
      return dispatch('completeTask', data)
    },

    completeCallTask ({ dispatch }) {
      return dispatch('completeTask')
    },

    undoCompleteTask ({ dispatch, commit, state, getters }) {
      const id = state.task && state.task.id

      if (!id) {
        return Promise.resolve()
      }

      return axios.patch(`/tasks/${id}/undo_complete`)
        .then(res => {
          state.task.is_completed = false
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error undo completing task', id, err)
          return Promise.reject(err)
        })
    },

    updateSortColumn (context, sortColumn) {
      context.commit('setSortColumn', sortColumn)
    },

    updateOrder (context, order) {
      context.commit('setOrder', order)
    },

    updateLoadingTasks (context, loading) {
      context.commit('setLoadingTasks', loading)
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

    reviewTasks ({dispatch}, params) {
      return axios.post('/tasks/review', {review_ids: params.taskIds, filter_conditions: params.filterConditions})
        .then(res => {
          window.location = `/tasks/${params.clickedTaskId ? params.clickedTaskId : params.taskIds[0]}`
        })
        .catch(err => {
          console.error('Error reviewing task', err)
          return Promise.reject(err)
        })
    },

    resetFormdata ({state}) {
      state.forms['email'] = emailFormDefault()
      state.forms['call'] = callFormDefault()

    // Contact for the forms to know whether we need to pre-select or no
    // const contact = state.review[state.currentSelected].contact

    // if (contact) {
    //   state.forms['email'].recipient = contact.id
    //   state.forms['call'].recipient = contact.id
    // }
    },

    updateReviewIndex ({commit, getters}, id) {
      commit('setReviewIndex', getters.getReviewIndex(id))
    },

    updateFilter (context, params) {
      context.commit('setFilters', params)
    }
  },

  mutations: {
    setSortColumn (state, sortColumn) {
      state.sortColumn = sortColumn
    },

    setOrder (state, order) {
      state.order = order
    },

    setLoadingTasks (state, loading) {
      state.isLoadingTasks = loading
    },

    setLoadingTask (state, loading) {
      state.isLoadingTask = loading
    },

    setTotal (state, total) {
      state.total = total
    },

    setCount (state, count) {
      state.count = count
    },

    setTerms (state, terms) {
      state.terms = terms
    },

    setPage (state, page) {
      state.page = page
    },

    setIncludes (state, includes) {
      state.includes = includes
    },

    setTasks (state, tasks) {
      state.all = tasks
    },

    setTask (state, task) {
      state.task = task
    },

    setTasksForReview (state, tasks) {
      state.review = tasks
    },

    setSelectedTasks (state, tasks) {
      state.selected = tasks
    },

    setTaskPage (state, page) {
      state.filters.page = page
    },

    setReviewIndex (state, index) {
      state.reviewIndex = index
    },

    setReviewBackUrl (state, url) {
      state.reviewBackUrl = url
    },

    setReviewIds (state, reviewIds) {
      state.reviewIds = reviewIds
    },

    setFormdata (state, [ formKey, key, value ]) {
      state.forms[formKey][key] = value
    },

    setFilters (state, payload) {
      state.filters[payload.field] = payload.value
    }
  }
}
