import axios from 'axios'
import moment from 'moment-timezone'
import Raven from 'raven-js'
import _ from 'lodash'

export default {
  state: {
    all: [],
    selected: [],
    currentSelected: 0,
    filters: {
      created: [],
      customer: null,
      page: 1
    },
    tasks: [],
    fields: [],
    salesforceFields: {},
    currentNoteId: null,
    currentNoteTask: 0,
    noteViewId: -1,
    editableTask: null,
    isLoadingDefaultSfFields: true
  },

  getters: {
    currentNoteData: (state, getters) => {
      return state.all.find(note => note.id === state.currentNoteId)
    },

    currentNoteTaskData: (state, getters) => {
      return state.tasks[state.currentNoteTask]
    },

    numNoteTasks: (state, getters) => {
      return state.tasks.length
    },

    notesByAccount: (state, getters, rootState) => {
      const account = rootState.accounts.account

      if (!account) {
        return state.all
      }

      return state.all.filter(note => note.account && note.account.id === account.id)
    },

    filteredNotesByAccount: (state, getters, rootState) => {
      let notes = getters.notesByAccount

      notes = getters.notesFilteredByCustomer(notes)
      notes = getters.notesFilteredByCreated(notes)
      notes = getters.paginatedNotes(notes)

      return notes
    },

    notesByContact: (state, getters, rootState) => {
      const contact = rootState.contacts.contact

      if (!contact) {
        return state.all
      }

      return state.all.filter(note => note.contact && note.contact.id === contact.id)
    },

    filteredNotesByContact: (state, getters, rootState) => {
      let notes = getters.notesByContact

      notes = getters.notesFilteredByCustomer(notes)
      notes = getters.notesFilteredByCreated(notes)
      notes = getters.paginatedNotes(notes)

      return notes
    },

    noteView: (state) => {
      if (state.noteViewId === -1) {
        return null
      }

      return _.find(state.all, { id: state.noteViewId })
    },

    notesCurrentPage: state => {
      return state.filters.page
    },

    selectedNoteIds: state => {
      return state.selected.map(note => note.id)
    },

    notesNum: state => {
      return state.all.length
    },

    selectedNotesNum: state => {
      return state.selected.length
    },

    singleNoteSelected: (state, getters) => {
      return getters.selectedNotesNum === 1
    },

    firstSelectedNote: state => {
      return _.first(state.selected)
    },

    noteForEdit: (state, getters) => {
      const noteView = getters.noteView
      return noteView || getters.firstSelectedNote
    },

    currentSelectedNoteIndex: (state, getters) => {
      return state.currentSelected
    },

    currentSelectedNote: (state, getters) => {
      const index = getters.currentSelectedNoteIndex
      const notes = state.all

      return notes[index]
    },

    isThereNoNextNote: (state, getters) => {
      const index = getters.currentSelectedNoteIndex
      const notes = getters.notesNum

      if (index === (notes - 1)) {
        return true
      }

      return false
    },

    isThereNoPrevNote: (state, getters) => {
      const index = getters.currentSelectedNoteIndex

      if (index === 0) {
        return true
      }

      return false
    },

    isThereNextTask: (state, getters) => {
      if (state.currentNoteTask < state.tasks.length) {
        return true
      }

      return false
    },

    firstSelectedNoteId: (state, getters) => {
      if (_.isEmpty(getters.selectedNoteIds)) {
        if (!_.isEmpty(state.all)) {
          return _.head(state.all).id
        }

        return null
      }

      return _.head(getters.selectedNoteIds)
    },

    otherSelectedNoteIds: (state, getters) => {
      if (_.isEmpty(getters.selectedNoteIds)) {
        return []
      }

      return _.tail(getters.selectedNoteIds)
    },

    anyNotesSelected: (state, getters) => {
      return getters.selectedNotesNum >= 1
    },

    filteredNotesNum: (state, getters) => {
      return getters.filteredNotes.length
    },

    filteredNotes: (state, getters) => {
      let notes = state.all

      notes = getters.notesFilteredByCustomer(notes)
      notes = getters.notesFilteredByCreated(notes)
      notes = getters.paginatedNotes(notes)

      return notes
    },

    paginatedNotes: (state, getters) => notes => {
      const page = getters.notesCurrentPage

      if (page === 1) {
        return _.take(notes, 25)
      }

      const perPage = 25
      const offset = (page - 1) * perPage

      const paginated = _(notes).drop(offset).take(perPage).value()

      return paginated
    },

    notesFilteredByCustomer: state => notes => {
      if (!state.filters.customer) {
        return notes
      }

      return notes.filter(note => state.filters.customer === note.contact_id)
    },

    notesFilteredByCreated: state => notes => {
      if (_.isEmpty(state.filters.created)) {
        return notes
      }

      return notes.filter(note =>
        note.created_at &&
          moment(note.created_at)
            .isBetween(
              moment(_.first(state.filters.created)),
              moment(_.last(state.filters.created)),
              'days',
              '[]'
            )
      )
    }
  },

  actions: {
    addNoteTask ({ commit }, task) {
      commit('setAddNoteTask', { category: task, description: '', contact: null, account: null })
    },

    removeNoteTask ({ commit }, task) {
      commit('setRemoveNoteTask', task)
    },

    nextNoteTask ({ commit }) {
      commit('setNextNoteTask')
    },

    addNoteField ({ commit }, field) {
      commit('setAddNoteField', field)
    },

    removeNoteField ({ commit }, field) {
      commit('setRemoveNoteField', field)
    },

    updateNotePage ({ commit }, page) {
      commit('setNotePage', page)
    },

    fetchNotes ({ commit }) {
      return axios.get('/notes')
        .then(res => {
          commit('setNotes', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching notes', err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchNotesByAccount ({ commit }, id) {
      return axios.get(`/accounts/${id}/notes`)
        .then(res => {
          commit('setNotes', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching notes', err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchNotesByContact ({ commit }, id) {
      return axios.get(`/contacts/${id}/notes`)
        .then(res => {
          commit('setNotes', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching notes', err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    fetchSalesforceFields ({ commit }, id) {
      commit('setLoadingDefaultSfFields', true)
      return axios.get(`/api/v1.0/users/${id}/salesforce_fields`)
        .then(res => {
          commit('setSalesforceFields', res.data)
          commit('setLoadingDefaultSfFields', false)
          return Promise.resolve(res)
        })
        .catch(err => {
          console.error('Error fetching salesforce fields', err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    selectNotes ({ commit }, notes) {
      commit('setSelectedNotes', notes)
    },

    nextNote ({ state, commit, getters }) {
      const notes = getters.notesNum
      const current = getters.currentSelectedNoteIndex

      if ((current + 1) > (notes - 1)) {
        return
      }

      const account = state.all[current + 1].account
      const contact = state.all[current + 1].contact

      commit('setCurrentSelectedNote', current + 1)
      commit('setAccount', account)
      commit('setContact', contact)
    },

    prevNote ({ state, commit, getters }) {
      // const notes = getters.notesNum
      const current = getters.currentSelectedNoteIndex

      if (current === 0) {
        return
      }

      if ((current - 1) < 0) {
        return
      }

      const account = state.all[current - 1].account
      const contact = state.all[current - 1].contact

      commit('setCurrentSelectedNote', current - 1)
      commit('setAccount', account)
      commit('setContact', contact)
    },

    appendNoteFields ({ dispatch, commit }, fields) {
      fields.forEach(field => dispatch('addNoteField', field))
      // commit('setAppendNoteFields', fields)
    },

    appendNoteTasks ({ commit }, tasks) {
      commit('setAppendNoteTasks', tasks)
    },

    deleteNotes ({ dispatch, getters }, { id, destination }) {
      const deleted = getters.selectedNoteIds.map(noteId => dispatch('deleteNote', noteId))

      Promise.all(deleted)
        .then(res => {
          if (destination === 'dashboard') {
            return dispatch('fetchNotes')
          } else if (destination === 'account') {
            return dispatch('fetchNotesByAccount', id)
          } else if (destination === 'contact') {
            return dispatch('fetchNotesByContact', id)
          }

          return Promise.resolve(res)
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    deleteNote (context, id) {
      return axios.delete(`/notes/${id}`)
    },

    createNote ({ dispatch, commit }, { note, id, destination }) {
      return axios.post('/notes', note)
        .then(res => {
          commit('setNoteFields', [])
          commit('setCurrentNoteId', res.data.id)
          commit('setNoteViewId', -1)

          if (destination === 'dashboard') {
            return dispatch('fetchNotes')
          } else if (destination === 'account') {
            return dispatch('fetchNotesByAccount', id)
          } else if (destination === 'contact') {
            return dispatch('fetchNotesByContact', id)
          } else {
            return dispatch('fetchNotes')
          }
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    updateNote ({ dispatch, commit }, { data, noteId, id, destination }) {
      return axios.put(`/notes/${noteId}`, data)
        .then(res => {
          commit('setNoteFields', [])
          commit('setCurrentNoteId', res.data.id)
          commit('setNoteViewIdIfNotNull', res.data.id)

          if (destination === 'dashboard') {
            return dispatch('fetchNotes')
          } else if (destination === 'account') {
            return dispatch('fetchNotesByAccount', id)
          } else if (destination === 'contact') {
            return dispatch('fetchNotesByContact', id)
          }
        })
        .catch(err => {
          console.error(err)
          Raven.captureException(err)
          return Promise.reject(err)
        })
    },

    clearNoteTasks ({ commit }) {
      commit('setNoteTasks', [])
    },
    clearNoteFields ({ commit }) {
      commit('setNoteFields', [])
    },
    resetCurrentNoteTask ({ dispatch, commit }) {
      commit('setCurrentNoteTask', 0)
    }
  },

  mutations: {
    setNotes (state, notes) {
      state.all = notes
    },

    setSalesforceFields (state, fields) {
      state.salesforceFields = fields
    },

    setNoteTasks (state, tasks) {
      state.tasks = tasks
    },

    setAppendNoteFields (state, fields) {
      state.fields = state.fields.concat(fields)
    },

    setAppendNoteTasks (state, tasks) {
      state.tasks = state.tasks.concat(tasks)
    },

    updateNoteTask (state, task) {
      state.all[state.all.length - 1].tasks.push(task)
    },

    setSelectedNotes (state, notes) {
      state.selected = notes
    },

    setNotePage (state, page) {
      state.filters.page = page
    },

    setCurrentSelectedNote (state, current) {
      state.currentSelected = current
    },

    setNoteViewId (state, id) {
      state.noteViewId = id
    },

    setNoteViewIdIfNotNull (state, id) {
      if (state.noteViewId !== -1) {
        state.noteViewId = id
      }
    },

    setAddNoteTask (state, task) {
      task.id = state.tasks.length + 1
      task.ref = `noteTask${task.id}`
      state.tasks.push(task)
    },

    setRemoveNoteTask (state, task) {
      state.tasks = _.without(state.tasks, task)
    },

    setNoteFields (state, fields) {
      state.fields = fields
    },

    setEditableTask (state, task) {
      state.editableTask = task
    },

    setAddNoteField (state, field) {
      const hasKey = state.fields.some(noteField =>
        field.key === noteField.key &&
        field.owner === noteField.owner
      )

      if (hasKey) {
        return
      }

      state.fields.push(field)
    },

    setRemoveNoteField (state, field) {
      const index = state.fields.findIndex(el => el.key === field.key)
      if (index > -1) {
        state.fields.splice(index, 1)
      }
    },

    setCurrentNoteId (state, id) {
      state.currentNoteId = id
    },

    setNextNoteTask (state) {
      if (state.currentNoteTask === state.tasks.length) {
        state.currentNoteId = null
        state.currentNoteTask = 0
        return
      }

      state.currentNoteTask = state.currentNoteTask + 1
    },

    setCurrentNoteTask (state, current) {
      state.currentNoteTask = current
    },

    setLoadingDefaultSfFields (state, value) {
      state.isLoadingDefaultSfFields = value
    }
  }
}
