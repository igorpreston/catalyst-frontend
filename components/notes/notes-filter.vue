<template>
  <div v-if="visible" style="flex: 1 0 300px;" class="pl3">

    <header class="pt3 pb3">
      <p class="mv0" style="height: 32px; line-height: 32px;">Filter By</p>
    </header>

    <div>
      <div class="bg-white ba b--purple-gray pa3">

        <div class="mb3 f6" v-if="isContactDestination">
          <miso-label class="db mb2 mid-gray">Contact</miso-label>
          <miso-select
            filterable
            clearable
            v-model="filters.customer"
            value-key="name"
            class="w-100 white-select"
            placeholder="e.g John Doe">
            <miso-option
              v-for="customer in customers"
              :value="customer.id"
              :key="customer.id"
              :label="customer.full_name">
              <div class="flex">
                <circle-badge variant="dark">{{ customer.name_initials }}</circle-badge>
                <div class="ml2">
                  <p class="mt0 mb1">{{ customer.full_name }}</p>
                  <p class="mv0 f6 o-70">{{ customer.title }} @ {{ customer.account.name }}</p>
                </div>
              </div>
            </miso-option>
          </miso-select>
        </div>

        <div class="mb3 f6">
          <miso-label class="db mb2 mid-gray">Created Date</miso-label>
          <miso-date-picker
            v-model="filters.created"
            class="w-100"
            style="width: 100%;"
            type="daterange"
            format="MM/dd/yyyy"
            placeholder="e.g 11/16/2017 – 11/17/2017"
            range-separator=" - "
            start-placeholder="Start date"
            end-placeholder="End date">
          </miso-date-picker>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'

  import { mapState } from 'vuex'

  import {
    MisoLabel,

    MisoRadioGroup,
    MisoRadioButton,

    MisoSelect,
    MisoOption,
    CircleBadge,

    MisoDatePicker
  } from 'miso'

  export default {
    name: 'notes-filter',

    props: [
      'visible',
      'destination'
    ],

    components: {
      MisoLabel,
      MisoRadioGroup,
      MisoRadioButton,
      MisoSelect,
      MisoOption,
      CircleBadge,
      MisoDatePicker
    },

    computed: {
      ...mapState({
        filters: state => state.notes.filters,
        customers: state => state.contacts.all
      }),

      isContactDestination () {
        return !(this.destination === 'contact')
      }
    }
  }
</script>
