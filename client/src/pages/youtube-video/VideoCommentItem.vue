<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        <v-avatar>
          <img
              :src="this.comment.imgSrc"
          >
        </v-avatar>
      </v-col>
      <v-col  cols="11" >
        <v-row >
         {{this.comment.name}}   {{this.comment.publishedAt}}
        </v-row>
        <v-row>
          <p v-html="this.longText" v-if="this.showMore"></p>
          <p v-html="this.shortText" v-else></p>
        </v-row>
        <v-row>
          <v-btn @click="clickShowMore" v-if="isLongText" class="no-background-hover " text>{{this.showMoreBtnText}}</v-btn>
        </v-row>
        <v-row>
          <v-col cols="1" px-0>
            <v-icon>mdi-thumb-up-outline</v-icon>
          </v-col>
          <v-col cols="1" px-0>
            <v-icon>mdi-thumb-down-outline</v-icon>
          </v-col>
          <v-col cols="1" px-0>
            <v-btn  class="no-background-hover " text>REPLY</v-btn>
          </v-col>
        </v-row>
      </v-col>

    </v-row>
    <v-row>

    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'VideoCommentItem',
  props: {
    comment: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      showMore: false,
      normalTextSize: 200
    }
  },
  computed: {
    longText () {
      return this.comment.text
    },
    shortText () {
      if (!this.comment.text) { return '' }
      const text = this.comment.text.toString()

      if (text.length <= this.normalTextSize) {
        return this.comment.text
      }
      return this.comment.text.substr(0, this.normalTextSize) + '...'
    },
    isLongText () {
      return this.comment.text && this.comment.text.toString().length > this.normalTextSize
    },
    showMoreBtnText () {
      return this.showMore ? 'Read more' : 'Show less'
    }
  },
  methods: {
    clickShowMore () {
      this.showMore = !this.showMore
    }
  }
}
</script>

<style scoped>
.no-background-hover::before {
  background-color: transparent !important;
}
.no-background-hover:hover {
  text-decoration: underline !important;
}
</style>
