<template>
  <v-menu
      :nudge-left=" type === 'settingsPage' ? 0 : 40"
      bottom
      offset-y
      transition="slide-y-transition"
      z-index="5">

    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom color="primary darken-1" nudge-bottom="-15">
        <template v-slot:activator="{ on: tooltip }">

          <v-btn color="primary" large outlined v-if="type === 'settingsPage'" v-on="{...menu}" width="150">
            {{$t('$vuetify.chooseLanguage')}}
            <v-icon right>mdi-translate</v-icon>
          </v-btn>

          <v-btn icon v-else v-on="{ ...tooltip, ...menu }">
            <v-icon color="primary">mdi-web</v-icon>
          </v-btn>
        </template>
        {{$t('chooseLanguage')}}
      </v-tooltip>
    </template>

    <v-list>
      <v-list-item-group mandatory v-model="appLang">
        <template v-for="(item, i) in langOptions">
          <v-list-item
              :key="i"
              :value="item.key"
              @click="switchLanguage(item)"
              active-class="primary--text"
              class="pa-2"
              link
              style="z-index: 5">
            <v-list-item-title class="mx-2">{{ item.title }}</v-list-item-title>
            <img :src="item.img()" alt="">
          </v-list-item>
          <v-list-item-title class="my-1 mx-1"  :key="i*langOptions.length+langOptions.length">
            <v-divider/>
          </v-list-item-title>
        </template>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>
<script>

import LocalStorageService from '@/service/LocalStorageService'
import { getAppLanguagesOptions } from '@/utils/getDefaultData'
export default {
  name: 'LanguageSwitcherMenu',
  props: ['type'],
  data () {
    return {
      appLang: '',
      langOptions: getAppLanguagesOptions()
    }
  },
  methods: {
    switchLanguage (selectedLang) {
      if (selectedLang.key === this.appLang) return
      // this.$store.commit('UPDATE_APP_LOADER', true);
      LocalStorageService.setItem('SELECTED_APP_LANGUAGE', selectedLang.key)
      console.log(this.$vuetify.rtl)
      window.location.reload()
      setTimeout(() => {
        this.$vuetify.lang.current = selectedLang.key
        this.$vuetify.rtl = selectedLang.isRtl
        console.log('in setTimeout')
        console.log(this.$vuetify.rtl)
        // this.$store.commit('UPDATE_APP_LOADER', false);
      }, 1000)
    }
  },
  created () {
    this.appLang = LocalStorageService.getItem('SELECTED_APP_LANGUAGE')
  }
}
</script>
