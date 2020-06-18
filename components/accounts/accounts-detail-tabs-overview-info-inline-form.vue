<template>
  <div v-loading="isLoadingAccount">
    <header class="flex items-center justify-between mb3">
      <miso-heading
        level="3"
        class="mv0 dark-gray-accent">Account Info</miso-heading>
      <miso-button
        v-if="isEditing"
        :loading="isSaving"
        type="primary"
        size="small"
        @click="save">
        Save
      </miso-button>
      <miso-button
        v-else
        type="outline"
        size="small"
        @click="edit">
        Edit
      </miso-button>
    </header>

    <div
      v-for="(role, index) in tempAccount.contactRoles"
      :key="role.id || (role.value && role.value.id)"
      class="mb3">
      <div v-if="!isEditing">
        <miso-label class="db mb2 mid-gray">{{ role.name }}</miso-label>
        <div v-if="hasRoleValue(role)">
          <div
            v-if="!role.multiple"
            class="mt2">
            <a
              :href="contactUrl(role.value.id)"
              class="purple no-underline underline-hover f6 m mv0">
              {{ role.value && role.value.full_name }}
            </a>
            <p class="normal f6 mt1 mb0 mid-gray-accent">{{ role.value.title }}</p>
          </div>
          <div
            v-if="role.multiple"
            class="mt2">
            <div
              v-for="contact in role.value"
              :key="contact.id"
              class="mb3 mb0-last">
              <div v-if="contact">
                <a
                  :href="contactUrl(contact.id)"
                  class="purple no-underline underline-hover f6 m mv0">
                  {{ contact.full_name }}
                </a>
                <p class="normal f6 mt1 mb0 mid-gray-accent">{{ contact.title }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p
            class="mid-gray mv0 f6">
            No {{ role.name }} selected
          </p>
        </div>
      </div>
      <accounts-detail-tabs-overview-info-inline-form-select-input
        v-if="isEditing"
        :is-editing="isEditing"
        :label="role.name"
        :multiple="role.multiple"
        :multiple-limit="5"
        :validation-rule="role.required ? 'required' : ''"
        :value="role.value"
        v-model="tempAccount.contactRoles[index].value"
        value-key="id"
        no-data-text="No Contacts">
        <miso-option
          v-for="contact in contacts.all"
          slot="options"
          :value="contact"
          :key="contact.id"
          :label="contact.full_name">
          <div class="flex">
            <circle-badge
              variant="dark"
              class="mr2">
              {{ initials(contact.full_name) }}
            </circle-badge>
            <div>
              <p class="mv0">{{ contact.full_name }}</p>
              <p class="mv0 f6 o-70">{{ contact.title }}</p>
            </div>
          </div>
        </miso-option>
      </accounts-detail-tabs-overview-info-inline-form-select-input>
    </div>

    <div
      class="mb3">
      <div v-if="!isEditing">
        <miso-label class="db mb2 mid-gray">Account Owner</miso-label>
        <div v-if="owner && owner.full_name">
          <div class="mt2">
            <p class="mv0 f6 m">{{ owner.full_name }}</p>
          </div>
        </div>
        <div v-else>
          <p
            class="mid-gray mv0 f6">
            No Account Owner selected
          </p>
        </div>
      </div>
      <accounts-detail-tabs-overview-info-inline-form-select-input
        v-if="isEditing"
        :is-editing="isEditing"
        :multiple="false"
        :value="owner"
        :validation-rule="''"
        v-model="tempAccount.owner"
        label="Account Owner"
        value-key="id"
        no-data-text="No Users">
        <miso-option
          v-for="user in salesforceUsers.all"
          slot="options"
          :value="user"
          :key="user.id"
          :label="user.full_name">
          <div class="flex">
            <circle-badge
              variant="dark"
              class="mr2">
              {{ initials(user.full_name) }}
            </circle-badge>
            <div>
              <p class="mv0">{{ user.full_name }}</p>
            </div>
          </div>
        </miso-option>
      </accounts-detail-tabs-overview-info-inline-form-select-input>
    </div>

    <div
      v-for="(info, index) in tempAccount.accountInfo"
      :key="info[0]"
      class="mb3">

      <accounts-detail-tabs-overview-info-inline-form-text-input
        :label="format(info[0])"
        :is-editing="isInfoEditing(info[0])"
        :filter-value="filterValue(info[0])"
        :validation-rule="''"
        v-model="tempAccount.accountInfo[index][1]"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapState } from 'vuex'

