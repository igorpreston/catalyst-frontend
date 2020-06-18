<template>
  <div class="flex flex-auto flex-column ba b--light-gray preview">
    <header class="flex flex-column pa24 bb b--light-gray">
      <h3 class="f5 fw5 mt1 mb0">{{ currentTemplate.name }}</h3>

      <div class="flex flex-auto justify-between items-center mt3">
        <div class="flex f6 items-center">
          <span class="fw8">To</span>
          <templates-view-token class="mh2">{{ contact.full_name }} &lt;{{ contact.email }}&gt;</templates-view-token>
        </div>
        <p class="ma0 f6 date">09/20/2017</p>
      </div>
    </header>

    <div class="flex flex-auto flex-column pa3 mt1 overflow-y-auto">
      <div v-html="previewHtml" id="preview-email-template"></div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  import _ from 'lodash'
  import Mustache from 'mustache'

  import TemplatesViewToken from '#/components/templates/templates-view-token'

  export default {
    name: 'templates-view-preview-item',

    props: ['contact'],

    components: {
      TemplatesViewToken
    },

    computed: {
      ...mapGetters(['currentTemplate']),

      previewHtml () {
        const contact = this.contact
        const account = this.contact.account

        const keys = _.assign(
          this.extract(contact, 'contact'),
          this.extract(account, 'account')
        )

        return this.currentTemplate &&
          this.currentTemplate.content_html
              .replace(/{{\s*(contact|account)_[\w\.]+\s*}}/g, (match) => {

                const renderedField = Mustache.render(match, keys)

                if (!renderedField) {
                  return match
                }

                return '<div class="dib b--light-gray b--dashed pa1 f6">' + renderedField + '</div>'
              })
      }
    },

    methods: {
      extract (object, prefix) {
        return Object.keys(object).reduce((prev, curr) => ({
          ...prev,
          [(prefix + '_' + curr)]: object[curr]
        }), {})
      }
    }
  }
</script>

<style lang="scss">
  #preview-email-template img {
    max-width: 50% !important;
    display: block !important;
  }

  .preview {
    width: 805px;
    box-shadow: 0 2px 5px 0 rgba(171,188,199,0.35);
  }

  .date {
    color: #7E7F89;
  }
</style>
