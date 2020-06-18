<template>
  <div class="flex">
    <accounts-detail-tabs-overview-info/>
    <accounts-detail-tabs-overview-stats/>
  </div>
</template>

<script>
import AccountsDetailTabsOverviewInfo from '#/components/accounts/accounts-detail-tabs-overview-info'
import AccountsDetailTabsOverviewStats from '#/components/accounts/accounts-detail-tabs-overview-stats'

export default {
  name: 'AccountsDetailTabsOverview',

  components: {
    AccountsDetailTabsOverviewInfo,
    AccountsDetailTabsOverviewStats
  }
}
</script>

<style>
  .demo-image {
    outline: 1px solid var(--light-gray);
  }
</style>
