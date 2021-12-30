<template>
  <div>
  <v-row>
    <p>{{this.title}}</p>
  </v-row>
  <v-row>
    <p>{{this.views}} - {{this.publishedAt}}</p>
  </v-row>
  </div>
</template>

<script>
export default {
  name: "VideoText",
  props: {
    title: {
      type: String,
      default: ''
    },
    views: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
  }
}
</script>

<style scoped>

</style>