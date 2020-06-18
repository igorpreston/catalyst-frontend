<template>
  <div class="flex flex-auto flex-column bg-white ba b--purple-gray flex-1 ma24 ph3 templates-view">
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

        <div class="flex f7 items-start lh-copy templates-view__sub-info">
          <feather-icon
            width="14"
            height="14"
            name="info"
            color="inherit"
            class="mr2">
          </feather-icon>

          <p class="ma0">
            For preview purposes, we’ve radomly selected a sample contact
          </p>
        </div>
      </div>

      <div class="flex flex-auto pl24 templates-view__description">
        <templates-view-preview></templates-view-preview>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import { FeatherIcon } from 'miso'

  import TemplatesViewHeader from '#/components/templates/templates-view-header'
  import TemplatesViewInfo from '#/components/templates/templates-view-info'
  import TemplatesViewPreview from '#/components/templates/templates-view-preview'

  export default {
    name: 'template-view',

    props: ['onShowSidePanel'],

    components: {
      FeatherIcon,
      TemplatesViewHeader,
      TemplatesViewInfo,
      TemplatesViewPreview
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

    &__description {
      min-width: 934px;
    }

    &__sub-info {
      color: #616169;
    }
  }
</style>
