<template>
  <div>
    <v-container>
      <div v-if="this.vertical">
        <v-row >
          <video-img
              :duration="this.duration"
              :img-src="this.imgSrc"
              :img-height="this.imgHeight"
              :img-width="this.imgWidth"
          >
          </video-img>
        </v-row>
        <v-row >
          <video-text
              :published-at="this.publishedAt"
              :title="this.title"
              :views="this.views"
              :text-height="this.textHeight"
              :text-width="this.textWidth"
          >
          </video-text>
        </v-row>
      </div>
      <div v-else>
        <v-row >
          <video-img
              :duration="this.duration"
              :img-src="this.imgSrc"
              :img-height="this.imgHeight"
              :img-width="this.imgWidth">
          </video-img>
          <video-text
              :published-at="this.publishedAt"
              :title="this.title"
              :views="this.views"
              :text-height="this.textHeight"
              :text-width="this.textWidth">
          </video-text>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import VideoText from './VideoText'
import VideoImg from './VideoImg'
import { mapState } from 'vuex'
export default {
  name: 'Video',
  components: {
    VideoText,
    VideoImg
  },
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
    duration: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    },
    imgHeight: {
      type: Number,
      default: 100
    },
    imgWidth: {
      type: Number,
      default: 200
    },
    textHeight: {
      type: Number,
      default: 100
    },
    textWidth: {
      type: Number,
      default: 200
    },
    textSide: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    vertical: {
      Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
</style>
