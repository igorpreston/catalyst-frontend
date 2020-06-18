<template>
  <div v-loading="isLoadingContact">
    <header class="flex items-center justify-between mb3">
      <miso-heading
        level="3"
        class="mv0 dark-gray-accent">Contact Info</miso-heading>
      <miso-button
        v-if="isEditing"
        type="primary"
        size="small"
        @click="disableEdit">
        Save
      </miso-button>
      <miso-button
        v-else
        type="outline"
        size="small"
        @click="enableEdit" >
        Edit
      </miso-button>
    </header>

    <div>
      <div
        v-for="(info, index) in tempContact.contactInfo"
        :key="info[0]"
        class="mb3">

        <contacts-detail-tabs-overview-info-text-input
          :label="format(info[0])"
          :is-editing="isInfoEditing(info[0])"
          :filter-value="filterValue(info[0])"
          :validation-rule="''"
          v-model="tempContact.contactInfo[index][1]"/>
      </div>

      <div class="mb3">
        <miso-label class="mid-gray db mb2">Account</miso-label>
        <div class="mt2">
          <p class="mv0 f6">
            <a
              :href="accountUrl(account && account.id)"
              class="purple no-underline underline-hover f6 m mv0">
              {{ (account && account.name) }}
            </a>
          </p>
        </div>
      </div>

      <div class="mb3">
        <miso-label class="mid-gray db mb2">Roles</miso-label>
        <div class="mt2">
          <p
            v-for="(role, id) in roles"
            :key="id"
            class="mv0 f6">
            {{ role.name }}
          </p>
          <p
            v-if="!(roles && roles.length)"
            class="mv0 f6">
            n/a
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'

import {
  MisoBadge,
  MisoButton,
  MisoHeading,
  MisoLabel,
  MisoMessage,
  MisoOption,
  MisoSelect
} from 'miso'

import ContactsDetailTabsOverviewInfoTextInput from '#/components/contacts/contacts-detail-tabs-overview-info-text-input'

export default {
  name: 'ContactsDetailTabsOverviewInfoInlineForm',

  components: {
    ContactsDetailTabsOverviewInfoTextInput,
    MisoBadge,
    MisoButton,
    MisoHeading,
    MisoLabel,
    MisoMessage,
    MisoOption,
    MisoSelect
  },

  data () {
    return this.initialData()
  },

  computed: {
    ...mapState({
      contact: state => state.contacts.contact,
      accounts: state => state.accounts.all,
      isLoadingContact: state => state.contacts.isLoadingContact
    }),

    account () {
      return this.contact && this.contact.account
    },

    roles () {
      return this.tempContact && this.tempContact.roles
    }
  },

  watch: {
    contact: function (newContact) {
      Object.assign(this.$data, this.initialData())
      this.tempContact = newContact
    }
  },

  beforeMount () {
    if (this.contact) {
      this.tempContact = this.contact
    }
  },

  methods: {
    ...mapActions(['updateContactInfo']),

    enableEdit () {
      this.isEditing = true
    },

    accountUrl (id) {
      return `/accounts/${id}`
    },

    disableEdit () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        this.isSaving = true
        this.updateContactInfo({
          info: _.fromPairs(this.tempContact.contactInfo)
        })
          .then(() => {
            this.isEditing = false
            this.isSaving = false
            MisoMessage.success('Successfully updated contact info')
          })
          .catch(() => MisoMessage.error('Failed to update contact info'))
      })
    },

    format (info) {
      return _.titleize(info.split('_').join(' '))
    },

    isInfoEditing (infoType) {
      if (infoType === 'contract_value') {
        return this.isEditing
      } else if (infoType === 'size') {
        return this.isEditing
      } else if (infoType !== 'campaigns') {
        return this.isEditing
      } else {
        return false
      }
    },

    filterValue (infoType) {
      if (infoType === 'contract_value') {
        return 'currency'
      }
    },

    initialData () {
      return {
        isEditing: false,
        isSaving: false,
        tempContact: {
          first_name: null,
          last_name: null,
          title: null,
          email: null,
          phone: null,
          address: null
        }
      }
    }
  }
}
</script>
