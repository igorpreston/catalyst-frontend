<template>
  <div
    v-if="visible"
    style="flex: 1 0 300px;"
    class="pt2 pl3">

    <header class="pv3 flex items-center justify-between">
      <p
        class="mv0 ml2 dib"
        style="height: 32px; line-height: 32px; font-size: 14px;" >Filter By</p>

      <miso-button
        class="dark-gray  ph1"
        type="transparent"
        size="small"
        @click="onToggleFilterVisible">
        <feather-icon
          name="x"
          height="16"
          width="16"/>
      </miso-button>
    </header>

    <div>
      <div class="bg-white ba b--purple-gray pa3">

        <div class="mb3">
          <miso-label class="db mb2 mid-gray">Type</miso-label>
          <miso-radio-group
            v-model="filters.type"
            size="small">
            <miso-radio-button
              v-for="type in types"
              :label="type.value"
              :key="type.value"
            >
              {{ type.name }}
            </miso-radio-button>
          </miso-radio-group>
        </div>

        <div class="mb3 f6">
          <miso-label class="db mb2 mid-gray">Created By</miso-label>
          <miso-select
            v-model="filters.created_by"
            filterable
            clearable
            value-key="name"
            class="w-100 white-select"
            placeholder="e.g John Doe">
            <miso-option
              v-for="user in users"
              :value="user.id"
              :key="user.id"
              :label="user.name">
              <div class="flex">
                <circle-badge variant="dark">{{ user.name_initials }}</circle-badge>
                <div class="ml2">
                  <p class="mt0 mb1">{{ user.name }}</p>
                  <p class="mv0 f6 o-70">{{ user.email }}</p>
                </div>
              </div>
            </miso-option>
          </miso-select>
        </div>

        <div class="mb3 f6">
          <miso-label class="db mb2 mid-gray">Created At</miso-label>
          <miso-date-picker
            v-model="filters.created_at"
            class="w-100"
            style="width: 100%;"
            type="daterange"
            format="MM/dd/yyyy"
            placeholder="e.g 11/16/2017 – 11/17/2017"
            range-separator=" - "
            start-placeholder="Start date"
            end-placeholder="End date"/>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import {
  MisoLabel,

  MisoRadioGroup,
  MisoRadioButton,

  MisoSelect,
  MisoOption,
  MisoButton,
  CircleBadge,

  MisoDatePicker,
  FeatherIcon
} from 'miso'

export default {
  name: 'TemplatesFilter',

  components: {
    MisoLabel,
    MisoRadioGroup,
    MisoRadioButton,
    MisoSelect,
    MisoButton,
    MisoOption,
    CircleBadge,
    MisoDatePicker,
    FeatherIcon
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    onToggleFilterVisible: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      types: [
        { name: 'All', value: 'all' },
        { name: 'Note', value: 'note' },
        { name: 'Email', value: 'email' }
      ]
    }
  },

  computed: {
    ...mapState({
      filters: state => state.templates.filters,
      users: state => state.users.all
    })
  },

  beforeMount () {
    this.filters.type = 'all'
  }
}
</script>
