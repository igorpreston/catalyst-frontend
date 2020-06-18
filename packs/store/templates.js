import axios from 'axios'
import moment from 'moment-timezone'
import _ from 'lodash'

const state = {
  all: [],
  selected: [],
  template: null,
  filters: {
    type: ['to_do', 'call', 'email'],
    created_by: null,
    created_at: [],
    page: 1
  },
  tasks: [],
  fields: [],
  tokens: [],
  category: null,
  randomContacts: []
}

const getters = {
  templatesNum: state => {
    return state.all.length
  },

  isTemplatePresent: state => {
    return state.template
  },

  currentTemplate: state => {
    return state.all.find(template => template.id === state.template)
  },

  selectedTemplateIds: state => {
    return state.selected.map(template => template.id)
  },

  anyTemplatesSelected: (state, getters) => {
    return getters.selectedTemplatesNum >= 1
  },

  singleTemplateSelected: (state, getters) => {
    return getters.selectedTemplatesNum === 1
  },

  selectedTemplatesNum: state => {
    return state.selected.length
  },

  filteredTemplatesNum: (state, getters) => {
    return getters.filteredTemplates.length
  },

  firstSelectedTemplate: state => {
    return _.first(state.selected)
  },

  noteTemplates: state => {
    return state.all.filter(template => template.category === 'note')
  },

  emailTemplates: state => {
    return state.all.filter(template => template.category === 'email')
  },

  templatesFilteredByType: state => templates => {
    if (state.filters.type === 'all') {
      return templates
    }

    return templates.filter(template => state.filters.type === template.category)
  },

  templatesFilteredByCreatedBy: state => templates => {
    if (_.isEmpty(state.filters.created_by)) {
      return templates
    }

    return templates.filter(template => state.filters.created_by === template.created_by_id)
  },

  templatesFilteredByCreatedAt: state => templates => {
    if (_.isEmpty(state.filters.created_at)) {
      return templates
    }

    return templates.filter(template =>
      template.created_at &&
      moment(template.created_at)
        .isBetween(
          moment(_.first(state.filters.created_at)),
          moment(_.last(state.filters.created_at)),
          'days',
          '[]'
        )
    )
  },

  filteredTemplates: (state, getters) => {
    let templates = state.all

    templates = getters.templatesFilteredByType(templates)
    templates = getters.templatesFilteredByCreatedBy(templates)
    templates = getters.templatesFilteredByCreatedAt(templates)
    templates = getters.paginatedTemplates(templates)

    return templates
  },

  filteredTemplatesByNote: (state, getters) => {
    let templates = getters.noteTemplates

    templates = getters.templatesFilteredByType(templates)
    templates = getters.templatesFilteredByCreatedBy(templates)
    templates = getters.templatesFilteredByCreatedAt(templates)
    templates = getters.paginatedTemplates(templates)

    return templates
  },

  filteredTemplatesByEmail: (state, getters) => {
    let templates = getters.emailTemplates

    templates = getters.templatesFilteredByType(templates)
    templates = getters.templatesFilteredByCreatedBy(templates)
    templates = getters.templatesFilteredByCreatedAt(templates)
    templates = getters.paginatedTemplates(templates)

    return templates
  },

  templatesCurrentPage: state => {
    return state.filters.page
  },

  paginatedTemplates: (state, getters) => templates => {
    const page = getters.templatesCurrentPage

    if (page === 1) {
      return _.take(templates, 25)
    }

    const perPage = 25
    const offset = (page - 1) * perPage

    const paginated = _(templates).drop(offset).take(perPage).value()

    return paginated
  },

  getTemplateNameById: state => id => {
    const template = _.find(state.all, { id })

    return template && template.name
  }
}

const actions = {
  addTemplateField ({ commit }, field) {
    commit('setAddTemplateField', field)
  },

  removeTemplateField ({ commit }, field) {
    commit('setRemoveTemplateField', field)
  },

  addTemplateTask ({ commit }, task) {
    commit('setAddTemplateTask', task)
  },

  removeTemplateTask ({ commit }, task) {
    commit('setRemoveTemplateTask', task)
  },

  addTemplateToken ({ commit }, token) {
    commit('setAddTemplateToken', token)
  },

  removeTemplateToken ({ commit }, token) {
    commit('setRemoveTemplateToken', token)
  },

  fetchTemplates ({ commit }) {
    axios.get('/templates')
      .then(res => commit('setTemplates', res.data))
      .catch(err => console.error('Error fetching templates', err))
  },

  createTemplate ({ dispatch, commit }, { template }) {
    return new Promise((resolve, reject) => {
      axios.post('/templates', template)
        .then(res => {
          dispatch('fetchTemplates')
          commit('setTemplateFields', [])
          commit('setTemplateTasks', [])
          commit('setTemplateTokens', [])

          resolve()
        })
        .catch(err => reject(err))
    })
  },

  selectTemplates ({ commit }, templates) {
    commit('setSelectedTemplates', templates)
  },

  deleteTemplates ({ dispatch, getters }) {
    const deleted = getters.selectedTemplateIds.map(templateId => dispatch('deleteTemplate', templateId))

    Promise.all(deleted)
      .then(res => {
        return dispatch('fetchTemplates')
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(err)
      })
  },

  deleteTemplate (context, id) {
    return axios.delete(`/templates/${id}`)
  },

  updateTemplate ({ dispatch, commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      axios.put(`/templates/${id}`, data)
        .then(res => {
          dispatch('fetchTemplates')
          commit('setTemplateFields', [])
          commit('setTemplateTasks', [])

          resolve()
        })
        .catch(err => reject(err))
    })
  }
}

const mutations = {
  setTemplate (state, template) {
    state.template = template
  },

  setTemplateCategory (state, category) {
    state.category = category
  },

  setSelectedTemplates (state, selected) {
    state.selected = selected
  },

  setTemplateFields (state, fields) {
    state.fields = fields
  },

  setTemplateTasks (state, tasks) {
    state.tasks = tasks
  },

  setTemplateTokens (state, tokens) {
    state.tokens = tokens
  },

  setAddTemplateField (state, field) {
    if (_.includes(state.fields, field)) {
      return
    }

    state.fields.push(field)
  },

  setRemoveTemplateField (state, field) {
    state.fields = _.without(state.fields, field)
  },

  setAddTemplateTask (state, task) {
    let newTask = {
      id: state.tasks.length + 1,
      category: task,
      description: ''
    }

    state.tasks.push(newTask)
  },

  setRemoveTemplateTask (state, task) {
    state.tasks = _.without(state.tasks, task)
  },

  setAddTemplateToken (state, token) {
    state.tokens.push(token)
  },

  setRemoveTemplateToken (state, token) {
    state.tokens = _.without(state.tokens, token)
  },

  setTemplates (state, templates) {
    state.all = templates
  },

  setRandomContacts (state, contacts) {
    state.randomContacts = contacts
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
