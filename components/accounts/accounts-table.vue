<template>
  <div>
    <miso-table
      v-loading="isLoadingAccounts"
      :class="{ 'flex' : segmentFormData.terms.length < 5 }"
      :data="accounts.all"
      borderless
      class="flex-auto flex-column"
      data-cy="account-table"
      element-loading-text="Loading accounts"
      row-key="id"
      @sort-change="sortChange">
      <div slot="empty">
        <miso-empty
          class="pv5"
          heading="No Accounts"
          body="You're good to go!"/>
      </div>

      <miso-table-column
        v-if="!segmentPage"
        type="selection"
        width="55"/>

      <miso-table-column
        v-if="isJustworks"
        min-width="50">
        <template slot-scope="scope">
          <span
            :class="healthClass()"
            class="flex mr2 f7">
            &bull;
          </span>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Account"
        sortable="custom"
        prop="name"
        min-width="130">
        <template slot-scope="scope">
          <a
            :href="accountUrl(scope.row.id)"
            class="link"
            data-cy="account-name-column">
            {{ scope.row.name }}
          </a>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Description"
        width="400">
        <template slot-scope="scope">
          <div class="truncate description-fix">
            {{ scope.row.description }}
          </div>
        </template>
      </miso-table-column>

      <miso-table-column
        v-if="segmentPage && isJustworks"
        label="Task Created"
        width="120">
        <template slot-scope="scope">
          <div>
            <span class="fl">
              {{ Math.floor(Math.random() * Math.floor(100)) }}
            </span>
            <span class="fr">
              <i
                class="el-icon-caret-top green"
                aria-hidden="true"/>
              {{ Math.floor(Math.random() * Math.floor(100)) }}%
            </span>
          </div>
        </template>
      </miso-table-column>

      <miso-table-column
        label="Owner"
        min-width="130"
        prop="owner.full_name"
        sortable="custom">
        <template slot-scope="scope">
          {{ findSalesforceUserById(scope.row.owner && scope.row.owner.id) &&
          findSalesforceUserById(scope.row.owner.id).full_name }}
        </template>
      </miso-table-column>

      <miso-table-column
        label="Value"
        min-width="150"
        prop="contract_value"
        sortable="custom">
        <template slot-scope="scope">
          ${{ scope.row.decimal_contract_value || '0.00' }}
        </template>
      </miso-table-column>

      <miso-table-column
        label="Stage"
        min-width="150"
        prop="stage"
        head
        sortable="custom"/>

      <miso-table-column
        label="Renewal"
        prop="renewal_date"
        min-width="150"
        sortable="custom">
        <template slot-scope="scope">
          {{ parseDate(scope.row.renewal_date) }}
        </template>
      </miso-table-column>

      <miso-table-column
        label="Last Activity"
        min-width="170"
        prop="last_activity_at"
        sortable="custom">
        <template slot-scope="scope">
          {{ parseDate(scope.row.last_activity_at) }}
        </template>
      </miso-table-column>

      <miso-table-column
        v-for="(col) in columns"
        :label="startCase(col)"
        :prop="col"
        :key="col"
        min-width="200"
        head
        sortable="custom"/>
    </miso-table>

    <div class="bg-white pa3 tr z-999 br bb bl b--light-gray">
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
import moment from 'moment-timezone'
import _ from 'lodash'

import {
  MisoButton,
  MisoEmpty,
  MisoInput,
  MisoMessage,
  MisoOption,
  MisoPagination,
  MisoSelect,
  MisoTable,
  MisoTableColumn
} from 'miso'

export default {
  name: 'AccountsTable',

  components: {
    MisoButton,
    MisoEmpty,
    MisoInput,
    MisoMessage,
    MisoOption,
    MisoPagination,
    MisoSelect,
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
    ...mapGetters([
      'segmentFormData',
      'isJustworks'
    ]),

    columns () {
      const BLACKLIST = ['id', 'name', 'description', 'decimal_contract_value',
        'stage', 'renewal_date', 'last_activity_at', 'errors', 'campaigns',
        'contacts', 'name_initials', 'starred', 'updated_at',
        'contract_value', 'owner_id']
      return _.difference(this.fields, BLACKLIST)
    },

    ...mapState({
      page: state => state.accounts.page,
      pageSize: state => state.accounts.pageSize,
      accounts: state => state.accounts,
      total: state => state.accounts.total,
      isFiltered: state => state.accounts.isFiltered,
      order: state => state.accounts.order,
      sortColumn: state => state.accounts.sortColumn,
      isLoadingAccounts: state => state.accounts.isLoadingAccounts,
      currentUser: state => state.auth.currentUser,
      salesforceUsers: state => state.salesforceUsers
    }),

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
      this.fetchAccounts(newPage)
    }
  },

  beforeMount () {
    this.updatePage(1)
    this.fetchAccounts(this.page)
    this.fetchAccountSegmentFields()
      .then((res) => {
        this.fields = _.map(res.data, 'field')
      })
  },

  methods: {
    ...mapActions([
      'fetchAccountSegmentFields',
      'getAccounts',
      'getFilteredAccounts',
      'updateOrder',
      'updatePage',
      'updateSortColumn'
    ]),

    parseDate (date) {
      if (!date) return
      return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    },

    accountUrl (accountId) {
      return `/accounts/${accountId}`
    },

    fetchAccounts (page) {
      if (this.isFiltered) {
        this.getFilteredAccounts(page)
      } else {
        this.getAccounts()
          .catch(() => {
            MisoMessage.error('Failed to fetch the accounts')
          })
      }
    },

    startCase (col) {
      return _.startCase(col)
    },

    sortChange (obj) {
      this.updateSortColumn(obj.prop)
      this.updateOrder(obj.order)
      this.updatePage(1)
      this.fetchAccounts(this.page)
    },

    findSalesforceUserById (id) {
      return this.salesforceUsers.all.find(salesforceUser => salesforceUser.id === id)
    },

    healthClass () {
      switch (Math.floor(Math.random() * Math.floor(3)) % 3) {
        case 0:
          return 'red'
        case 1:
          return 'green'
        default:
          return 'gray'
      }
    }
  }
}
</script>

<style>
  @media not all and (min-resolution:.001dpcm)
  { @supports (-webkit-appearance:none) and (stroke-color:transparent) {
    .description-fix {
      width: 350px;
    }
  }}
</style>
