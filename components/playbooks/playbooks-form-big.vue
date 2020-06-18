<template>
  <div class="flex flex-auto flex-column pa24 f6 playbooks-form-big">
    <playbooks-form-big-header :on-hide-big-form="onHideBigForm"/>

    <div class="flex bl br bb b--light-gray bg-white overflow-x-auto pv24">
      <div class="flex flex-auto flex-column br b--light-gray ph24 overflow-y-auto sub-column__info">
        <playbooks-form-big-description class="info__item"/>

        <playbooks-form-big-conditions class="info__item"/>

        <playbooks-form-big-actions class="info__item"/>
      </div>

      <div class="flex flex-auto flex-column ph24 overflow-y-auto sub-column__members">
        <playbooks-members
          :members-type="membersType"
          :members="members"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import PlaybooksFormBigHeader from '#/components/playbooks/playbooks-form-big-header'
import PlaybooksFormBigDescription from '#/components/playbooks/playbooks-form-big-description'
import PlaybooksFormBigConditions from '#/components/playbooks/playbooks-form-big-conditions'
import PlaybooksFormBigActions from '#/components/playbooks/playbooks-form-big-actions'
import PlaybooksMembers from '#/components/playbooks/playbooks-members'

export default {
  name: 'PlaybooksFormBig',

  components: {
    PlaybooksFormBigHeader,
    PlaybooksFormBigDescription,
    PlaybooksFormBigConditions,
    PlaybooksFormBigActions,
    PlaybooksMembers
  },

  props: {
    onHideBigForm: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapState({
      accounts: state => state.accounts.all,
      contacts: state => state.contacts.all,
      members: state => state.playbooks.members
    }),

    ...mapGetters(['playbookFormData']),

    membersType () {
      if (this.playbookFormData.object) {
        return `${this.playbookFormData.object}s`
      } else {
        return 'members'
      }
    }
  }
}
</script>

<style lang="scss">
  .playbooks-form-big {
    .white-input {
      padding: .563rem;
    }
  }
</style>

<style lang="scss" scoped>
  .sub-column {
    &__info {
      flex: 0 0 838px;
      height: calc(100vh - 235px);
    }

    &__members {
      min-width: 391px;
      height: calc(100vh - 235px);
    }
  }

  .info {
    &__item {
      flex: 0 0 auto;
    }
  }
</style>
