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
                @click.native="viewVideo(v.videoId)"
        ></Video>
    </v-container>
  </div>
</template>

<script>
import Video from "../components/Video";
import {mapActions} from "vuex";
export default {
  name: "VideosSearchList",
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
    ...mapActions('youtube',['viewVideo']),
  }
}
</script>

<style scoped>

</style>