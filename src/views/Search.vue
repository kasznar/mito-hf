<template>
  <div class="search">
    <div class="header">
      <router-link to="/">
        <img class="header__icon" alt="Mito logo" src="../assets/mito_logo.svg" >
      </router-link>
      <template>
        <div class="header-city">
          <div class="header-city__title">LEAVING FROM</div>
          <div class="header-city__city">
              {{ routeParams.departureStationName }}
          </div>
        </div>
        <img alt="Right arrow" class="header__arrows" src="../assets/two-way-arrows.svg">
        <div class="header-city">
          <div class="header-city__title">&nbsp;</div>
          <div class="header-city__city">
            {{ routeParams.arrivalStationName }}
          </div>
        </div>
      </template>
    </div>

    <div class="results-header">
      <div class="results-header__spacer">&nbsp;</div>
      <img class="results-header__icon" src="../assets/airplane.svg" alt="Airplane">
      <span class="results-header__title">SELECT FLIGHT</span>
    </div>

    <div class="content">
      <div class="content__cart">
        cart
      </div>
      <div class="content__results">
        <SearchResults class="search-results" v-bind:searchResultList="outbound" v-bind:title="'OUTBOUND'"/>

        <SearchResults class="search-results" v-bind:searchResultList="inbound" v-bind:title="'INBOUND'"/>

        <div v-if="!inbound" style="width: 100%; padding: 10px">
          <datepicker  v-model="returnDate" placeholder="Return"></datepicker>
          <button v-on:click="searchReturn">SEARCH</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import SearchResults from '@/components/SearchResults.vue'
import Datepicker from 'vuejs-datepicker'
import { dateFormatter } from '../util/formatter'

const URL = 'https://mock-air.herokuapp.com'
const URL_SEARCH = '/search'
const SEARCH_PARAM_DEPARTURE = '?departureStation='
const SEARCH_PARAM_ARRIVAL = '&arrivalStation='
const SEARCH_PARAM_DATE = '&date='

const PARAM_REURN_DATE = '&returnDate='

export default {
  name: 'search',
  components: {
    SearchResults,
    Datepicker
  },
  data () {
    return {
      outbound: null,
      inbound: null,
      returnDate: null
    }
  },
  methods: {
    getSearchResults: function (departureStation, arrivalStation, date) {
      // todo error handling
      const searchRequest =
        URL + URL_SEARCH +
        SEARCH_PARAM_DEPARTURE + departureStation +
        SEARCH_PARAM_ARRIVAL + arrivalStation +
        SEARCH_PARAM_DATE + date

      return this.$http.get(searchRequest)
    },
    searchReturn: function () {
      this.getSearchResults(
        this.routeParams.arrivalStation,
        this.routeParams.departureStation,
        this.formattedReturnDate
      ).then(response => {
        this.$router.replace(this.$route.fullPath + PARAM_REURN_DATE + this.formattedReturnDate)
        this.inbound = response.data
        this.inbound.departureStationName = this.routeParams.arrivalStationName
        this.inbound.arrivalStationName = this.routeParams.departureStationName
      })
    }
  },
  computed: {
    formattedReturnDate: function () {
      return dateFormatter(this.returnDate)
    },
    routeParams: function () {
      return {
        departureStationName: this.$route.query.departureStationName,
        arrivalStationName: this.$route.query.arrivalStationName
      }
    }
  },
  mounted () {
    const routeQuery = this.$route.query
    this.getSearchResults(
      routeQuery.departureStation,
      routeQuery.arrivalStation,
      routeQuery.departureDate
    ).then(response => {
      this.outbound = response.data
      this.outbound.departureStationName = routeQuery.departureStationName
      this.outbound.arrivalStationName = routeQuery.arrivalStationName
    })

    // ha van megadva vissza út dátum, akkor a cél és induló állomást megcserélve végez el egy keresést
    if (routeQuery.returnDate) {
      this.getSearchResults(
        routeQuery.arrivalStation,
        routeQuery.departureStation,
        routeQuery.returnDate
      ).then(response => {
        this.inbound = response.data
        this.inbound.departureStationName = routeQuery.arrivalStationName
        this.inbound.arrivalStationName = routeQuery.departureStationName
      })
    }
  }
}
</script>

<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="sass" scoped>
  .header
    width: 100%
    background-color: #06038D
    padding: 0.5rem 0.8rem
    display: flex
    align-items: center
    color: white
    justify-content: space-between

  .header__icon
    padding-right: 0.8rem

  .header__arrows
    margin: 0 5px

  .header-city__title
    font-size: 10px
    white-space: nowrap

  .header-city__city
    font-size: 20px
    white-space: nowrap
    width: 100px
    overflow-x: hidden
    text-overflow: ellipsis

  .content
    display: flex
    flex-wrap: wrap

  .content__cart
    width: 100%

  .content__results
    width: 100%

  .results-header__title
    font-size: 30px
    color: #0A008B

  .results-header__spacer
    display: none

  .results-header
    display: flex
    padding: 1rem 0
    justify-content: center

  .search-results
    margin-bottom: 4rem

  @media (min-width: 576px)
    .header
      justify-content: left

    .header-city__city
      width: auto !important

  @media (min-width: 768px)
    .content__results
      width: 80% !important
      padding-right: 2rem

    .content__cart
      width: 20% !important

    .header__icon
      margin-right: 200px

    .header__arrows
      margin: 0 40px

    .header
      padding: 1rem 1.2rem

    .results-header__spacer
      display: block !important
      width: 20%

    .results-header
      display: flex
      padding: 2.5rem 0 !important
      justify-content: left

    .results-header__title
      font-size: 40px !important
</style>
