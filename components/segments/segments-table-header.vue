<template>
  <header class="pb3 flex justify-between">
    <div class="flex items-center">
      <div class="br b--light-gray">
        <miso-button
          class="mr3 dark-gray"
          type="outline"
          v-if="!isFilterVisible"
          @click="onToggleFilterVisible">
          Filter Items
        </miso-button>
      </div>

      <p
        v-if="anySegmentsSelected"
        class="mv0 f6"
        :class="{ 'ml3' : !isFilterVisible }">
        {{ setPluralize('segment', selectedSegmentsNum) }}
        selected
      </p>

      <p
        v-else
        class="mv0 f6"
        :class="{ 'ml3' : !isFilterVisible }">
        Showing
        {{ filteredSegmentsCount }}
        out of
        {{ setPluralize('segment', segmentsCount) }}
      </p>
    </div>

    <div class="flex flex-0">
      <div
        class="flex items-start"
        v-if="anySegmentsSelected">
        <div class="br b--light-gray pr3 mr3">
          <miso-button
            type="outline"
            size="medium"
            v-if="anySegmentsSelected"
            @click="onShowDeleteModal">
            Delete
          </miso-button>
        </div>
      </div>

      <miso-dropdown
        trigger="click"
        @visible-change="toggleIcon"
        @command="handleCommand">
        <miso-button type="primary" class="dark-gray create-segment">
          New Segment
          <feather-icon
            :name="dropdownIcon"
            color="white"
            width="16"
            height="16"
            class="ml2">
          </feather-icon>
        </miso-button>

        <miso-dropdown-menu slot="dropdown">
          <miso-dropdown-item
            class="f6"
            command="Account">
            Accounts Segment
          </miso-dropdown-item>

          <miso-dropdown-item
            class="f6"
            command="Contact">
            Contacts Segment
          </miso-dropdown-item>
        </miso-dropdown-menu>
      </miso-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import pluralize from 'pluralize'

import axios from 'axios'

import {
  MisoButton,
  MisoInput,
  FeatherIcon,
  MisoDropdown,
  MisoDropdownMenu,
  MisoDropdownItem,
  MisoMessage
} from 'miso'

  export default {
    name: 'segments-table-header',

  props: {
    isFilterVisible: {
      type: Boolean,
      default: false
    },
    onToggleFilterVisible: {
      type: Function,
      default () {}
    },
    onShowDeleteModal: {
      type: Function,
      default () {}
    },
    segmentsCount: {
      type: Number,
      default: 0
    },
    filteredSegmentsCount: {
      type: Number,
      default: 0
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    handleCommand: {
      type: Function,
      default () {}
    }
  },

    components: {
      MisoButton,
      MisoInput,
      MisoMessage,
      FeatherIcon,
      MisoDropdown,
      MisoDropdownMenu,
      MisoDropdownItem
    },

  data () {
    return {
      mode: null,
      dropdownIcon: 'chevron-down',
      filters: [
        {
          field: '',
          operator: '',
          value: ''
        }
      ]
    }
  },

  computed: {
    ...mapState({
      selected: state => state.segments.selected.length
    }),

    ...mapGetters([
      'selectedSegmentsNum',
      'anySegmentsSelected',
      'singleSegmentSelected'
    ]),

    isAccountSegment () {
      return this.mode === 'create' && this.segmentType === 'Account'
    },

    isContactSegment () {
      return this.mode === 'create' && this.segmentType === 'Contact'
    },

    isSegmentIncomplete () {
      return _.reduce(this.filters, (result, row) => {
        return result || !this.isRowComplete(row)
      }, _.isEmpty(this.segmentName))
    },
  },

  methods: {
    ...mapActions([
      'fetchSegments',
      'saveSegment'
    ]),

    setPluralize (word, number) {
      return pluralize(word, number, true)
    },

    toggleIcon () {
      if (this.dropdownIcon === 'chevron-down') {
        this.dropdownIcon = 'chevron-up'
      } else {
        this.dropdownIcon = 'chevron-down'
      }
    }
  }
}
</script>

<style lang="scss">
  .create-segment {
    & > div {
      display: flex;
    }
  }

  .segments {
    &__input {
      flex: 0 0 190px;

      .white-input {
        height: 32px;
      }
    }
  }

  .flex-0 {
    flex: 0 0 auto;
  }

  .delete-row {
    height: 36px !important;
    padding: 0 .5rem;
  }
</style>
