<template>
  <div class="flex">
    <settings-users-table
      class="settings-users-table"
      destination="settings"
      :on-show-side-panel="onShowSidePanel"
      :on-hide-side-panel="onHideSidePanel">
    </settings-users-table>
  </div>
</template>

<script>
  import SettingsUsersTable from '#/components/settings/settings-users-table'

  export default {
    name: 'settings-tabs-users',

    props: {
      onShowSidePanel: Function,
      onHideSidePanel: Function
    },

    components: {
      SettingsUsersTable
    }
  }
</script>
