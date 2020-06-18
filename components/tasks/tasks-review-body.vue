<template>
  <div class="flex-auto flex">
    <tasks-review-company/>
    <tasks-review-complete/>
  </div>
</template>

<script>
import TasksReviewCompany from '#/components/tasks/tasks-review-company'
import TasksReviewComplete from '#/components/tasks/tasks-review-complete'

export default {
  name: 'TasksReviewBody',

  components: {
    TasksReviewCompany,
    TasksReviewComplete
  }
}
</script>
