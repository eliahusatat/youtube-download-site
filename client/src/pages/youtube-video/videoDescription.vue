<template>
<div>
  <v-container>
    <v-row>
      <v-col cols="1">
        <v-avatar>
          <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
          >
        </v-avatar>
      </v-col>
      <v-col  cols="3" >
       <v-row >
         {{ this.channelTitle }}
       </v-row>
        <v-row>
          {{$t('subscribersNum','279K')}}
        </v-row>
      </v-col>
      <v-col  cols="6" justify="left">

      </v-col>
    </v-row>
        <v-row>
          <p v-html="this.longText" v-if="this.showMore"></p>
          <p v-html="this.shortText" v-else></p>
        </v-row>
        <v-row>
          <v-btn @click="clickShowMore" v-if="isLongText" class="no-background-hover " text>{{this.showMoreBtnText}}</v-btn>
        </v-row>
  </v-container>
</div>
</template>

<script>
export default {
  name: 'videoDescription',
  data () {
    return {
      showMore: false,
      normalTextSize: 200,
      showMoreText: 'SHOW MORE'
    }
  },
  props: {
    channelTitle: {
      type: String,
      default: ''
    },
    description: {

    },
    publishedAt: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    clickShowMore () {
      this.showMore = !this.showMore
      this.showMoreText = this.showMore ? this.$t('showLess') : this.$t('showMore')
    },
    showMoreClick1 () {
      console.log(this.showMore)
      console.log(this.normalTextSize)
      console.log(this.showMoreText)
      console.log(this.shortText)
    }
  },
  computed: {
    longText () {
      return this.description
    },
    shortText () {
      if (!this.description) { return '' }
      const text = this.description.toString()

      if (text.length <= this.normalTextSize) {
        return this.description
      }
      return this.description.substr(0, this.normalTextSize) + '...'
    },
    isLongText () {
      return this.description && this.description.toString().length > this.normalTextSize
    },
    showMoreBtnText () {
      return this.showMore ? this.$t('showLess1') : this.$t('readMore')
    }
  }
}
</script>

<style scoped>
.no-background-hover::before {
  background-color: transparent !important;
}
</style>
