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
              {{ cityNames.departureStationName }}
          </div>
        </div>
        <img alt="Right arrow" class="header__arrows" src="../assets/two-way-arrows.svg">
        <div class="header-city">
          <div class="header-city__title">&nbsp;</div>
          <div class="header-city__city">
            {{ cityNames.arrivalStationName }}
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
        <search-results-block
          v-bind:title="'OUTBOUND'"
          v-bind:from-name="cityNames.arrivalStationName"
          v-bind:to-name="cityNames.departureStationName">
          <template v-if="outboundSearch">
            <SearchResults
              class="search-results"
              v-bind:searchParameters="outboundSearch"
              v-bind:dateBoundaries="departureDateBoundaries"
              v-on:dateChanged="onOutboundDateChange"
            />
          </template>
        </search-results-block>

        <search-results-block
          v-bind:title="'INBOUND'"
          v-bind:from-name="cityNames.arrivalStationName"
          v-bind:to-name="cityNames.departureStationName">
          <template v-if="inboundSearch">
            <SearchResults
              class="search-results"
              v-bind:searchParameters="inboundSearch"
              v-bind:dateBoundaries="returnDateBoundaries"
              v-on:dateChanged="onInboundDateChange"
            />
          </template>
          <div v-else class="return-datepicker">
            <datepicker
              class="return-datepicker__input"
              v-model="returnDate"
              placeholder="Return"
              :disabled-dates="disableReturnDate">
            </datepicker>
            <button class="return-datepicker__btn" v-on:click="searchReturn">SEARCH</button>
          </div>
        </search-results-block>
      </div>
    </div>

  </div>
</template>

<script>
import SearchResults from '@/components/SearchResults.vue'
import Datepicker from 'vuejs-datepicker'
import SearchResultsBlock from '../components/SearchResultsBlock'
import { dateFormatter } from '../util/formatter'

const PARAM_REURN_DATE = '&returnDate='

export default {
  name: 'search',
  components: {
    SearchResults,
    Datepicker,
    SearchResultsBlock
  },
  data () {
    return {
      outboundSearch: null,
      inboundSearch: null,
      returnDate: null
    }
  },
  methods: {
    searchReturn: function () {
      const routeQuery = this.$route.query
      this.inboundSearch = {
        from: routeQuery.arrivalStation,
        fromName: routeQuery.arrivalStationName,
        to: routeQuery.departureStation,
        toName: routeQuery.departureStationName,
        date: this.formattedReturnDate
      }
      // hozzáadja a visszaút dátumát az url paraméterekhez
      this.$router.replace(this.$route.fullPath + PARAM_REURN_DATE + this.formattedReturnDate)
    },
    updateRouteDates: function (dates) {
      let routeParams = {
        departureStation: this.$route.query.departureStation,
        departureStationName: this.$route.query.departureStationName,
        arrivalStation: this.$route.query.arrivalStation,
        arrivalStationName: this.$route.query.arrivalStationName,
        departureDate: dates.departureDate || this.$route.query.departureDate
      }

      if (this.$route.query.returnDate || dates.returnDate) {
        routeParams.returnDate = dates.returnDate || this.$route.query.returnDate
      }

      this.$router.push({
        path: 'search',
        query: routeParams
      })
    },
    onOutboundDateChange: function (value) {
      this.updateRouteDates({
        departureDate: value
      })
    },
    onInboundDateChange: function (value) {
      this.updateRouteDates({
        returnDate: value
      })
    }
  },
  computed: {
    formattedReturnDate: function () {
      return dateFormatter(this.returnDate)
    },
    cityNames: function () {
      return {
        departureStationName: this.$route.query.departureStationName,
        arrivalStationName: this.$route.query.arrivalStationName,
        departureDate: this.$route.query.departureDate
      }
    },
    departureDateBoundaries: function () {
      const dateObj = new Date()
      return {
        minDate: dateFormatter(dateObj),
        maxDate: this.$route.query.returnDate
      }
    },
    returnDateBoundaries: function () {
      return {
        minDate: this.$route.query.departureDate,
        maxDate: null
      }
    },
    disableReturnDate: function () {
      return {
        to: new Date(this.$route.query.departureDate)
      }
    }
  },
  mounted () {
    const routeQuery = this.$route.query
    this.outboundSearch = {
      from: routeQuery.departureStation,
      fromName: routeQuery.departureStationName,
      to: routeQuery.arrivalStation,
      toName: routeQuery.arrivalStationName,
      date: routeQuery.departureDate
    }

    // ha van megadva vissza út dátum, akkor a cél és induló állomást megcserélve végez el egy keresést
    if (routeQuery.returnDate) {
      this.inboundSearch = {
        from: routeQuery.arrivalStation,
        fromName: routeQuery.arrivalStationName,
        to: routeQuery.departureStation,
        toName: routeQuery.departureStationName,
        date: routeQuery.returnDate
      }
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
    padding-bottom: 300px

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

  .return-datepicker
    width: 100%
    padding: 3rem 0.5rem 5rem
    display: flex
    justify-content: center

  .return-datepicker__input
    width: 300px

  .return-datepicker__btn
    margin-left: 0.5rem
    background-color: #3434E0
    font-size: 18px
    text-transform: uppercase
    color: white
    font-weight: bold
    padding: 0 1rem
    border-radius: 3px

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
