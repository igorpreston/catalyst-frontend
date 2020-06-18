<template>
  <div class="relative search-input-row">
    <section class="flex items-center">
      <real-lang-input v-for="(input, index) in inputs"
                       :inputIndex="index"
                       :rowIndex="rowIndex"
                       :key="index"
                       :immutable="isImmutable"
                       @suggestion-selected="suggestionSelected"
        />
      <button 
        v-if="showDelete"
        @click="deleteRealLangRow" 
        class="br2 pa1 button-reset ba b--red-subdued bg-transparent ml2"
      >
        <div class="flex items-center">
          <feather-icon color="red" name="x" height="16" width="16"></feather-icon>
        </div>
      </button>
    </section>
  <button v-focus="true" v-if="isFinished && isActive" @click="addRow" class="br2 pa1 button-reset ba b--purple-subdued bg-purple-gray f7">
      <div class="flex items-center">
        <feather-icon color="purple" name="plus" height="16" width="16"></feather-icon>
        <span class="purple ml1">Add Row</span>
      </div>
    </button>
  </div>
</template>

<script>
import RealLangInput from '#/components/RealLangInput'
import {mapGetters, mapMutations, mapState, mapActions} from 'vuex'
import { FeatherIcon } from 'miso'
import { focus } from 'vue-focus';

export default {
  name: 'real-lang-row',
  components: {
    RealLangInput,
    FeatherIcon
  },
  props: ['rowIndex'],
  directives: {
    focus: focus
  },
  data: () => ({}),
  computed: {
    ...mapGetters('realLang', ['inputsForRowIndex', 'rowsCompleted', 'immutableForRowIndex',
                   'displayTimeRange', 'isLastRow', 'canDelete', 'searchTerms']),
    isImmutable() {
      return this.immutableForRowIndex(this.rowIndex);
    },
    inputs() {
      return this.inputsForRowIndex(this.rowIndex)
    },
    activeInput() {
      return this.inputs.find(input => input.active)
    },
    activeInputIndex() {
      return this.inputs.indexOf(this.activeInput)
    },
    isFinished() {
      return _.some(this.inputs, (input) => {
        return input.type === 'operator';
      }) && this.inputs.every(input => input.name !== "");
    },
    isActive() {
      return this.isLastRow(this.rowIndex)
    },
    subjectType(){
      let input = this.inputs.find(input => input.type !== 'object')
      return input && input.type
    },
    showDelete(){
      return this.canDelete(this.rowIndex)
    },
  },
  methods: {
    ...mapMutations('realLang', ['addInput', 'addRow', 'updateFocus',
                     'clearSuggestions', 'clearInputsAfter', 'deleteRow']),
    ...mapActions('realLang', ['performSearch']),
    deleteRealLangRow() {
      this.deleteRow(this.rowIndex);
      this.performSearch();
    },
    addInputForTimeRange(numberOfInputs) {
      if (this.displayTimeRange){
        let input = {name: '90', type: 'time-range', leadingText: 'the last', trailingText: 'days'}
        this.addInput({input: input, index: numberOfInputs+1})
      }
    },
    suggestionSelected(suggestion) {
      if (suggestion.type === 'operator' && !suggestion.hasOwnProperty('openFieldsAfter')) {
        this.clearInputsAfter()
        this.clearSuggestions()
        this.addInputForTimeRange(0)
        this.performSearch()
        this.updateFocus()
        return
      }
      let numberOfInputs = Array.isArray(suggestion.openFieldsAfter) ? suggestion.openFieldsAfter.length : 1
      _.times(numberOfInputs, (index) => {
        let text = suggestion.hasOwnProperty('openFieldsAfter') ?suggestion.openFieldsAfter[index].trailingText : null
        let input = {name: '', type: this.subjectType, trailingText: text}
        this.addInput({input: input, index: index})
      })
      this.addInputForTimeRange(numberOfInputs)
      this.updateFocus()
    }
  }
}
</script>
