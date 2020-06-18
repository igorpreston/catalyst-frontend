import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'

axios.defaults.headers.common['X-CSRF-Token'] = document.getElementsByName(
  'csrf-token'
)[0].getAttribute('content')
axios.defaults.headers.common['Accept'] = 'application/json'

const initialState = {
  activeInputIndex: 0,
  activeRowIndex: 0,
  rows: [
    {
      inputs: [{ name: '', type: 'initial' }]
    }
  ],
  results: [],
  suggestions: [],
  cacheSuggestions: [[]],
  baseEndpoint: '',
  operators: [
    {
      name: 'is at least',
      allowedAfter: ['integer', 'decimal'],
      openFieldsAfter: [{}]
    },
    {
      name: 'is less than',
      allowedAfter: ['integer', 'decimal'],
      openFieldsAfter: [{}]
    },
    {
      name: 'is between',
      allowedAfter: ['integer', 'decimal'],
      openFieldsAfter: [{ trailingText: 'and' }, {}]
    },
    {
      name: 'is',
      allowedAfter: ['string', 'text', 'jsonb', 'enum', 'integer', 'decimal'],
      openFieldsAfter: [{}]
    },
    {
      name: 'is not',
      allowedAfter: ['string', 'text', 'jsonb', 'enum', 'integer', 'decimal'],
      openFieldsAfter: [{}]
    },
    {
      name: 'is blank',
      allowedAfter: 'nullable'
    },
    {
      name: 'is not blank',
      allowedAfter: 'nullable'
    },
    {
      name: 'is true',
      allowedAfter: ['boolean']
    },
    {
      name: 'is false',
      allowedAfter: ['boolean']
    },
    { // uses event quantity operator after
      name: 'has happened',
      type: 'eventPerformed',
      allowedAfter: ['event'],
      timeTrigger: true
    },
    { // does not use event quantity operator after
      name: 'has not happened',
      type: 'eventNotPerformed',
      allowedAfter: ['event'],
      timeTrigger: true
    },
    { // within
      name: 'within',
      allowedAfter: ['eventPerformed', 'eventNotPerformed']
    },
    {
      name: 'between',
      allowedAfter: ['eventPerformed'],
      openFieldsAfter: [{ trailingText: 'and' }, { trailingText: 'times within' }]
    },
    {
      name: 'less than',
      allowedAfter: ['eventPerformed'],
      openFieldsAfter: [{ trailingText: 'times in' }]
    },
    {
      name: 'exactly',
      allowedAfter: ['eventPerformed'],
      openFieldsAfter: [{ trailingText: 'times in' }]
    },
    {
      name: 'greater than',
      allowedAfter: ['eventPerformed'],
      openFieldsAfter: [{ trailingText: 'times in' }]
    }
  ].map(op => { op.type = op.type || 'operator'; return op })
}

const state = _.cloneDeep(initialState)

// define the possible mutations that can be applied to our state
const mutations = {
  setBaseEndpoint (state, baseEndpoint) {
    state.baseEndpoint = baseEndpoint
  },
  setRows (state, rows) {
    state.rows = rows
  },
  setCacheSuggestions (state, suggestions) {
    state.cacheSuggestions = suggestions
  },
  addRow (state) {
    state.rows.push({
      inputs: [{ name: '', type: 'initial' }]
    })
    state.cacheSuggestions.push([])
    state.activeRowIndex = state.rows.length - 1
    state.activeInputIndex = 0
  },
  addInput (state, input) {
    const currentRow = state.rows[state.activeRowIndex]
    currentRow.inputs = currentRow.inputs.slice(0, state.activeInputIndex + 1 + input.index)
    currentRow.inputs.push(input.input)
  },
  updateSuggestion (state, suggestions) {
    state.suggestions = suggestions
    if (state.activeRowIndex < 0) return
    state.cacheSuggestions[state.activeRowIndex].push(suggestions)
  },
  makeInputActive (state, activeRowAndInputIndices) {
    state.activeRowIndex = activeRowAndInputIndices.activeRowIndex
    state.activeInputIndex = activeRowAndInputIndices.activeInputIndex
  },
  updateInputName (state, name) {
    if (state.activeRowIndex < 0 || state.activeInputIndex < 0) return
    const activeInput = state.rows[state.activeRowIndex].inputs[state.activeInputIndex]
    activeInput.name = name
    state.cacheSuggestions[state.activeRowIndex] = state.cacheSuggestions[state.activeRowIndex].slice(0, state.activeInputIndex + 1)
  },
  updateNullable (state) {
    if (state.activeRowIndex < 0 || state.activeInputIndex < 0) return
    const activeInput = state.rows[state.activeRowIndex].inputs[state.activeInputIndex]
    activeInput.nullable = true
  },
  updateInputType (state, type) {
    if (state.activeRowIndex < 0 || state.activeInputIndex < 0) return
    const activeInput = state.rows[state.activeRowIndex].inputs[state.activeInputIndex]
    activeInput.type = type
  },
  setResults (state, results) {
    state.results = results
  },
  clearResults (state) {
    state.results = []
  },
  resetState (state) {
    Object.assign(state, _.cloneDeep(initialState))
  },
  deleteRow (state, rowIndex) {
    state.rows.splice(rowIndex, 1)
    state.cacheSuggestions.splice(rowIndex, 1)
    state.activeRowIndex = -1
    state.activeInputIndex = -1
    state.suggestions = []
  },
  updateFocus () {
    if (state.activeRowIndex < 0) return
    let index = _.findIndex(state.rows[state.activeRowIndex].inputs, (i) => i.name === '')
    state.activeInputIndex = index
  },
  removeFocus () {
    state.activeInputIndex = -1
    state.activeRowIndex = -1
  },
  clearSuggestions () {
    state.suggestions = []
  },
  clearInputsAfter () {
    const currentRow = state.rows[state.activeRowIndex]
    currentRow.inputs = currentRow.inputs.slice(0, state.activeInputIndex + 1)
  },
  updateStar (state, obj) {
    let index = _.findIndex(state.results, (o) => o.id === obj.id)
    state.results[index].starred = obj.starred
  }
}

