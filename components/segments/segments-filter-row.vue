<template>
  <div
    class="flex flex-row f6 segment-filter">
    <miso-select
      v-model="filterFieldLocal"
      clearable
      filterable
      class="mr2 white-select"
      placeholder="Lets Begin..."
      default-first-option
      value-key="field"
      @clear="onClearField">
      <miso-option
        v-for="field in fields"
        :key="field.field"
        :label="field.field === 'owner_id' ? 'Owner' : humanize(field.field)"
        :value="field"/>
    </miso-select>

    <miso-select
      v-if="hasSelectedField"
      v-model="filterOperatorLocal"
      clearable
      default-first-option
      filterable
      class="mr2 white-select"
      placeholder="What else?"
      @clear="onClearOperator"
      @change="onSegmentFilter">
      <miso-option
        v-for="(operator, index) in selectedField.operators"
        :key="index"
        :label="operator.label"
        :value="operator.name"/>
    </miso-select>

    <miso-input
      v-if="hasSelectedOperator && selectedField.field !== 'owner_id'"
      v-model="filterValueLocal"
      placeholder="eg. $5000"
      variant="white"
      class="w-auto mr2 filter__value"
      @blur="filterMembers"
      @keyup.native="onValueKeyUp"/>

    <miso-select
      v-if="hasSelectedOperator && selectedField.field === 'owner_id'"
      v-model="filterValueLocal"
      class="mr2 white-select"
      clearable
      default-first-option
      filterable
      placeholder="Value"
      value-key="id"
      @clear="onClearValue"
      @change="onSegmentFilter">
      <miso-option
        v-for="salesforceUser in salesforceUsers.all"
        :key="salesforceUser.id"
        :label="salesforceUser.full_name"
        :value="salesforceUser.id"/>
    </miso-select>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import Raven from 'raven-js'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { humanizeString } from '../mixins/humanize-string'
import {
  MisoButton,
  MisoInput,
  MisoMessage,
  MisoOption,
  MisoSelect
} from 'miso'

export default {
  name: 'SegmentsFilterRow',

  components: {
    MisoButton,
    MisoInput,
    MisoMessage,
    MisoOption,
    MisoSelect
  },

  mixins: [humanizeString],

  props: {
    filterField: {
      type: String,
      default: null
    },

    filterOperator: {
      type: String,
      default: null
    },

    filterValue: {
      type: String,
      default: null
    },

    index: {
      type: Number,
      default: null
    },

    filterType: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      selectedOperator: '',
      value: '',
      fields: []
    }
  },

  computed: {
    ...mapState({
      salesforceUsers: state => state.salesforceUsers
    }),

    ...mapGetters(['segmentFormData']),

    selectedField: {
      get () {
        return _.find(this.fields, (o) => { return o.field === this.filterField })
      },

      set (value) {
        return value
      }
    },

    filterFieldLocal: {
      get () {
        return this.selectedField
      },

      set (field) {
        this.updateTerm(this.index, 'field', field.field)
        this.selectedField = field
        this.filterOperatorLocal = ''
        this.filterValueLocal = ''
      }
    },

    filterOperatorLocal: {
      get () {
        return this.filterOperator
      },

      set (operator) {
        this.updateTerm(this.index, 'operator', operator)
        this.selectedOperator = operator
        if (operator === 'blank' || operator === 'present') {
          this.filterValueLocal = ''
          this.handleSegmentFilter()
        }
      }
    },

    filterValueLocal: {
      get () {
        return this.filterValue
      },

      set (value) {
        this.updateTerm(this.index, 'value', value)
        this.value = value
      }
    },

    hasSelectedField () {
      return !_.isEmpty(this.filterFieldLocal)
    },

    hasSelectedOperator () {
      if (this.filterOperatorLocal === 'blank' || this.filterOperatorLocal === 'present') {
        return false
      }

      return !_.isEmpty(this.filterOperatorLocal)
    },

    isRowReady () {
      if (!_.isEmpty(this.selectedField) && (this.selectedOperator === 'blank' || this.selectedOperator === 'present')) {
        return true
      }

      return !_.isEmpty(this.selectedField) &&
              !_.isEmpty(this.selectedOperator) &&
              !_.isEmpty(this.value)
    }
  },

  beforeMount () {
    this.fetchFields()
  },

  methods: {
    ...mapActions(['handleSegmentFilter']),

    ...mapMutations(['setTerm', 'deleteTerm']),

    getRowValue () {
      return {
        field: this.selectedField.field,
        operator: this.selectedOperator,
        value: this.value
      }
    },

    fetchFields () {
      return axios.get(`/${this.filterType.toLowerCase()}s/filters`)
           .then(res => this.fields = res.data)
           .catch(err => console.log(err))
    },

    onClearField () {
      this.filterFieldLocal = {}
      this.filterOperatorLocal = ''
      this.filterValueLocal = ''
    },

    onClearOperator () {
      this.filterOperatorLocal = ''
      this.filterValueLocal = ''
    },

    onClearValue () {
      this.filterValueLocal = ''
    },

    filterMembers () {
      if (!_.isEmpty(this.value)) {
        this.onSegmentFilter()
      }
    },

    onValueKeyUp (e) {
      if (e.key === 'Enter') {
        this.onSegmentFilter()
      }
    },

    updateTerm (index, key, value) {
      this.setTerm({ index: index, term: { [key]: value } })
    },

    onSegmentFilter () {
      this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.filterType}s`))
                                .catch(() => MisoMessage.error(`Failed to filter the ${this.filterType}s`))
    }
  },

  beforeMount () {
    this.fetchFields()
  }
}
</script>

<style lang="scss">
  .w-auto {
    width: auto;
  }

  .segment-filter {
    .el-select .el-input__inner,
    .vanilla-input {
      padding-left: 8px;
      line-height: 14px;
    }
  }

  .filter__value {
    .white-input {
      height: 36px;
    }
  }
</style>
