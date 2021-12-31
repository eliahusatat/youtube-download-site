<template>
<div>
  <v-container>
    <v-row >
      <v-col>
  <youtube v-if="this.videoId != ''" :video-id="this.videoId" player-width="600" player-height="444" ref="youtubeVideo" ></youtube>
 </v-col>
 <v-col>
  <videos-search-list :videos="this.youtube.videos"/>
   </v-col>
    </v-row>
  </v-container>
</div>
</template>

<script>
import VideosSearchList from "./VideosSearchList";
import {mapState} from "vuex";

export default {
  name: 'VideoPlay',
  components : {
    VideosSearchList
  },
  data() {
    return {
      isLoading : false
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
}
</script>

<style scoped>

</style>