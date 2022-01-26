<template>
  <div>
    <v-menu
        :close-on-content-click="false"
        :max-width="$vuetify.breakpoint.smAndDown ? '250' : '300'"
        nudge-bottom="-25"
        offset-y
        style="overflow: hidden"
        transition="scale-transition"
        v-model="timePickerMenu"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
            :maxlength="hideTimePicker ? 8 : null"
            :append-icon="hideInputIcons ? null : 'mdi-plus'"
            :clearable="!hideInputIcons"
            :disabled="disabled"
            :hint="''"
            :label="label"
            :persistent-hint="hideTimePicker"
            @input="shortDateForContactList"
            :readonly="!hideTimePicker"
            :rules="rules"
            @click:clear="$emit('clearDate')"
            autocomplete="off"
            dense
            outlined
            v-model="displaySelectedDate"
            v-on="on"
            validate-on-blur
        ></v-text-field>
      </template>
      <v-card>
        <v-card-text class="px-0 py-0">
          <v-tabs color="primary lighten-2" fixed-tabs v-model="activeTab">
            <v-tab key="calendar">
              <slot name="dateIcon">
                <v-icon>mdi-calendar-blank-outline</v-icon>
              </slot>
            </v-tab>
            <v-tab :disabled="isHourPickerSelected" key="timer" v-if="!hideTimePicker">
              <slot name="timeIcon">
                <v-icon>mdi-clock-outline</v-icon>
              </slot>
            </v-tab>
            <v-tab-item key="calendar">
              <v-date-picker
                  :max="maxDate"
                  :min="minDate"
                  :width="$vuetify.breakpoint.smAndDown ? 250 : 300"
                  @input="showHourPicker"
                  color="primary"
                  v-model="pickedDate">
              </v-date-picker>
            </v-tab-item>
            <v-tab-item key="timer" v-if="!hideTimePicker">
              <v-time-picker
                  :width="$vuetify.breakpoint.smAndDown ? 250 : 300"
                  @input="returnValue"
                  format="24hr"
                  ref="timer"
                  v-model="pickedHour"
              ></v-time-picker>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
        <v-divider class="mx-3"/>
        <v-card-actions>
          <v-row justify="space-around" no-gutters>
            <v-btn v-if="!toAddTenMinutes" @click="now" class="mx-1" color="info" outlined >
              now
              <v-icon right>mdi-clock-time-three-outline</v-icon>
            </v-btn>
            <v-btn @click="confirm" class="mx-1" color="success" outlined>choose
              <v-icon right>mdi-plus</v-icon>
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import moment from 'moment/src/moment'

export default {
  name: 'DateAndTimePicker',
  props: {
    label: String,
    maxDate: String,
    minDate: String,
    rules: Array,
    selectedDate: String,
    toAddTenMinutes: Boolean,
    hideTimePicker: Boolean,
    disabled: Boolean,
    hideInputIcons: Boolean,
    timeToZeroZero: Boolean,
    inputReadOnly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      timePickerMenu: false,
      isHourPickerSelected: false,
      displaySelectedDate: '',
      pickedDate: '',
      pickedHour: '',
      activeTab: 0
    }
  },
  methods: {
    shortDateForContactList (value) {
      if (!value) return
      if (/^(\d{2}\/\d{2})$/.test(value) || /^(\d{2})$/.test(value)) { this.displaySelectedDate += '/' }
    },
    now () {
      if (this.hideTimePicker) { this.setDateOnTextField(moment().format('DD/MM/YY')) } else { this.setDateOnTextField(moment().format('DD/MM/YYYY HH:mm')) }
    },
    formatDate (date) {
      if (!date) return ''
      if (this.hideTimePicker) { return moment(date).format('DD/MM/YY') }
      return moment(date).format('DD/MM/YYYY')
    },
    setDateOnTextField (date) {
      this.displaySelectedDate = date
      this.$emit('input', this.displaySelectedDate)
      this.activeTab = 0
      this.timePickerMenu = false
    },
    confirm () {
      if (this.hideTimePicker) { this.setDateOnTextField(this.formatDate(this.pickedDate)) } else { this.setDateOnTextField(`${this.formatDate(this.pickedDate)} ${this.pickedHour}`) }
    },
    showHourPicker () {
      if (this.hideTimePicker) { this.displaySelectedDate = this.formatDate(this.pickedDate) } else {
        this.activeTab = 1
        this.displaySelectedDate = `${this.formatDate(this.pickedDate)} ${this.pickedHour}`
      }
      this.$emit('input', this.displaySelectedDate)
    },
    returnValue () {
      this.displaySelectedDate = `${this.formatDate(this.pickedDate)} ${this.pickedHour}`
      this.$emit('input', this.displaySelectedDate)
    },
    setPropsDate () {
      this.displaySelectedDate = this.selectedDate // show the date in the input
      this.pickedDate = moment(this.selectedDate, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD') // extract the date
      this.pickedHour = moment(this.selectedDate, 'DD/MM/YYYY HH:mm').format('HH:mm') // extract the minutes
    },
    setInitDate () {
      if (this.selectedDate) { // in case has a date as props that has been already selected
        return this.setPropsDate()
      } else { // in case input is empty - get the current date as default
        const date = new Date()
        this.pickedDate = date.toISOString().substr(0, 10)

        if (this.toAddTenMinutes) // in case limit only 10 minutes from now
        { this.pickedHour = moment().add(12, 'm').format('HH:mm') } else if (this.timeToZeroZero) // some cases i want the default time to be 00:00
        { this.pickedHour = '00:00' } else // current time
        { this.pickedHour = date.toString().substr(16, 5) }
      }
    }
  },
  created () {
    this.setInitDate()
  },
  watch: {
    selectedDate (v) {
      if (v) { this.setPropsDate() } else this.displaySelectedDate = ''
    },
    displaySelectedDate (v) {
      this.$emit('input', v)
    }
  }

}
</script>
