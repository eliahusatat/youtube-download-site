<template>
  <v-app>
    <v-main>
      <youtube-search-bar/>
      <navigation-dawer/>
      <v-fade-transition mode="out-in">
        <router-view/>
      </v-fade-transition>
    </v-main>
    <confirm ref="confirm"/>
    <notification-list ref="notification"/>
  </v-app>
</template>

<script>
import YoutubeSearchBar from './components/YoutubeSearchBar'
import NavigationDawer from './components/NavigationDawer'
import Confirm from './components/Confirm'
import NotificationList from './components/NotificationsList'
import LocalStorageService from './service/LocalStorageService'
import { mapState } from 'vuex'

export default {
  name: 'App',

  components: {
    YoutubeSearchBar,
    Confirm,
    NotificationList,
    NavigationDawer
  },
  mounted () {
    this.$root.$confirm = this.$refs.confirm // set the confirmModal as global
    this.$root.$notification = this.$refs.notification // set the notification component as global
    this.$vuetify.lang.current = LocalStorageService.getItem('SELECTED_APP_LANGUAGE') || 'he'
    this.$vuetify.rtl = ['he'].includes(this.$vuetify.lang.current) // if the selected lang is RTL so be at the right
  },
  computed: {
    ...mapState(['notifications', 'selected_app_language'])
  },
  data: () => ({
    //
  })
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik:100,300');

.v-btn {
  text-transform: none;

}

.v-btn--floating {
  position: relative;
}

.cursor-pointer {
  cursor: pointer;
}

.app-bg {
  background-color: rgba(236, 234, 241, 0.63);
  min-height: 100%;
  min-width: 1024px;
  width: 100%;
  height: auto;
  position: fixed;
  top: 0;
  left: 0;
}

.card-header-title {
  font-size: 15px;
}

.main-nav-text {
  font-size: 13px;
}

.v-toolbar__content {
  padding: 0 !important;
}

.xs-text {
  font-size: 0.6rem;
}

.mobile-text {
  font-size: 0.9rem;
}

.sm-text {
  font-size: 0.7rem;
}

.md-text {
  font-size: 1.1rem;
}

.title-text {
  font-size: 1.4rem;
}

.big-text {
  font-size: 1.6rem;
}

.lg-text {
  font-size: 2.0rem;
}

.xl-text {
  font-size: 2.5rem;
}

.xxl-text {
  font-size: 3.5rem;
}

.v-application div {
  font-family: 'Rubik', sans-serif !important;
}

.v-text-field fieldset, .v-text-field .v-input__control, .v-text-field .v-input__slot {
  /*border-radius: 0 !important;*/
}

.v-btn--tile {
  border-radius: 4px;
}

.v-sheet {
  border-radius: 0 !important;
}

textarea {
  border: none;
  resize: none;
}

.v-alert--prominent .v-alert__icon.v-icon {
  margin: 0 10px;
}

</style>
