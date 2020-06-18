<template>
  <header class="pa3 pl4 pr24 bg-white bb b--purple-gray z-10">
    <div class="flex items-center justify-between">

      <miso-heading
        level="3"
        class="mv0 dark-gray fw5 f4">
        Settings
      </miso-heading>

      <div class="flex items-center justify-around">
        <div class="flex flex-auto relative search">
          <feather-icon
            width="19"
            height="19"
            name="search"
            color="mid-gray"
            class="absolute z-1 search__icon"/>

          <miso-select
            :remote-method="setFilterQuery"
            :loading="loading"
            v-model="item"
            filterable
            clearable
            remote
            value-key="id"
            class="ml3 mr3 white-select f6 search__select"
            placeholder="Search accounts or contacts...">
            <miso-option-group label="Accounts">
              <miso-option
                v-for="account in accounts"
                :key="account.id"
                :value="account"
                :label="account.name">
                <div class="flex">
                  <circle-badge
                    variant="dark"
                    class="mr2">
                    {{ account.name_initials }}
                  </circle-badge>
                  <div>
                    <p class="mv0">{{ account.name }}</p>
                  </div>
                </div>
              </miso-option>
            </miso-option-group>

            <miso-option-group label="Contacts">
              <miso-option
                v-for="contact in contacts"
                :key="contact.id"
                :value="contact"
                :label="contact.full_name">
                <div class="flex">
                  <circle-badge
                    variant="dark"
                    class="mr2">
                    {{ contact.name_initials }}
                  </circle-badge>

                  <div>
                    <p class="mv0">{{ contact.full_name }}</p>
                    <p class="mv0">{{ contactDescription(contact) }}</p>
                  </div>
                </div>
              </miso-option>
            </miso-option-group>
          </miso-select>
        </div>

        <div class="flex flex-auto ph3 bl br b--light-gray">
          <popper
            v-if="isJustworks"
            :options="{ placement: 'bottom' }">
            <div class="popper el-tooltip__popper is-dark">
              Send Email
            </div>

            <miso-button
              slot="reference"
              type="transparent"
              class="nav__button dark-gray mr2 mid-gray hover-dark-gray"
              @click="onShowSidePanel('CreateEmailForm')">
              <feather-icon
                width="17"
                height="17"
                name="mail"
                color="inherit"/>
            </miso-button>
          </popper>

          <popper :options="{ placement: 'bottom' }">
            <div class="popper el-tooltip__popper is-dark">
              Create Task
            </div>

            <miso-button
              slot="reference"
              type="transparent"
              class="nav__button dark-gray mr2 mid-gray hover-dark-gray"
              @click="onShowSidePanel('CreateTaskForm')">
              <feather-icon
                width="17"
                height="17"
                name="check"
                color="inherit"/>
            </miso-button>
          </popper>

          <popper :options="{ placement: 'bottom' }">
            <div class="popper el-tooltip__popper is-dark">
              Take Note
            </div>

            <miso-button
              slot="reference"
              type="transparent"
              class="nav__button dark-gray mid-gray hover-dark-gray"
              @click="onShowSidePanel('CreateNoteForm')">
              <feather-icon
                width="17"
                height="17"
                name="edit-2"
                color="inherit"/>
            </miso-button>
          </popper>
        </div>

        <miso-popover
          ref="profilePopover"
          placement="bottom-end"
          trigger="click">
          <div class="flex flex-auto flex-column f6 profile__popover">
            <div class="flex flex-auto flex-column bb b--light-gray profile__popover--wrap">
              <p class="mv1 fw5">{{ currentUser && currentUser.name }}</p>

              <p class="mt0 mb1 profile__email">{{ currentUser && currentUser.email }}</p>
              <p class="mt0 mb3 profile__customer_name">{{ currentUser && currentUser.customer && currentUser.customer.name }}</p>
            </div>
            <miso-button
              class="tl profile__logout"
              type="transparent"
              @click="logout">
              Log Out
            </miso-button>
          </div>
        </miso-popover>

        <div
          v-popover:profilePopover
          class="flex flex-auto pointer no-outline">
          <circle-badge
            class="ml3 white profile__badge">
            {{ currentUser && currentUser.name_initials }}
          </circle-badge>
        </div>
      </div>

    </div>
  </header>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { sidepanel } from '#/components/mixins/sidepanel'
import axios from 'axios'
import Popper from 'vue-popperjs'
import {
  MisoHeading,
  MisoButton,
  MisoButtonLink,
  MisoSelect,
  MisoOption,
  MisoOptionGroup,
  MisoPopover,
  CircleBadge,
  FeatherIcon
} from 'miso'

export default {
  name: 'DashboardHeader',

  components: {
    Popper,
    MisoHeading,
    MisoButton,
    MisoButtonLink,
    MisoSelect,
    MisoOption,
    MisoOptionGroup,
    MisoPopover,
    CircleBadge,
    FeatherIcon
  },

  mixins: [sidepanel],

  props: {
    onShowSidePanel: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      selectedItem: '',
      loading: false
    }
  },

  computed: {
    ...mapState({
      accounts: state => state.accounts.navbar,
      contacts: state => state.contacts.navbar,
      filterQueryAccounts: state => state.accounts.filterQuery,
      filterQueryContacts: state => state.contacts.filterQuery,
      currentUser: state => state.auth.currentUser
    }),

    ...mapGetters([
      'isJustworks'
    ]),

    item: {
      get () {
        return this.selectedItem
      },

      set (item) {
        this.selectedItem = item
        this.setFilterQuery('')
        if (item.type === 'contact') {
          window.location.href = `/contacts/${item.id}`
        } else {
          window.location.href = `/accounts/${item.id}`
        }
      }
    }
  },

  methods: {
    ...mapMutations([
      'setAccountsForNav',
      'setContactsForNav'
    ]),

    logout () {
      axios.delete(`/session/`).then(() => {
        window.location.href = 'session/new'
      })
    },

    setFilterQuery (query) {
      if (query) {
        this.loading = true
        let promises = [
          this.getAccounts(query, true),
          this.getContacts(query, true)
        ]
        Promise.all(promises).then(() => {
          this.loading = false
        })
      } else {
        this.setAccountsForNav([])
        this.setContactsForNav([])
      }
    },

    contactDescription (contact) {
      if (contact.account && contact.account.name) {
        return `${contact.title} @ ${contact.account.name}`
      } else {
        return contact.title
      }
    }
  }
}
</script>
