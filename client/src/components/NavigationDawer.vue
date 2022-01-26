<template>
  <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      absolute
      hide-overlay="false"
      temporary
      :right="!this.$vuetify.rtl"
      height="872px"
      class="overflow-y-auto"
  >
    <v-list nav dense>
      <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
      >
        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-home</v-icon>
          <v-list-item-title class="body-1">{{$t('homeBar')}}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-compass</v-icon>
          <v-list-item-title class="body-1">{{$t('exploreBAr')}}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-youtube-subscription</v-icon>
          <v-list-item-title class="body-1">{{$t('subscriptionsBAr')}}</v-list-item-title>
        </v-list-item>
        <v-divider/>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-music-box-multiple-outline</v-icon>
          <v-list-item-title class="body-1">{{$t('libraryBar')}}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-history</v-icon>
          <v-list-item-title class="body-1">{{ $t('historyBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-clock</v-icon>
          <v-list-item-title class="body-1">{{ $t('watchLaterBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-thumb-up-outline</v-icon>
          <v-list-item-title class="body-1">{{ $t('likedVideosBar') }}</v-list-item-title>
        </v-list-item>
        <v-divider/>

        <v-list-item>
          <v-list-item-title class="body-2">{{ $t('subscriptionsBar') }}</v-list-item-title>
        </v-list-item>
        <v-divider/>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-youtube</v-icon>
          <v-list-item-title class="body-1">{{ $t('youTubePremiumBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-youtube-gaming</v-icon>
          <v-list-item-title class="body-1">{{ $t('gamingBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-antenna</v-icon>
          <v-list-item-title class="body-1">{{ $t('liveBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-trophy-variant-outline</v-icon>
          <v-list-item-title class="body-1">{{ $t('sportsBar') }}</v-list-item-title>
        </v-list-item>
        <v-divider/>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-cog-outline</v-icon>
          <v-list-item-title class="body-1">{{ $t('settingsBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-flag-outline</v-icon>
          <v-list-item-title class="body-1">{{ $t('reportHistoryBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-help-circle-outline</v-icon>
          <v-list-item-title class="body-1">{{ $t('helpBar') }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon class="pr-0 mr-3 ">mdi-message-alert-outline</v-icon>
          <v-list-item-title class="body-1">{{ $t('sendFeedbackBar') }}</v-list-item-title>
        </v-list-item>
        <v-divider/>

        <v-list-item>
          <v-list-item-title v-html="$t('copyright1Bar')" class="ma-3"></v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title v-html="$t('termBar')" class="ma-3"></v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title>{{ $t('copyright2Bar') }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavigationDawer',
  data: () => ({
    group: null
  }),
  computed: {
    drawer: {
      get () {
        return this.$store.state.navigationDrawer
      },
      set (value) {
        this.$store.commit('SET', { name: 'navigationDrawer', value: value })
      }
    }
  }
}
</script>

<style scoped>

</style>
