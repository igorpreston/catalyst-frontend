<template>
  <div
    v-if="visible"
    class="pt2 pl3 pr2 filter">
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
        <miso-label class="db mb2 mid-gray">Type</miso-label>

        <miso-checkbox-group
          v-model="filter"
          class="mt3 playbooks__checkbox-group checkbox--vertical"
          @change="handleChangeInFilter">
          <miso-checkbox
            label="my">
            My Playbooks
            <span class="count">({{ myPlaybooksNum }})</span>
          </miso-checkbox>

          <miso-checkbox
            label="my_team">
            My Team's Playbooks
            <span class="count">({{ playbooksNum }})</span>
          </miso-checkbox>
        </miso-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

import {
  MisoLabel,

  MisoCheckbox,
  MisoCheckboxGroup,

  MisoSelect,
  MisoOption,
  MisoButton,
  CircleBadge,

  MisoDatePicker,
  FeatherIcon
} from 'miso'

export default {
  name: 'PlaybooksFilter',

  components: {
    MisoLabel,
    MisoCheckbox,
    MisoCheckboxGroup,
    MisoSelect,
    MisoButton,
    MisoOption,
    CircleBadge,
    MisoDatePicker,
    FeatherIcon
  },

  props: [
    'visible',
    'onToggleFilterVisible'
  ],

  data () {
    return {
      filter: []
    }
  },
  computed: {
    ...mapGetters(['playbooksNum', 'myPlaybooksNum'])
  },
  methods: {
    ...mapMutations(['updateFilters']),
    handleChangeInFilter (val) {
      this.updateFilters(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter {
    flex: 0 0 300px;
    &::before {
      content: '';
      position: absolute;
      right: -1px;
      width: 1px;
      height: 64px;
      background-color: #fff;
    }

    &__header {
      margin-bottom: 14px;
      padding: 20px 0;
    }
  }

  .count {
    color: #9C9CA6;
  }
</style>

<style lang="scss">
  .playbooks__checkbox-group {
    .el-checkbox {
      font-weight: 300;
    }
  }
</style>
