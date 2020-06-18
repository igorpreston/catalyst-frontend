<template/>

<script>
import { MisoMessage } from 'miso'

export default {
  name: 'FlashMessage',
  props: ['success', 'info'],
  created () {
    if (this.success) {
      MisoMessage.success(this.success)
    } else if (this.info) {
      MisoMessage.info(this.info)
    }
  }
}
</script>
