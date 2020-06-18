<template lang="html">
  <miso-table
    height="100%"
    class="vh-100"
    :data="contacts"
    borderless>
    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No Contacts"
        body="You're good to go!">
      </miso-empty>
    </div>

    <miso-table-column
      type="selection"
      width="55">
    </miso-table-column>

    <miso-table-column
      label="Contact"
      sortable
      min-width="130">
      <template slot-scope="scope">
        <div class="truncate two-lines">
          {{ scope.row.full_name }}
        </div>

        <div class="mid-gray mt2 truncate two-lines">
          {{ scope.row.title }}
          @
          {{ scope.row.account.name }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Email"
      min-width="200">
      <template slot-scope="scope">
        <div class="truncate">
          {{ scope.row.email }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Phone"
      min-width="200">
      <template slot-scope="scope">
        <div class="truncate">
          {{ scope.row.phone }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Address"
      min-width="300">
      <template slot-scope="scope">
        <div class="truncate">
          {{ scope.row.address }}
        </div>
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
  import {
    MisoEmpty,
    MisoTable,
    MisoTableColumn
  } from 'miso'

  export default {
    name: 'segments-detail-table-contacts',
    props: [
      'contacts'
    ],
    components: {
      MisoEmpty,
      MisoTable,
      MisoTableColumn
    }
  }
</script>
