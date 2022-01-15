<template>
  <div>
        <v-container>
                <v-row justify="space-around">
                        <Video  v-for="(v, index) in this.videos"
                                :key = index
                                :duration="v.duration"
                                :img-src="v.url"
                                :published-at="v.publishedAt"
                                :title="v.title"
                                :views="v.views"
                                :text-side=true
                                :id = v.videoId
                                :text-width="300"
                                :img-width="300"
                                :text-height="100"
                                :img-height="200"
                                @click.native="goToVideo(v.videoId)"
                        ></Video>
                </v-row>
  </v-container>
  </div>
</template>

<script>
import Video from '../../components/Video'
import { mapActions } from 'vuex'

export default {
  name: 'VideosGrid',
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
    }
  },
  methods: {
    ...mapActions('youtube', ['viewVideo']),
    async goToVideo (videoId) {
      await this.viewVideo(videoId)
      this.$router.push(`/youtube-video/${videoId}`).catch(() => { this.$router.push('/youtube-home') })
    }
  }
}
</script>

<style scoped>

</style>
