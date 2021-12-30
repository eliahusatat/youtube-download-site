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
                                @click.native="viewVideo(v.videoId)"
                        ></Video>
                </v-row>
  </v-container>
  </div>
</template>

<script>
import Video from "../components/Video";
import {mapActions} from "vuex";

export default {
name: "VideosGrid",
  components: {
    Video
  },
  data: function () {
    return {
      isLoading : false
    }
  },
  props: {
    videos :{
      type: Array
    }
},
  methods: {
    ...mapActions('youtube',['viewVideo']),
  //todo add fix for views
  }
}
</script>

<style scoped>

</style>