<template>
  <div
    v-if="visible"
    style="flex: 1 0 300px;"
    class="pl3">
    <header class="pv3 flex items-center justify-between">
      <p
        class="mv0 ml2 dib"
        style="height: 32px; line-height: 32px; font-size: 14px;">
        Filter By
      </p>

      <miso-button
        class="dark-gray ph1"
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
          <miso-label class="db mb2 mid-gray">Status</miso-label>

          <miso-checkbox-group
            v-model="filters.status"
            size="small">
            <miso-checkbox
              v-for="status in statuses"
              :label="status.value"
              :key="status.value"
              class="fw3">
              {{ status.name }}
            </miso-checkbox>
          </miso-checkbox-group>
        </div>

        <div class="mb3">
          <miso-label class="db mb2 mid-gray">Type</miso-label>

          <miso-checkbox-group
            v-model="filters.type"
            size="small">
            <miso-checkbox
              v-for="type in types"
              :label="type.value"
              :key="type.value"
              class="fw3">
              {{ type.name }}
            </miso-checkbox>
          </miso-checkbox-group>
        </div>

        <div class="mb3 f6">
          <miso-label class="db mb2 mid-gray">Owner</miso-label>

          <miso-select
            v-model="selectedOwnerId"
            filterable
            clearable
            class="w-100 fw3 white-select"
            placeholder="e.g John Doe"
            @clear="clearOwner">
            <miso-option
              v-for="owner in alteredUsers"
              :value="owner.id"
              :key="owner.id"
              :label="owner.name">
              <div class="flex">
                <circle-badge variant="dark">{{ owner.name_initials }}</circle-badge>
                <div class="ml2">
                  <p class="mt0 mb1">{{ owner.name }}</p>
                  <p class="mv0 f6 o-70">{{ owner.email }}</p>
                </div>
              </div>
            </miso-option>
          </miso-select>
        </div>

        <div class="mb3 f6">
          <miso-label class="db mb2 mid-gray">Due Date</miso-label>

          <miso-date-picker
            v-model="filters.due"
            class="w-100 fw3"
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
import { mapGetters, mapState, mapActions } from 'vuex'
import {
  CircleBadge,
  FeatherIcon,
  MisoButton,
  MisoCheckbox,
  MisoCheckboxGroup,
  MisoDatePicker,
  MisoLabel,
  MisoMessage,
  MisoOption,
  MisoSelect
} from 'miso'

export default {
  name: 'TasksFilter',

  components: {
    CircleBadge,
    FeatherIcon,
    MisoButton,
    MisoCheckbox,
    MisoCheckboxGroup,
    MisoDatePicker,
    MisoLabel,
    MisoMessage,
    MisoOption,
    MisoSelect
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    onToggleFilterVisible: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: null
    }
  },

  data () {
    if (this.isJustworks) {
      return {
        statuses: [
          { name: 'Open', value: false },
          { name: 'Completed', value: true }
        ],
        types: [
          { name: 'Call', value: 'call' },
          { name: 'Email', value: 'email' },
          { name: 'To-Do', value: 'to_do' }
        ]
      }
    } else {
      return {
        statuses: [
          { name: 'Open', value: false },
          { name: 'Completed', value: true }
        ],
        types: [
          { name: 'Call', value: 'call' },
          { name: 'To-Do', value: 'to_do' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      account: state => state.accounts.account,
      contact: state => state.contacts.contact,
      filters: state => state.tasks.filters,
      owners: state => state.users.all,
      page: state => state.tasks.page,
      pageSize: state => state.tasks.pageSize,
      order: state => state.tasks.order,
      sortColumn: state => state.tasks.sortColumn
    }),

    ...mapGetters([
      'alteredUsers',
      'isJustworks'
    ]),

    selectedOwnerId: {
      get () {
        return this.filters.owner_id
      },
      set (ownerId) {
        this.filters.owner_id = ownerId
      }
    }
  },

  watch: {
    filters: {
      handler: function (newVal, oldVal) {
        this.fetchTasksByDestination(
          { page: this.page, destination: this.destination })
      },
      deep: true
    }
  },

  beforeMount () {
    this.fetchUsers()
  },

  methods: {
    ...mapActions([
      'getTasks',
      'fetchUsers',
      'fetchTasksByDestination']),

    clearOwner () {
      this.filters.owner_id = null
    }
  }
}
</script>
