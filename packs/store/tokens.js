import _ from 'lodash'
import _inflector from 'lodash-inflection'
_.mixin(_inflector)

function prepend (name, k) {
  return name + '_' + k
}

const state = {
  tokens: [],
  tokensValues: [],
  tokensIndex: 0
}

const mutations = {
  updateTokens (state, tokens) {
    state.tokens = tokens
  },
  updateTokensValues (state, tokensValues) {
    state.tokensValues = tokensValues
  },
  updateTokensIndex (state, index) {
    state.tokensIndex = index
  }
}

const actions = {
  updateTokens (context, tokens) {
    context.commit('updateTokens', tokens)
  },
  updateTokensValues (context, tokensValues) {
    context.commit('updateTokensValues', tokensValues)
  },
  updateTokensIndex (context, tokensIndex) {
    context.commit('updateTokensIndex', tokensIndex)
  },

  // TODO: This function needs to be rewritten with a Promise.all
  processTokens (context, object) {
    let data = object.response.data
    const tokenLabels = []
    const size = object.size
    let tokensValues = Array(size).fill({})
    for (let prop in data) {
      const obj = {}
      if (data.hasOwnProperty(prop)) {
        obj.name = _.singularize(prop)
        obj.label = _.titleize(obj.name)
        if (Array.isArray(data[prop]) && data[prop].length > 0) {
          for (let i = 0; i < size; i++) {
            const mappedObj = _.mapKeys(data[prop][i], (v, k) => prepend(obj.name, k))
            tokensValues[i] = _.extend({}, tokensValues[i], mappedObj)
          }
        } else if (_.isEmpty(data[prop])) {
          continue
        } else {
          const tempObject = data[prop]
          const mappedObj = _.mapKeys(tempObject, (v, k) => prepend(obj.name, k))
          tokensValues = _.map(tokensValues, e => _.extend({}, e, mappedObj))
        }
        const tokens = _.map(Object.keys(object), function (k) {
          return {
            variable: '{{' + prepend(obj.name, k) + '}}',
            label: _.titleize(k.split('_').join(' ')),
            value: prepend(obj.name, k)
          }
        })
        obj.tokens = tokens
        tokenLabels.push(obj)
      }
    }
    context.dispatch('updateTokensIndex', 0)
    context.dispatch('updateTokensValues', tokensValues)
    context.dispatch('updateTokens', tokenLabels)
  }
}

const getters = {
  currentTokenValues: state => state.tokensValues[state.tokensIndex],
  tokensValuesLength: state => state.tokensValues.length
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
