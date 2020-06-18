<template>
  <div
    :class="{ 'flex' : segmentFormData.terms.length < 5 }"
    class="flex flex-auto flex-column">
    <miso-table
      v-loading="isLoadingContacts"
      ref="contactTable"
      :data="contacts.all"
      class="flex-auto"
      data-cy="contact-table"
      element-loading-text="Loading contacts"
      row-key="id"
      @selection-change="selectContacts"
      @sort-change="sortChange">
      <div slot="empty">
        <miso-empty
          heading="No Contact Results"
          body="Make a search"
          class="pv3"/>
      </div>
      <miso-table-column
        v-if="!segmentPage"
        :reserve-selection="true"
        type="selection"
        width="50"/>
      <miso-table-column
        label="Name"
        prop="full_name"
        min-width="200"
        sortable="custom">
        <template slot-scope="scope">
          <a
            :href="contactUrl(scope.row.id)"
            class="purple no-underline underline-hover f6 m"
            data-cy="contact-name-column">
            {{ scope.row.full_name }}
          </a>
        </template>
      </miso-table-column>
      <miso-table-column
        label="Title"
        prop="title"
        min-width="140"
        sortable="custom">
        <template slot-scope="scope">
          <div class="truncate">
            {{ scope.row.title }}
          </div>
        </template>
      </miso-table-column>
      <miso-table-column
        label="Account"
        prop="account.name"
        min-width="200"
        sortable="custom">
        <template slot-scope="scope">
          <a
            :href="accountUrl(scope.row.account && scope.row.account.id)"
            class="purple no-underline underline-hover f6 m"
            data-cy="account-name-column">
            {{ scope.row.account && scope.row.account.name }}
          </a>
        </template>
      </miso-table-column>
      <miso-table-column
        label="Email"
        prop="email"
        min-width="200"
        sortable="custom">
        <template slot-scope="scope">
          <div class="truncate">
            {{ scope.row.email }}
          </div>
        </template>
      </miso-table-column>
      <miso-table-column
        label="Phone"
        prop="phone"
        min-width="200"
        sortable="custom">
        <template slot-scope="scope">
          <div class="truncate">
            {{ scope.row.phone }}
          </div>
        </template>
      </miso-table-column>
      <miso-table-column
        label="Role"
        min-width="200">
        <template slot-scope="scope">
          <div class="ma0 truncate two-lines">
            {{ rolesString(scope.row.roles) }}
          </div>
        </template>
      </miso-table-column>
      <miso-table-column
        v-for="(col) in columns"
        :label="startCase(col)"
        :prop="col"
        :key="col"
        min-width="150"
        head
        sortable="custom"/>
    </miso-table>

    <div class="bg-white pa3 tr br bb bl b--light-gray">
      <miso-pagination
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="total"
        layout="prev, pager, next"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import {
  FeatherIcon,
  MisoButton,
  MisoEmpty,
  MisoHeading,
  MisoInput,
  MisoMessage,
  MisoPagination,
  MisoTable,
  MisoTableColumn
} from 'miso'

export default {
  name: 'ContactsTableBody',

  components: {
    FeatherIcon,
    MisoButton,
    MisoEmpty,
    MisoHeading,
    MisoInput,
    MisoMessage,
    MisoPagination,
    MisoTable,
    MisoTableColumn
  },

  props: {
    segmentPage: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      fields: []
    }
  },

  computed: {
    ...mapGetters(['segmentFormData']),
    ...mapState({
      page: state => state.contacts.page,
      pageSize: state => state.contacts.pageSize,
      contacts: state => state.contacts,
      total: state => state.contacts.total,
      isFiltered: state => state.contacts.isFiltered,
      order: state => state.contacts.order,
      sortColumn: state => state.contacts.sortColumn,
      isLoadingContacts: state => state.contacts.isLoadingContacts,
      includes: state => state.contacts.includes
    }),

    columns () {
      const BLACKLIST = ['id', 'name', 'first_name', 'last_name', 'full_name',
        'name_initials', 'roles', 'last_activity_at', 'errors', 'account_id',
        'title', 'account', 'starred', 'updated_at', 'email', 'phone']
      return _.difference(this.fields, BLACKLIST)
    },

    currentPage: {
      get () {
        return this.page
      },
      set (page) {
        this.updatePage(page)
      }
    }
  },

  watch: {
    currentPage: function (newPage, oldPage) {
      this.fetchContacts(newPage)
    }
  },

  beforeMount () {
    this.updatePage(1)
    this.fetchContacts(this.currentPage)
    this.fetchContactSegmentFields()
      .then((res) => {
        this.fields = _.map(res.data, 'field')
      })
  },

  methods: {
    ...mapActions([
      'fetchContactSegmentFields',
      'selectContacts',
      'getContacts',
      'getFilteredContacts',
      'updateSortColumn',
      'updateOrder',
      'updatePage',
      'updateIncludes'
    ]),

    startCase (col) {
      return _.startCase(col)
    },

    fetchContacts (page) {
      if (this.isFiltered) {
        this.getFilteredContacts(page)
      } else {
        const params = {
          page: page,
          per_page: this.pageSize,
          prop: this.sortColumn,
          order: this.order,
          includes: this.includes
        }
        this.getContacts(params)
          .catch(() => {
            MisoMessage.error('Failed to fetch the contacts')
          })
      }
    },

    sortChange (obj) {
      if (obj.prop === 'account.name') {
        this.updateSortColumn('accounts.name')
        this.updateIncludes('account')
      } else if (obj.prop === 'full_name') {
        this.updateSortColumn('first_name, last_name')
        this.updateIncludes(null)
      } else {
        this.updateSortColumn(obj.prop)
      }
      this.updateOrder(obj.order)
      this.updatePage(1)
      this.fetchContacts(this.currentPage)
    },

    accountUrl (accountId) {
      return `/accounts/${accountId}`
    },

    contactUrl (contactId) {
      return `/contacts/${contactId}`
    },

    rolesString (roles) {
      return roles.map(role => role.name).join('; ')
    }
  }
}
</script>

<style lang="css">
</style>
