<template>
  <div class="w-100">
    <miso-label>{{ field.label }}</miso-label>

    <div
      v-if="isEditMode"
      class="flex justify-between">
      <miso-input
        v-model="fieldValue"
        variant="white"
        disabled/>
    </div>
    <div
      v-else
      class="flex justify-between">
      <miso-input
        v-focus
        v-if="fieldTypeIsString || fieldTypeIsNumber"
        v-model="field.value"
        :disabled="isEditMode"
        variant="white"/>

      <miso-select
        v-if="fieldTypeIsPicklist"
        v-model="field.value"
        :disabled="isEditMode"
        style="width:100%;">
        <miso-option
          v-for="value in field.values"
          :key="value"
          :value="value"
          :label="value"/>
      </miso-select>

      <miso-date-picker
        v-if="fieldTypeIsDate"
        v-model="field.value"
        type="date"
        placeholder="10/13/18"
        format="MM/dd/yyyy"
        class="w-100"
        style="width: 100%;"/>

      <miso-button
        v-if="!isEditMode"
        type="transparent"
        class="ml1 remove"
        @click.prevent="remove">
        <feather-icon
          name="x-circle"
          width="18"
          height="18"
          color="light-gray-accent"/>
      </miso-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  MisoInput,
  FeatherIcon,
  MisoButton,
  MisoLabel,
  MisoSelect,
  MisoOption,
  MisoDatePicker
} from 'miso'

import moment from 'moment-timezone'
import { mapState } from 'vuex'

export default {
  name: 'NotesFormNoteField',

  components: {
    MisoInput,
    FeatherIcon,
    MisoButton,
    MisoLabel,
    MisoSelect,
    MisoOption,
    MisoDatePicker
  },

  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },

  props: {
    field: {
      type: Object,
      default: null
    },
    onRemoveNoteField: {
      type: Function,
      default () {}
    },
    isEditMode: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    fieldType () {
      return this.field && this.field.type
    },

    fieldTypeIsString () {
      return _.includes([
        'string',
        'textarea',
        'url',
        'phone'
      ], this.fieldType)
    },

    fieldTypeIsPicklist () {
      return _.includes([
        'picklist',
        'multipicklist'
      ], this.fieldType)
    },

    fieldTypeIsDate () {
      return _.includes([
        'date',
        'datetime'
      ], this.fieldType)
    },

    fieldTypeIsNumber () {
      return _.includes([
        'double',
        'currency',
        'int'
      ], this.fieldType)
    },

    fieldValue: {
      get () {
        return this.fieldTypeIsDate ? this.formatDate(this.field) : this.field.value
      },
      set (value) {
        this.field.value = value
      }
    }
  },

  methods: {
    remove () {
      this.onRemoveNoteField(this.field)
    },

    formattedDate (field) {
      return moment.tz(field.value, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    }
  }
}
</script>

<style scoped>
  .remove {
    height: 34px;
    padding: 0 .5rem;
  }
</style>
