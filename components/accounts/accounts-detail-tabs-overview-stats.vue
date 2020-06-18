<template>
  <div class="flex flex-auto flex-column ph24 pt24 stats">
    <img
      v-if="isJustworks"
      :src="assetsHost + '/images/account-life-cycle-journey.png'"
      class="mb3">

    <accounts-detail-tabs-overview-stats-product/>

    <div class="flex flex-auto stats-bottom">
      <accounts-detail-tabs-overview-stats-tasks/>

      <accounts-detail-tabs-overview-stats-activity/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import AccountsDetailTabsOverviewStatsProduct from '#/components/accounts/accounts-detail-tabs-overview-stats-product'
import AccountsDetailTabsOverviewStatsTasks from '#/components/accounts/accounts-detail-tabs-overview-stats-tasks'
import AccountsDetailTabsOverviewStatsActivity from '#/components/accounts/accounts-detail-tabs-overview-stats-activity'

export default {
  name: 'AccountsDetailTabsOverviewStats',

  components: {
    AccountsDetailTabsOverviewStatsProduct,
    AccountsDetailTabsOverviewStatsTasks,
    AccountsDetailTabsOverviewStatsActivity
  },

  computed: {
    ...mapGetters(['isJustworks', 'assetsHost'])
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