const actions = {
  updateSuggestion (context, suggestions) {
    if (!context.getters.immutableForRowIndex(context.state.activeRowIndex)) {
      context.commit('updateSuggestion', suggestions)
    }
  },
  async performSearch (context) {
    return await axios.post(`/${context.getters.baseEndpoint}/search`, {
      terms: context.getters.searchTerms
    }).then((r) => {
      context.commit('setResults', r.data)
    })
  },
  requestSuggestions (context) {
    if (context.getters.immutableForRowIndex(context.state.activeRowIndex)) return
    if (_.isEmpty(context.getters.baseEndpoint)) return
    if (context.getters.isSuggestionCached) {
      return context.commit(
        'updateSuggestion', context.getters.cachedSuggestions
      )
    }

    let inputs = context.getters.inputNamesSoFarForRow
    axios.get(`/${context.getters.baseEndpoint}/terms`, {
      params: {
        terms: inputs
      }
    }).then(response => {
      context.commit('updateSuggestion', response.data)
    })
  },
  starAccount(context, obj){
    context.commit('updateStar', obj)
  }
}

const getters = {
  rows: state => state.rows,
  baseEndpoint: state => state.baseEndpoint,
  hasResults: state => state.results.length,
  results: state => state.results,
  inputsForRowIndex: state => rowIndex => state.rows[rowIndex].inputs,
  immutableForRowIndex: state => rowIndex => state.rows[rowIndex].variant === 'immutable',
  inputForRowAndInputIndex: state => (rowIndex, inputIndex) => state.rows[rowIndex].inputs[inputIndex],
  rowsCompleted: state => {
    return state.rows.every(row => _.some(row.inputs, (input) => {
      return input.type === 'operator'
    }) && row.inputs.every(input => input.name !== ''))
  },
  searchTerms: (state) => {
    if (state.rows[0].inputs[0].type === 'initial') {
      return []
    } else {
      return _.map(state.rows, (row) => {
        return _.map(row.inputs, (input) => {
          return {
            value: input.name,
            type: input.type
          }
        })
      })
    }
  },
  isSuggestionCached: state => state.activeRowIndex >= 0 && typeof state.cacheSuggestions[state.activeRowIndex] !== 'undefined' && state.activeInputIndex < state.cacheSuggestions[state.activeRowIndex].length,
  cachedSuggestions: state => {
    if (state.activeRowIndex != -1) {
      let suggestionsForRow = state.cacheSuggestions[state.activeRowIndex]
      return typeof suggestionsForRow === 'undefined' ? [] : suggestionsForRow[state.activeInputIndex]
    } else {
      return []
    }
  },
  inputsForActiveRow: (state) => {
    if (state.activeRowIndex === -1) {
      return []
    } else {
      return state.rows[state.activeRowIndex].inputs
    }
  },
  isLastRow: state => rowIndex => rowIndex === state.rows.length - 1,
  prevInputType: (state, getters) => {
    let inputs = getters.inputsForActiveRow
    if (state.activeInputIndex < 1) {
      return 'initial'
    } else {
      const priorInput = inputs[state.activeInputIndex - 1]
      return priorInput.type
    }
  },
  inputNamesSoFarForRow: (state, getters) => {
    let inputs = getters.inputsForActiveRow
    return inputs.slice(0, state.activeInputIndex).map(input => input.name)
  },
  isInputActive: state => (rowIndex, inputIndex) => {
    return state.activeRowIndex === rowIndex && state.activeInputIndex === inputIndex
  },
  displayTimeRange: (state, getters) => {
    let inputs = getters.inputsForActiveRow
    return _.some(inputs, (input) => {
      return input.name === 'has happened' || input.name === 'has not happened'
    })
  },
  canDelete: state => rowIndex => rowIndex > 0 || state.rows.length > 1,
  isPrevNullable: (state, getters) => {
    let inputs = getters.inputsForActiveRow
    return state.activeInputIndex > 0 && inputs[state.activeInputIndex - 1].nullable
  },
  getStarred: state => id => {
    let index = _.findIndex(state.results, (o) => o.id === id)
    return state.results[index].starred
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
