<template>
  <div>
    <v-container>
        <Video  v-for="(v, index) in this.videos"
                :key = index
                :duration="v.duration"
                :img-src="v.url"
                :published-at="v.publishedAt"
                :title="v.title"
                :views="v.views"
                :text-side=true
                :vertical="false"
                :text-height="textHeight"
                :text-width="textWidth"
                :img-height="imgHeight"
                :img-width="imgWidth"
                @click.native="goToVideo(v.videoId)"
        ></Video>
    </v-container>
  </div>
</template>

<script>
import Video from './Video'
import { mapActions } from 'vuex'
export default {
  name: 'VideosSearchList',
  components: {
    Video
  },
  data: function () {
    return {
      isLoading: false
    }
  },
  props: {
    videos: {
      type: Array
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
    }
  },
  methods: {
    ...mapActions('youtube', ['viewVideo']),
    async goToVideo (videoId) {
      await this.viewVideo(videoId)
      this.$router.push(`/youtube-video/${videoId}`)
    }
  }
}
</script>

<style scoped>

</style>
