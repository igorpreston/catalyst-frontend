<template>
  <header class="pv3 flex items-center justify-between bb b--light-gray header">
    <div class="flex items-center">
      <p class="ma0 pv2 header__title">
        Created by {{ createdByName }}
        <span
          v-if="contact"
          class="ma0 pv2 header__title">for
          <a
            :href="contactLink"
            class="link">{{ contact.full_name }}</a>
          <span>{{ contact.title }}</span>
        </span>
      </p>
    </div>
    <div class="flex items-center ml-auto">
      <div class="pr3 br b--light-gray">
        <miso-button
          type="outline"
          @click="onShowSidePanel('EditNoteForm')">Edit</miso-button>
      </div>
      <div class="pl2">
        <miso-button
          type="transparent"
          size="tiny"
          class="pa1"
          @click="onClose">
          <feather-icon
            name="x"
            height="20"
            width="20"
            color="gray"/>
        </miso-button>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  .pr3 {
    padding-right: 24px;
  }
  .pl2 {
    padding-left: 14px;
  }
  .header {
    &__title {
      font-size: 14px;
    }
  }
</style>

<script>
import Vue from 'vue'

import {
  MisoButton,
  FeatherIcon
} from 'miso'

export default {
  name: 'NotesViewHeader',

  components: {
    MisoButton,
    FeatherIcon
  },

  props: ['onClose', 'note', 'onShowSidePanel'],

  computed: {
    createdByName () {
      return this.note.created_by_name
    },

    account () {
      return this.note.account
    },

    contact () {
      return this.note.contact
    },

    accountLink () {
      if (this.account && this.account.id) {
        return `/accounts/${this.account.id}`
      }

      return null
    },

    contactLink () {
      if (this.contact && this.contact.id) {
        return `/contacts/${this.contact.id}`
      }

      return null
    }
  }
}
</script>
