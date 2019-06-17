<template>
  <div class="home">
    <div class="search">
      <div class="search-header">
        <img class="search-header__icon" alt="Mito logo" src="../assets/mito_logo.svg">
        <span class="search-header__title">MITO AIRLINE</span>
      </div>
      <div class="search-form">
        <div class="search-form__section">
          <multiselect
            v-model="departureStation"
            track-by="iata"
            label="shortName"
            placeholder="Origin"
            v-bind:class="{
              'search-select__picker--filled search-select__picker--departure': departureStation,
              'search-select__picker--error': formErrors.departureStation
            }"
            :options="departureStationIATAList"
            @input="formErrors.departureStation = false">
          </multiselect>
          <div class="form-warning" v-if="formErrors.departureStation">
            <img class="form-warning__icon" alt="Warning icon" src="../assets/warn.svg">
            <span class="form-warning__text">Please select departure</span>
          </div>
        </div>
        <div class="search-form__section">
          <multiselect
            v-model="arrivalStation"
            track-by="iata"
            label="shortName"
            placeholder="Destination"
            v-bind:class="{
              'search-select__picker--filled search-select__picker--arrival': arrivalStation,
              'search-select__picker--error': formErrors.arrivalStation
            }"
            :options="arrivalStationIATAList"
            @input="formErrors.arrivalStation = false">
          </multiselect>
          <div class="form-warning" v-if="formErrors.arrivalStation">
            <img class="form-warning__icon" alt="Warning icon" src="../assets/warn.svg">
            <span class="form-warning__text">Please select departure</span>
          </div>
        </div>
        <div class="search-form__section">
          <datepicker
            format="yyyy MMM dd"
            v-model="departureDate"
            placeholder="Departure"
            :disabledDates="disableDepartureToDate"
            v-bind:class="{ 'search-select__picker--error': formErrors.departureDate }"
            @selected="formErrors.departureDate = false">
          </datepicker>
          <div class="form-warning" v-if="formErrors.departureDate">
            <img class="form-warning__icon" alt="Warning icon" src="../assets/warn.svg">
            <span class="form-warning__text">Please select departure</span>
          </div>
        </div>
        <div class="search-form__section">
          <datepicker
            format="yyyy MMM dd"
            v-model="returnDate"
            placeholder="Return"
            :disabledDates="disableReturnToDate">
          </datepicker>
          <div class="form-warning" v-if="formErrors.returnDate">
            <img class="form-warning__icon" alt="Warning icon" src="../assets/warn.svg">
            <span class="form-warning__text">Incorrect</span>
          </div>
        </div>
        <div class="search-submit">
          <button class="search-submit__button" v-on:click="submit">SEARCH</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker'
import { dateFormatter } from '../util/formatter'

const URL = 'https://mock-air.herokuapp.com'
const URL_STATIONS = '/asset/stations'

class FormErrors {
  departureStation = false
  arrivalStation = false
  departureDate = false
  returnDate = false
}

// eddig az időpontig tiltjuk le az indulás kiválasztását
let date = new Date()
date.setDate(date.getDate() - 1)
const yesterday = date

export default {
  name: 'home',
  components: {
    Multiselect,
    Datepicker
  },
  data () {
    return {
      stations: [],
      departureStation: null,
      arrivalStation: null,
      departureDate: null,
      returnDate: null,
      formErrors: new FormErrors(),
      disabledDates: {
        departureDate: { to: yesterday },
        returnDate: { to: yesterday }
      }
    }
  },
  methods: {
    getConnectionsNames: function (connections) {
      let list = []
      for (let connection of connections) {
        for (let station of this.stations) {
          if (connection.iata === station.iata) {
            list.push(station)
          }
        }
      }
      return list
    },
    submit: function () {
      this.formErrors = new FormErrors()

      if (!this.departureStation) {
        this.formErrors.departureStation = true
      }
      if (!this.arrivalStation) {
        this.formErrors.arrivalStation = true
      }
      if (!this.departureDate) {
        this.formErrors.departureDate = true
      }
      if (!this.departureStation || !this.arrivalStation || !this.departureDate) {
        return
      }

      let routeParams = {
        departureStation: this.departureStation.iata,
        departureStationName: this.departureStation.shortName,
        arrivalStation: this.arrivalStation.iata,
        arrivalStationName: this.arrivalStation.shortName,
        departureDate: dateFormatter(this.departureDate)
      }
      if (this.returnDate) {
        routeParams.returnDate = dateFormatter(this.returnDate)
      }

      this.$router.push({
        path: 'search',
        query: routeParams
      })
    }
  },
  computed: {
    departureStationIATAList: function () {
      if (this.arrivalStation) {
        return this.getConnectionsNames(this.arrivalStation.connections)
      } else {
        return this.stations
      }
    },
    arrivalStationIATAList: function () {
      if (this.departureStation) {
        return this.getConnectionsNames(this.departureStation.connections)
      } else {
        return this.stations
      }
    },
    disableReturnToDate: function () {
      if (this.departureDate) {
        return { to: this.departureDate }
      } else {
        return { to: yesterday }
      }
    },
    disableDepartureToDate: function () {
      if (this.returnDate) {
        return {
          to: yesterday,
          from: this.returnDate
        }
      } else {
        return { to: yesterday }
      }
    }
  },
  mounted () {
    this.$http
      .get(URL + URL_STATIONS)
      .then(response => {
        this.stations = response.data
      })
  }
}
</script>

<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="sass" scoped>
  .home
    display: flex
    align-items: center
    justify-content: center
    height: 100vh
    padding: 0 1rem

  .search
    display: flex
    flex-wrap: wrap
    background-color: white
    max-width: 750px

  .search-form
    display: flex
    flex-wrap: wrap
    padding: 1.5rem 1rem
    width: 100%

  .search-form__section
    width: 100%
    padding: 10px
    position: relative

  .search-submit
    width: 100%
    padding: 10px
    display: flex
    justify-content: center

  .search-submit__button
    background-color: #3434E0
    border-radius: 3px
    font-weight: bolder
    color: white
    font-size: 18px
    padding: 0.8rem 4rem

  .search-header
    width: 100%
    background-color: #06038D
    padding: 0.5rem 0.7rem
    display: flex
    align-items: center

  .search-header__title
    color: white
    font-weight: bold

  .search-header__icon
    padding-right: 0.8rem

  .form-warning
    display: flex
    padding-top: 0.8rem

  .form-warning__text
    margin-left: 0.5rem
    color: #C6007E

  @media (min-width: 576px)
    .search-form__section
      width: 50% !important
      margin-bottom: 1.5rem

    .form-warning
      position: absolute
</style>
