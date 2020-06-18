<template>
  <miso-modal :visible="isVisible">

    <header class="flex items-center justify-between" slot="title">

      <miso-heading level="3" class="mv0">Inserting template</miso-heading>

      <miso-button type="transparent" @click="onHideModal">
        <feather-icon color="mid-gray" width="24" height="24" name="x"></feather-icon>
      </miso-button>

    </header>

    <div class="pa3">
      <p class="lh-copy f5 mv0">
        Inserting this template may overwrite the changes you already made.
        Are you sure you want to do this?
      </p>
    </div>

    <footer class="pa3" slot="footer">

      <miso-button class="mr2" @click="onHideModal">Cancel</miso-button>

      <miso-button type="danger" @click="onConfirm">Confirm</miso-button>

    </footer>

  </miso-modal>
</template>

<script>
  import Vue from 'vue'

  import { mapGetters } from 'vuex'

  import {
    MisoModal,
    MisoHeading,
    MisoButton,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'insert-template-confirm-modal',

    props: [
      'isVisible',
      'onHideModal',
      'onConfirm'
    ],

    components: {
      MisoModal,
      MisoHeading,
      MisoButton,
      FeatherIcon
    }
  }
</script>
