<template>
  <div>
    <v-card :width="this.textWidth" :height="this.textHeight">
      <v-skeleton-loader :loading="this.youtube.mainLoader"
                         type="article"
      >
      <v-card-text className=text-right>
        <div className="font-weight-bold">
          {{ this.title | str_limit(18) }}
        </div>
        <div>
          views : {{ this.views }} , {{ this.publishedAt }}
        </div>
      </v-card-text>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'VideoText',
  components: {},
  computed: {
    ...mapState(['youtube'])
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    views: {
      type: String,
      default: ''
    },
    publishedAt: {
      type: String,
      default: ''
    },
    textHeight: {
      type: Number,
      default: 100
    },
    textWidth: {
      type: Number,
      default: 200
    }
  }
}
</script>

<style scoped>
</style>
