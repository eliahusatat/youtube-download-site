<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-row>
          <v-skeleton-loader :loading="this.youtube.mainLoader"
                             type="image"
                             height="7780px"
                             width="1300px"
          >
            <youtube
                :video-id="this.$route.params.videoId"
                player-width="400"
                player-height="400"
                ref="youtubeVideo"></youtube>
          </v-skeleton-loader>
          </v-row>
          <v-row>
            <v-divider/>
          </v-row>
          <v-row>
            <video-inf
                :title="this.video_data.title"
                :views="this.video_data.viewCount"
                :published-at="this.video_data.publishedAt"
                :tags="this.video_data.tags"
            ></video-inf>
          </v-row>
          <v-row>
            <v-divider/>
          <video-description
          :channel-title="this.video_data.channelTitle"
          :description="this.video_data.description"

          ></video-description>
            <v-divider/>
          </v-row>
          <v-row>
            <video-comments
            :comments="comments_arr"></video-comments>
          </v-row>
        </v-col>
        <v-col>
        <videos-search-list :videos="this.youtube.videos"
                            :text-width="200"
                            :img-width="200"
                            :text-height="120"
                            :img-height="120"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import VideosSearchList from "../../components/VideosSearchList";
import videoInf from "./videoInf";
import videoDescription from "./videoDescription";
import videoComments from "./videoComments";
import {mapState} from "vuex";

export default {
  name: "youtubeVideo",
  components : {
    VideosSearchList,
    videoInf,
    videoDescription,
    videoComments
  },
  data() {
    return {
      isLoading : false,
      comments_arr : [],
      video_data: {}
    }
  },
  props: {
    videoId: {
      type: String
    }
  },
  computed: {
    ...mapState(['youtube'])
  },
  methods: {

  },
  async created() {
    await this.$store.dispatch('youtube/PopularOnYoutube', {
      "str": "Batman"
    });
    const {data} = await this.$store.dispatch('youtube/getVideoFullData', this.$route.params.videoId);
    this.video_data = data;
    console.log(this.video_data.description)
    const {comments} = await this.$store.dispatch('youtube/getVideoComments', {
      "videoId": this.$route.params.videoId
    });
    this.comments_arr = comments;
  }
}
</script>

<style scoped>

</style>