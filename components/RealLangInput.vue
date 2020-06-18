<template>
  <div
    @keyup.enter="handleKeyUpEnter"
    @keydown.left="handleKeyDownLeft"
    @keydown.right="handleKeyDownRight"
  >
    <article class="flex items-center" :class="{'mr1': !hasTrailingText}">
      <span class="mr1 dib helper-text mid-gray-accent" v-if="hasLeadingText">{{ input.leadingText }}</span>
      <input
        v-autosize="true"
        v-focus="shouldFocus"
        class="search-input input-reset mb0"
        v-model="input.name"
        @blur="removeInputFocus"
        @focus="makeActive"
        @input="updateInput"
        placeholder="Type something!">
        <span class="mh1 dib helper-text mid-gray-accent" v-if="hasTrailingText">{{ input.trailingText }}</span>
    </article>
    <el-popover trigger="manual" :ref="popoverRef" width="600" placement="bottom-start" :value="shouldShowSuggestionsPopover" :popper-options="popperOptions">
      <div class="pa2 f6">
        <div class="flex flex-wrap">
          <section>
            <ul class="list pl0 mv0" v-if="hasSuggestions && isActive">
              <li class="dib mr1" v-for="( suggestion, index ) in filteredSuggestions" :key="index">
                <button 
                  :class="{
                    'purple': exactMatch(suggestion.name),
                    'search-button-focused': index === activeSuggestionIndex
                  }
                  "
                  class="search-button"
                  @click="selectSuggestion(index)"
                >{{  suggestion.name  }}</button>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import { focus } from 'vue-focus';
import {
  Popover,
  autosize,
} from 'miso';

export default {
  name: 'real-lang-input',
  props: ['inputIndex', 'rowIndex', 'immutable'],
  directives: {
    autosize: autosize,
    focus: focus,
  },
  components: {
    'el-popover': Popover
  },
  data: () => ({
    activeSuggestionIndex: 0,
    currentPlacement: 'bottom-start',
    popperOptions: {
      placement: 'bottom-start'
    }
  }),
  computed: {
    ...mapGetters('realLang',
                  ['inputForRowAndInputIndex', 'prevInputType',
                   'inputNamesSoFarForRow',
                   'isInputActive', 'rowsCompleted', 'inputsForRowIndex',
                   'isPrevNullable', 'searchTerms',
                   'isSuggestionCached', 'cachedSuggestions']),
    ...mapState('realLang', ['baseEndpoint', 'suggestions', 'activeRowIndex', 'activeInputIndex', 'operators']),
    shouldShowSuggestionsPopover () {
      return this.isActive && this.hasSuggestions
    },
    input(){
      return this.inputForRowAndInputIndex(this.rowIndex, this.inputIndex)
    },
    isActive() {
      return this.isInputActive(this.rowIndex, this.inputIndex)
    },
    hasTrailingText(){
      return typeof this.input.trailingText === 'string'
    },
    hasLeadingText(){
      return typeof this.input.leadingText === 'string'
    },
    popoverRef () {
      return `popover${this.rowIndex}${this.inputIndex}`
    },
    shouldFocus () {
      if (this.immutable) return;

      return this.rowIndex === this.activeRowIndex
      && this.inputIndex === this.activeInputIndex
    },
    filteredSuggestions() {
      const name = this.input.name.toLowerCase().trim()
      if (name.length > 0) {
        let filtered = this.suggestions.filter(s => _.includes(s.name.toLowerCase(), name))
        let noMatchFound = _.isEmpty(filtered)
        // let exactMatchFound = !_.isEmpty(filtered) && filtered[0].name.toLowerCase() === name

        return (noMatchFound) ? this.suggestions : filtered
      } else {
        return this.suggestions
      }
    },
    hasSuggestions() {
      return this.suggestions.length > 0
    },
    suggestionIsFocused() { return this.activeSuggestionIndex !== null }
  },
  methods: {
    ...mapMutations('realLang', ['makeInputActive', 'updateInputName', 'updateInputType', 'clearSuggestions', 'updateNullable', 'removeFocus']),
    ...mapActions('realLang', ['performSearch', 'requestSuggestions', 'updateSuggestion']),
    suggestionShouldFocus(i) { return this.activeSuggestionIndex === i },
    updateInput: function (e) {
      this.updateInputName(e.target.value);
      if (this.rowsCompleted) {
        this.debounceResults(e)
      }
    },
    debounceResults: _.debounce(function(e) {
      this.clearSuggestions()
      this.performSearch()
    }, 500),
    removeInputFocus (e) {
      if (e.relatedTarget && e.relatedTarget.nodeName === 'BUTTON') {
        e.preventDefault()
      } else {
        this.isFocused = false
        this.removeFocus();
      }
    },
    makeActive() {
      if (this.isFocused) return;
      this.isFocused = true
      this.makeInputActive({
        activeRowIndex: this.rowIndex,
        activeInputIndex: this.inputIndex
      })
      switch(this.prevInputType) {
        case 'object':
          this.requestSuggestions()
          break;
        case 'initial':
          this.requestSuggestions()
          break;
        default:
          let applicable = this.findApplicableOperators()
          this.updateSuggestion(applicable)
          break;
      }
      if (this.suggestions.length===1){
        this.selectSuggestion(this.suggestions[0])
      }
    },
    findApplicableOperators() {
      let prevInputType = this.prevInputType
      let index = _.findIndex(this.inputsForRowIndex(this.rowIndex), (i) => i.type === this.prevInputType)
      if (index+1 !== this.inputIndex){
        return []
      }
      return this.operators.filter(((operator) => {
        if (this.isPrevNullable){
          return operator.allowedAfter === 'nullable' || _.includes(operator.allowedAfter, this.prevInputType)
        }
        return _.includes(operator.allowedAfter, this.prevInputType);
      }).bind(this));
    },
    selectSuggestion(suggestion_index) {
      let suggestion = this.filteredSuggestions[suggestion_index]

      this.updateInputName(suggestion.name)
      this.updateInputType(suggestion.type)
      if (suggestion.hasOwnProperty('nullable')){
        this.updateNullable()
      }
      this.$emit('suggestion-selected', suggestion)
    },
    exactMatch (suggestion) {
      return this.input.name.toLowerCase() === suggestion.toLowerCase()
    },
    handleKeyDownLeft(e) {
      if (!this.suggestionIsFocused) return;

      if ((this.activeSuggestionIndex - 1) >= 0) {      
        this.activeSuggestionIndex -= 1;
      }
    },
    handleKeyDownRight(e) {
      if (!this.suggestionIsFocused) return;

      if ((this.activeSuggestionIndex + 1) < this.filteredSuggestions.length) {      
        this.activeSuggestionIndex += 1;
      }
    },
    handleKeyUpEnter(e) {
      this.selectSuggestion(this.activeSuggestionIndex);
      this.activeSuggestionIndex = 0;
    },
    handleSuggestionFocus(i) {
      if (this.activeSuggestionIndex === i) return;
      this.activeSuggestionIndex = i
    }
  }
}
</script>

<style scoped>
.helper-text {
  padding: .25em 0 .5em;
}
.search-button-focused {
  box-shadow: inset 0 0 0 1px var(--purple);
  color: var(--purple);
}
</style>
