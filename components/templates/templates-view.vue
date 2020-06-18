<template>
  <div class="flex flex-auto flex-column bg-white ba b--purple-gray flex-1 ph3 ma24 templates-view">
    <templates-view-header
      :created-by="currentTemplate.created_by_name"
      :category="currentTemplate.category"
      :on-show-side-panel="onShowSidePanel">
    </templates-view-header>

    <div class="flex overflow-x-auto">
      <div class="flex flex-auto flex-column br b--light-gray templates-view__info overflow-y-auto">
        <templates-view-info
          :name="currentTemplate.name"
          :date="currentTemplate.created_at"
          class="info__item">
        </templates-view-info>
      </div>

      <div class="flex flex-auto flex-column pl24 templates-view__description">
        <templates-view-description :description="currentTemplate.content_html">
        </templates-view-description>

        <templates-view-fields
          :fields="currentTemplate.fields"
          class="info__item">
        </templates-view-fields>

        <templates-view-tasks
          :tasks="currentTemplate.tasks"
          class="info__item">
        </templates-view-tasks>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  import { mapGetters } from 'vuex'

  import TemplatesViewHeader from '#/components/templates/templates-view-header'
  import TemplatesViewInfo from '#/components/templates/templates-view-info'
  import TemplatesViewFields from '#/components/templates/templates-view-fields'
  import TemplatesViewTasks from '#/components/templates/templates-view-tasks'
  import TemplatesViewDescription from '#/components/templates/templates-view-description'

  export default {
    name: 'template-view',

    props: ['onShowSidePanel'],

    components: {
      TemplatesViewHeader,
      TemplatesViewInfo,
      TemplatesViewFields,
      TemplatesViewTasks,
      TemplatesViewDescription
    },

    computed: {
      ...mapGetters(['currentTemplate'])
    }
  }
</script>

<style lang="scss">
  $spacing: 24px;

  .templates-view {
    color: #404046;

    &__heading {
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 15px;
    }

    &__info,
    &__description {
      margin: $spacing 0 0;
    }

    &__info {
      flex: 0 0 241px;
      height: calc(100vh - 220px);
      padding-right: $spacing;
    }

    &__sub-info {
      color: #616169;
    }

    &__empty {
      color: #7E7F89;
    }
  }
</style>
