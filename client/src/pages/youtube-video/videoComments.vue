<template>
  <v-container>
    <v-row>
      <v-col>
      {{$t('comments',commentNum)}}
      </v-col>
      <v-col>
       {{$t('sortBy')}}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
        <v-avatar>
          <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John"
          >
        </v-avatar>
      </v-col>
      <v-col  cols="11" >
        <v-row >
          {{$t('commentingPublicly')}}
        </v-row>
        <v-row>
          <v-divider/>
        </v-row>
      </v-col>
    </v-row>
    <div  v-if="comments.length > 0">
    <v-row v-for="(comment,i) in comments" :key="i">
       <video-comment-item :comment="comment"></video-comment-item>
    </v-row>
    </div>
    <div  v-else>
    <v-row >
       {{$t('noCommentsFound')}}
    </v-row>
    </div>
  </v-container>
</template>

<script>
import VideoCommentItem from './VideoCommentItem'
export default {
  name: 'videoComments',
  components: {
    VideoCommentItem
  },
  props: {
    comments: {
      type: Array,
      default: () => {
        return []
      }
    },
    commentNum: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
