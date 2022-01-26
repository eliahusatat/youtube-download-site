<template>
  <div :class="[{'mx-10' : $vuetify.breakpoint.mdAndUp, 'mt-10' : $vuetify.breakpoint.mdAndDown}, 'mx-5 ']">
  <videos-search-list
                      :videos="this.youtube.videos"
                      :text-width="800"
                      :img-width="300"
                      :text-height="200"
                      :img-height="200"
                      v-if="this.youtube.videos.length > 0"
  ></videos-search-list>
    <div v-else>
      {{$t('noVideosFoundInSearch', this.$route.params.searchQuery)}}
    </div>
  </div>
</template>

<script>
import VideosSearchList from '@/components/VideosSearchList'
import { mapState } from 'vuex'
export default {
  name: 'youtubeSearch',
  components: {
    VideosSearchList
  },
  computed: {
    pageTitle () {
      return 'YoutubePage'
    },
    ...mapState(['youtube'])
  }
}
</script>

<style scoped>

</style>
