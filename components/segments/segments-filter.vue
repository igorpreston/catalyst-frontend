<template>
  <div
    v-if="visible"
    class="pr3 f6 filter segments-filter">

    <header
      class="mt1 pb3 flex items-center justify-between filter__header">
      <p class="mv0 ml2 dib">
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
          width="16">
        </feather-icon>
      </miso-button>
    </header>

    <div>
      <div class="bg-white ba b--purple-gray pa3">
        <miso-label class="db mb2 mid-gray">Type</miso-label>

        <miso-checkbox-group
          v-model="filter"
          class="mt3 checkbox--vertical">
          <miso-checkbox
            class="fw3"
            label="Account"
            @change="handleCheck(filter)">
            Account
          </miso-checkbox>

          <miso-checkbox
            class="fw3"
            label="Contact"
            @change="handleCheck(filter)">
            Contact
          </miso-checkbox>
        </miso-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    MisoButton,
    MisoLabel,
    MisoCheckbox,
    MisoCheckboxGroup,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'segments-filter',

    props: [
      'visible',
      'onToggleFilterVisible',
      'handleCheck'
    ],

    components: {
      MisoButton,
      MisoLabel,
      MisoCheckbox,
      MisoCheckboxGroup,
      FeatherIcon
    },

    data () {
      return {
        filter: []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .filter {
    flex: 0 0 250px;

    &::before {
      content: '';
      position: absolute;
      right: -1px;
      width: 1px;
      height: 64px;
      background-color: #fff;
    }

    &__header {
      padding: 0 0 20px;
    }
  }

  .count {
    color: #9C9CA6;
  }
</style>
