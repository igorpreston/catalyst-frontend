<template>
  <div class="flex flex-auto pa3 flex-column ticket__info">
    <div class="flex flex-auto flex-column bb b--light-gray">
      <h3 class="ttu mid-gray ma0 ticket__heading">Subject</h3>
      <p class="mt0 mb3 f6">You will like this ticket, I garantee it</p>

      <h3 class="ttu mid-gray ma0 ticket__heading">Description</h3>
      <p class="mt0 mb3 f6">Lorem ipsum dolor amet hoodie crucifix intelligentsia beard, truffaut fingerstache bushwick disrupt sartorial. Meditation microdosing venmo, asymmetrical disrupt godard quinoa semiotics brunch locavore actually cloud bread. Waistcoat helvetica shabby chic air plant.</p>

      <div class="flex flex-auto flex-row">
        <div class="flex-auto">
          <h3 class="ttu mid-gray ma0 ticket__heading">Status</h3>

          <p class="mt0 f6 ticket__item--bottom">Open</p>
        </div>

        <div class="flex-auto">
          <h3 class="ttu mid-gray ma0 ticket__heading">Priority</h3>

          <p class="mt0 f6 ticket__item--bottom">High</p>
        </div>
      </div>
    </div>

    <div class="flex flex-auto flex-column ticket__sub-info">
      <h3 class="ttu mid-gray ma0 ticket__heading">Ticket Owner</h3>
      <p class="mt0 mb3 f6">Derik Olsson</p>

      <h3 class="ttu mid-gray ma0 ticket__heading">Ticket Submitter</h3>
      <a
        href="#"
        class="mt0 mb3 f6 link">
        Jon Snow
      </a>

      <h3 class="ttu mid-gray ma0 ticket__heading">Created</h3>
      <p class="mt0 mb3 f6">9/21/2017 at 3:45 pm</p>

      <h3 class="ttu mid-gray ma0 ticket__heading">Updated</h3>
      <p class="mt0 mb3 f6">10/13/2017 at 3:45 pm</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ticket-view-info'
  }
</script>

<style lang="scss">
  .ticket {
    &__info {
      line-height: 22px;
    }

    &__heading {
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 15px;
    }

    &__item {
      &--bottom {
        margin-bottom: 24px;
      }
    }

    &__sub-info {
      margin-top: 24px;
    }
  }
</style>
