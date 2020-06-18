<template>
  <aside
    class="pa3 br b--purple-gray overflow-x-hidden info"
    style="flex: 0 0 275px">

    <contacts-detail-tabs-overview-info-inline-form />
    <accounts-detail-tabs-overview-info-inline-form />
  </aside>
</template>

<script>
import AccountsDetailTabsOverviewInfoInlineForm from '#/components/accounts/accounts-detail-tabs-overview-info-inline-form'
import ContactsDetailTabsOverviewInfoInlineForm from '#/components/contacts/contacts-detail-tabs-overview-info-inline-form'

export default {
  name: 'ContactsDetailTabsOverviewInfo',

  components: {
    AccountsDetailTabsOverviewInfoInlineForm,
    ContactsDetailTabsOverviewInfoInlineForm
  }
}
</script>
