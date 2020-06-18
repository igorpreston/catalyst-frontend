<script>
import _ from 'lodash'
import _inflector from 'lodash-inflection'
import Vue from 'vue'
import {mapGetters, mapMutations, mapState, mapActions} from 'vuex'
import RealLangRow from '#/components/RealLangRow'
import { FeatherIcon } from 'miso'

_.mixin(_inflector);

export default {
  name: 'real-lang',
  components: { RealLangRow, FeatherIcon },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data: () => ({}),
  computed: {
    ...mapGetters('realLang', ['rowsCompleted', 'isLastRow', 'searchTerms']),
    ...mapState('realLang', ['rows']),
    pluralizedType() {
      return _.pluralize(_.toLower(this.type));
    }
  },
  methods: {
    ...mapMutations('realLang', ['setBaseEndpoint', 'resetState']),
    ...mapActions('realLang', ['performSearch']),
    reset(){
      this.resetState()
      this.setBaseEndpoint(this.pluralizedType)
      this.performSearch()
    },
  },
  beforeMount(){
    this.setBaseEndpoint(this.pluralizedType)
  }
}
</script>

<template>
  <div id="real">
    <real-lang-row v-for="(row, rowIndex) in rows"
                   class="mb1"
                   :rowIndex="rowIndex"
                   :key="rowIndex"/>
    <div class="pv2">
      <button @click="reset" class="ph0 pv1 bg-transparent normal f7 mid-gray-accent button-reset bn">
        <div class="flex">
          <feather-icon name="x" height="16" width="16" color="mid-gray-accent" class="mr1"></feather-icon>
          Clear All Rows
        </div>
      </button>
    </div>
  </div>
</template>

