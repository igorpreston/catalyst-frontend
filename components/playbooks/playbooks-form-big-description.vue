<template lang="html">
  <div class="flex flex-column pb24 bb b--light-gray">
    <miso-label>Description (Optional)</miso-label>

    <miso-input
      :value="playbookFormData.description"
      variant="white"
      @input="setDescription"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import {
  MisoLabel,
  MisoInput
} from 'miso'

export default {
  name: 'PlaybooksFormBigDescription',

  components: {
    MisoLabel,
    MisoInput
  },

  computed: {
    ...mapGetters(['playbookFormData'])
  },

  methods: {
    ...mapMutations(['setPlaybookFormdata']),

    setDescription (value) {
      this.setPlaybookFormdata({ key: 'description', value })
    }
  }
}
</script>
