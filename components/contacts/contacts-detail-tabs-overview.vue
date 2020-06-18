<template>
  <div class="flex overflow-y-auto">
    <contacts-detail-tabs-overview-info/>
    <contacts-detail-tabs-overview-stats/>
  </div>
</template>

<script>
import {
  FeatherIcon
} from 'miso'

import ContactsDetailTabsOverviewInfo from '#/components/contacts/contacts-detail-tabs-overview-info'
import ContactsDetailTabsOverviewStats from '#/components/contacts/contacts-detail-tabs-overview-stats'

export default {
  name: 'ContactsDetailTabsOverview',

  components: {
    FeatherIcon,

    ContactsDetailTabsOverviewInfo,
    ContactsDetailTabsOverviewStats
  }
}
</script>

<style>
  .demo-image {
    outline: 1px solid var(--light-gray);
  }
</style>