import {
  CircleBadge,
  MisoButton,
  MisoHeading,
  MisoLabel,
  MisoMessage,
  MisoOption
} from 'miso'

import AccountsDetailTabsOverviewInfoInlineFormSelectInput from '#/components/accounts/accounts-detail-tabs-overview-info-inline-form-select-input'
import AccountsDetailTabsOverviewInfoInlineFormTextInput from '#/components/accounts/accounts-detail-tabs-overview-info-inline-form-text-input'

export default {
  name: 'AccountsDetailTabsOverviewInfoInlineForm',

  components: {
    AccountsDetailTabsOverviewInfoInlineFormSelectInput,
    AccountsDetailTabsOverviewInfoInlineFormTextInput,

    CircleBadge,
    MisoButton,
    MisoHeading,
    MisoLabel,
    MisoMessage,
    MisoOption
  },

  data () {
    return this.initialData()
  },

  computed: {
    ...mapState({
      account: state => state.accounts.account,
      contacts: state => state.contacts,
      salesforceUsers: state => state.salesforceUsers,
      users: state => state.users,
      isLoadingAccount: state => state.accounts.isLoadingAccount
    }),

    owner () {
      return this.salesforceUsers.all
        .find(salesforceUser => salesforceUser.id ===
          (this.tempAccount.owner && this.tempAccount.owner.id))
    }
  },

  watch: {
    account: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        Object.assign(this.$data, this.initialData())
        Object.assign(this.tempAccount, this.account)
        if (this.tempAccount.id) {
          this.fetchContactsByAccount(this.tempAccount.id)
          this.fetchRoles(this.tempAccount.id).then(() => {
            this.tempAccount.contactRoles = this.account.contactRoles
            this.tempAccount.salesforceUserRoles = this.account.salesforceUserRoles
          })
        }
      }
    }
  },

  beforeMount () {
    if (this.account) {
      Object.assign(this.tempAccount, this.account)
      if (this.tempAccount.id) {
        this.fetchContactsByAccount(this.tempAccount.id)
        this.tempAccount.contactRoles = this.account.contactRoles
        this.tempAccount.owner = this.account.owner
      }
    }
  },

  methods: {
    ...mapActions(['fetchContactsByAccount', 'updateRoles', 'updateInfo', 'fetchRoles']),

    edit () {
      this.isEditing = true
    },

    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        this.isSaving = true

        const promises = [
          this.updateRoles(this.tempAccount.contactRoles),
          this.updateInfo({
            info: _.fromPairs(this.tempAccount.accountInfo
              .concat([['owner_id', this.tempAccount.owner &&
                this.tempAccount.owner.id]]))
          })
        ]

        Promise.all(promises).then((res) => {
          this.isEditing = false
          this.isSaving = false
          MisoMessage.info('Account information has been saved')
        }).catch(() => MisoMessage.error('Failed to update account info'))
      })
    },

    hasRoleValue (role) {
      return _.has(role, 'value') && !_.isEmpty(role.value)
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

    contactUrl (contactId) {
      return `/contacts/${contactId}`
    },

    initials (input) {
      let initials = String(input).match(/\b\w/g) || []
      initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
      return initials
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
        tempAccount: {
          accountInfo: {},
          linkInfo: {},
          contactRoles: {},
          owner: null
        }
      }
    }
  }
}
</script>
