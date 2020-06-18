<template>
  <div class="bb b--light-gray">
    <div
      v-for="field in fields"
      :key="field.key"
      class="note-view__field">
      <h2 class="ttu mid-gray note-view__heading">{{ field.label }}</h2>
      <miso-input
        :value="fieldValue(field)"
        disabled
        variant="white"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapState } from 'vuex'

import {
  MisoForm,
  MisoFormItem,
  MisoSelect,
  MisoOption,
  MisoInput
} from 'miso'

export default {
  name: 'NotesViewFields',

  components: {
    MisoForm,
    MisoFormItem,
    MisoSelect,
    MisoOption,
    MisoInput
  },

  props: {
    note: {
      type: Object,
      default: () => ({})
    },
    fields: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },

  methods: {
    fieldTypeIsDate (field) {
      return field.salesforce_type === 'date'
    },

    formatDate (date) {
      return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    },

    fieldValue (field) {
      return this.fieldTypeIsDate(field) ? this.formatDate(field.value) : field.value
    }
  }
}
</script>

<style lang="scss">
  .note-view__field {
    margin-bottom: 5px;
    margin-right: 20px;
    display: inline-block;
    width: 33%;

    &:last-child {
      margin-bottom: 24px;
    }
  }

  .field__select {
    .el-input__inner[disabled] {
      border-color: #eaeaec;
      color: #9c9ca6;
      background-color: #f4f4f4;
    }
  }
</style>
