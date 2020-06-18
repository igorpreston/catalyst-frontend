<template>
  <div class="flex flex-auto flex-column pa24">
    <playbooks-view-header
      :name="playbook.name"
      :user="playbook.user.name"
      :created-at="playbook.created_at"
      :status="playbook.active"
      :on-close-playbook="onClosePlaybook"
      :on-show-edit-form="onShowEditForm"
      :id="playbook.id"/>

    <div class="flex br bb bl b--light-gray bg-white overflow-x-auto overflow-y-hidden pv24">
      <div class="flex flex-auto flex-column br b--light-gray overflow-y-auto playbooks-view__info ph24">
        <playbooks-view-description
          :description="playbook.description"
          class="bb b--light-gray info__item pb24"/>

        <playbooks-view-conditions
          :conditions="playbook.conditions"
          :object="playbook.object"
          class="bb b--light-gray info__item pv24"/>

        <playbooks-view-actions
          :actions="playbook.actions"
          class="info__item pv24"/>
      </div>

      <div class="flex flex-auto flex-column overflow-y-auto playbooks-view__description ph24">
        <playbooks-members
          :members-type="membersType"
          :members="members"
          :view="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import { mapState, mapActions, mapGetters } from 'vuex'

import PlaybooksViewHeader from '#/components/playbooks/playbooks-view-header'
import PlaybooksViewConditions from '#/components/playbooks/playbooks-view-conditions'
import PlaybooksViewActions from '#/components/playbooks/playbooks-view-actions'
import PlaybooksViewDescription from '#/components/playbooks/playbooks-view-description'
import PlaybooksMembers from '#/components/playbooks/playbooks-members'

export default {
  name: 'PlaybooksView',

  components: {
    PlaybooksViewHeader,
    PlaybooksViewConditions,
    PlaybooksViewActions,
    PlaybooksViewDescription,
    PlaybooksMembers
  },
  props: [
    'playbook',
    'onClosePlaybook',
    'onShowSidePanel',
    'onShowEditForm'
  ],
  computed: {
    ...mapState({
      accounts: state => state.accounts.all,
      contacts: state => state.contacts.all,
      members: state => state.playbooks.members
    }),

    ...mapGetters(['playbookFormData']),

    membersType () {
      if (this.playbook.object) {
        return `${this.playbook.object}s`
      } else {
        return 'members'
      }
    }
  },
  beforeMount () {
    this.filterMembers(this.playbook)
  },
  methods: {
    ...mapActions(['filterMembers'])
  }
}
</script>

<style lang="scss">
  .playbooks-view {
    color: #404046;
    background-color: #fff;

    &__heading {
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 15px;
    }

    &__info {
      flex: 0 0 838px;
      height: calc(100vh - 235px);
    }

    &__description {
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
