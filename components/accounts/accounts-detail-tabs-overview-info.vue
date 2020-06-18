<template>
  <aside
    class="pa3 br b--purple-gray overflow-x-hidden"
    style="flex: 0 0 275px">

    <accounts-detail-tabs-overview-info-inline-form/>

    <!-- <accounts-detail-tabs-overview-info-header :is-editing="isEditing" :on-enable-edit="enableEdit" :on-disable-edit="disableEdit"></accounts-detail-tabs-overview-info-header>
    <accounts-detail-tabs-overview-info-inline-form :is-editing="isEditing"></accounts-detail-tabs-overview-info-inline-form> -->
  </aside>
</template>

<script>
import AccountsDetailTabsOverviewInfoHeader from '#/components/accounts/accounts-detail-tabs-overview-info-header'
import AccountsDetailTabsOverviewInfoInlineForm from '#/components/accounts/accounts-detail-tabs-overview-info-inline-form'

export default {
  name: 'AccountsDetailTabsOverviewInfo',

  components: {
    AccountsDetailTabsOverviewInfoHeader,
    AccountsDetailTabsOverviewInfoInlineForm
  }
}
</script>

<style scoped>
  .info {
    height: calc(100vh - 212px);
  }
</style>
