<template>
<div>
  <!-- <div :class="[{'mx-10' : $vuetify.breakpoint.mdAndUp, 'mt-10' : $vuetify.breakpoint.mdAndDown}, 'mx-5 ']"> -->
    <youtube-search-bar/>
    <videos-grid v-if="this.youtube.popularMode"
        :videos="this.youtube.videos"
    ></videos-grid>
    <videos-search-list v-if="this.youtube.searchMode"
        :videos="this.youtube.videos"
    ></videos-search-list>
    <video-play
        v-if="this.youtube.videoMode"
        :video-id="this.youtube.choosenVideoId"
    ></video-play>
<!--    <v-overlay z-index="0" :value="this.isLoading">-->
<!--      <dots-loader/>-->
<!--    </v-overlay>-->
  </div>
</template>

<script>
import {mapState} from "vuex";
// import DotsLoader from "@/components/Animations/DotsLoader";
import YoutubeSearchBar from "./templates/YoutubeSearchBar";
import VideosGrid from "./templates/VideosGrid";
import VideosSearchList from "./templates/VideosSearchList";
import VideoPlay from "./templates/VideoPlay";


export default {
  name: 'YoutubePage',
  components: {
    // DotsLoader,
    YoutubeSearchBar,
    VideosSearchList,
    VideosGrid,
    VideoPlay
  },
  data: function () {
    return {
      videos: [],
      isLoading: false
    }
  },
  methods: {

  },
  computed: {
    pageTitle() {
      return  'YoutubePage';
    },
    ...mapState(['youtube'])
  },
  async created() {
    await this.$store.dispatch('youtube/PopularOnYoutube');
  }

};
</script>
<style>


.form-field--tooltip .v-text-field .v-input__append-inner {
  padding-right: 20px;
}

#custom-scroller::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

#custom-scroller::-webkit-scrollbar {
  width: 12px;
  background-color: #F5F5F5;
}

#custom-scroller::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #555;
}

.text--underline {
  text-decoration: underline;
}



</style>

<style scoped>
::v-deep .v-list {
  max-height: 300px;
  overflow-y: auto
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
::v-deep input[type=number] {
  -moz-appearance: textfield;
}
</style>
