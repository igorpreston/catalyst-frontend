<template>
  <div class="flex flex-auto flex-column ph24 pt24 stats">
    <contacts-detail-tabs-overview-stats-product/>

    <div class="flex flex-auto stats-bottom">
      <contacts-detail-tabs-overview-stats-tasks/>

      <contacts-detail-tabs-overview-stats-activity/>
    </div>
  </div>
</template>

<script>
import ContactsDetailTabsOverviewStatsProduct from '#/components/contacts/contacts-detail-tabs-overview-stats-product'
import ContactsDetailTabsOverviewStatsTasks from '#/components/contacts/contacts-detail-tabs-overview-stats-tasks'
import ContactsDetailTabsOverviewStatsActivity from '#/components/contacts/contacts-detail-tabs-overview-stats-activity'

export default {
  name: 'ContactsDetailTabsOverviewStats',

  components: {
    ContactsDetailTabsOverviewStatsProduct,
    ContactsDetailTabsOverviewStatsTasks,
    ContactsDetailTabsOverviewStatsActivity
  }
}
</script>

<style lang="scss">
  .stats {
    height: 100%;

    &__heading {
      padding: 13px 16px;
    }

    &__task {
      padding: 13px 16px;
    }

    &--empty {
      h3 {
        font-size: 1rem;
      }

      p {
        font-size: .875rem;
      }

      .measure {
        padding: 14px 0;
      }

      &__icon {
        padding: 11px;
      }
    }

    .stats-bottom {
      height: 500px;
    }
  }
</style>
