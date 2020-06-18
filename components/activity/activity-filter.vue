<template>
  <div
    v-if="visible"
    class="relative filter pr24 acvitivy__filter">
    <header class="flex items-center justify-between bb b--light-gray filter__header">
      <p class="mv0 dib f6">Filter By</p>

      <miso-button
        class="mid-gray ph1"
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
      <miso-label>Type</miso-label>
      <miso-checkbox-group
        v-model="filter"
        class="mt3 activity__checkbox-group checkbox--vertical">
        <miso-checkbox
          label="account-contact-fields">
          Account/Contact Fields
          <span class="count">(38)</span>
        </miso-checkbox>

        <miso-checkbox
          label="campaigns">
          Campaigns
          <span class="count">(38)</span>
        </miso-checkbox>

        <miso-checkbox
          label="emails">
          Emails
          <span class="count">(38)</span>
        </miso-checkbox>

        <miso-checkbox
          label="notes">
          Notes
          <span class="count">(38)</span>
        </miso-checkbox>

        <miso-checkbox
          label="tasks">
          Tasks
          <span class="count">(38)</span>
        </miso-checkbox>

        <miso-checkbox
          label="tickets">
          Tickets
          <span class="count">(38)</span>
        </miso-checkbox>
      </miso-checkbox-group>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  import {
    MisoButton,
    MisoLabel,
    FeatherIcon,
    MisoCheckbox,
    MisoCheckboxGroup
  } from 'miso'

  export default {
    name: 'activity-filter',

    props: [
      'visible',
      'onToggleFilterVisible',
    ],

    components: {
      MisoButton,
      MisoLabel,
      FeatherIcon,
      MisoCheckbox,
      MisoCheckboxGroup
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
      margin-bottom: 14px;
      padding: 20px 0;
    }
  }

  .count {
    color: #9C9CA6;
  }
</style>

<style lang="scss">
  .activity__checkbox-group {
    .el-checkbox {
      font-weight: 300;
    }
  }
</style>
