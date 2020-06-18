<template>
  <div class="main-content-inner flex flex-auto pa24">
    <div class="flex flex-column vh-100">
      <div
        class="pb3">
        <div class="flex items-center justify-between">
          <p class="mv0 f6">
            Showing
            {{ results.length }}
            out of
            {{ results.length }}
            results
          </p>

          <div class="flex flex-auto justify-end">
            <miso-button
              type="outline"
              class="mr2">
              Edit
            </miso-button>

            <miso-button
              type="primary"
              v-if="sidePanelView !== 'SegmentsDetailActivity'"
              @click="onShowSidePanel('SegmentsDetailActivity')">
              Timeline
            </miso-button>
          </div>
        </div>
      </div>

      <segments-detail-table-accounts
        :accounts="results"
        v-if="isAccountSegment">
      </segments-detail-table-accounts>
      <segments-detail-table-contacts
        :contacts="results"
        v-else>
      </segments-detail-table-contacts>

      <div class="bg-white pa3 tr z-1 bl bb br b--purple-gray">
        <miso-pagination
          layout="prev, pager, next"
          :pageSize="10"
          :pageCount="10"
          :total="1">
        </miso-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  import SegmentsDetailTableAccounts from '#/components/segments/segments-detail-table-accounts'
  import SegmentsDetailTableContacts from '#/components/segments/segments-detail-table-contacts'

  import {
    MisoPagination,
    MisoButton
  } from 'miso'

  export default {
    name: 'segments-detail-table',

    props: {
      segmentType: String,
      segmentId: String,
      onShowSidePanel: Function,
      sidePanelView: String
    },

    components: {
      MisoPagination,
      MisoButton,
      SegmentsDetailTableAccounts,
      SegmentsDetailTableContacts
    },

    data () {
      return {
        results: []
      }
    },

    computed: {
      accountUrl(accountId) {
        return `/accounts/${accountId}`
      },

      contactUrl(contactId) {
        return `/contacts/${contactId}`
      },

      isAccountSegment () {
        return this.segmentType === 'Account'
      }
    },

    methods: {
      getSegmentMembers () {
        axios.get(`/segments/${this.segmentId}/resources.json`)
          .then(response => {
            this.results = response.data
          })
          .catch(response => {
            console.log('segments.json call failed', response)
          })
      }
    },

    beforeMount () {
      this.getSegmentMembers()
    }
  }
</script>
