<template>
  <div>
    <template>
      <div class="search-results-date">
        <div class="step-week" v-on:click="searchPreviousWeek">
          <img class="step-week__arrow" src="../assets/left-arrow-chevron.svg" alt="left arrow">
          <span class="step-week__date">{{ previousWeek }}</span>
        </div>
        <div class="search-results-date__flight-date">
          {{ flightDate }}
        </div>
        <div class="step-week" v-on:click="searchNextWeek">
          <span class="step-week__date">{{ nextWeek }}</span>
          <img class="step-week__arrow" src="../assets/right-arrow-chevron.svg" alt="right arrow">
        </div>
      </div>
      <template v-if="searchResultList && searchResultList.length !== 0">
        <div class="search-result-list">
          <div class="search-results-bundles">
            <div class="search-results-bundles__item">&nbsp;</div>
            <div v-for="fare in searchResultList[0].fares" v-bind:key="fare.fareSellKey"
                 class="search-results-bundles__item">
              {{ fare.bundle }}
            </div>
          </div>
          <div v-for="flight in searchResultList" v-bind:key="flight.flightNumber"
               class="search-result-list__row">
            <div class="search-result-list__col search-result-list__col--time">
              <div class="search-result-time">
                <span>{{ formatTime(flight.departure) }}</span>
                <img class="search-result-time__arrow" alt="From to" src="../assets/time_arrow.svg">
                <span>{{ formatTime(flight.arrival) }}</span>
              </div>
            </div>
            <div v-for="fare in flight.fares" v-bind:key="fare.fareSellKey"
                 class="search-result-list__col">
              <button
                v-if="flight.remainingTickets > 0"
                class="flight-price-btn"
                v-on:click="onTicketClick(flight, fare)"
                v-bind:class="{'flight-price-btn__selected': fare.selected}"
              >
                ${{ fare.price }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </template>
    <div class="search-results-footer" v-if="loading">
        <loading-animation></loading-animation>
    </div>
    <div class="search-results-footer" v-if="(!searchResultList || searchResultList.length === 0) && !loading">
      No search results
    </div>
  </div>
</template>

<script>
import { timeFormatter } from '../util/formatter'
import moment from 'moment'
import { EventBus } from '../eventbus'
import LoadingAnimation from '../components/LoadingAnimation'

const URL = 'https://mock-air.herokuapp.com'
const URL_SEARCH = '/search'
const SEARCH_PARAM_DEPARTURE = '?departureStation='
const SEARCH_PARAM_ARRIVAL = '&arrivalStation='
const SEARCH_PARAM_DATE = '&date='

export default {
  name: 'SearchResults',
  components: { LoadingAnimation },
  props: {
    searchParameters: {
      from: null,
      to: null,
      date: null
    },
    dateBoundaries: {
      minDate: null,
      maxDate: null
    }
  },
  component: {
    LoadingAnimation
  },
  data () {
    return {
      searchResultList: null,
      loading: false
    }
  },
  methods: {
    formatTime: function (dateStr) {
      return timeFormatter(dateStr)
    },
    getSearchResults: function (departureStation, arrivalStation, date) {
      const searchRequest =
        URL + URL_SEARCH +
        SEARCH_PARAM_DEPARTURE + departureStation +
        SEARCH_PARAM_ARRIVAL + arrivalStation +
        SEARCH_PARAM_DATE + date

      return this.$http.get(searchRequest)
    },
    searchDate: function (date) {
      this.searchResultList = null
      this.searchParameters.date = date
      this.loading = true
      this.getSearchResults(
        this.searchParameters.from,
        this.searchParameters.to,
        this.searchParameters.date
      ).then(response => {
        this.loading = false
        if (response.data.length === 0) {
          this.searchResultList = null
        } else {
          this.searchResultList = response.data
        }
      })
    },
    searchNextWeek: function () {
      const newDate = moment(this.searchParameters.date).add(7, 'd').format('YYYY-MM-DD')
      // ha van maximális dátum akkor nem engedi annál tovább léptetni
      if (
        this.dateBoundaries.maxDate &&
        moment(newDate).isAfter(moment(this.dateBoundaries.maxDate))
      ) {
        return
      }
      this.searchDate(newDate)
      this.$emit('dateChanged', this.searchParameters.date)
    },
    searchPreviousWeek: function () {
      const newDate = moment(this.searchParameters.date).subtract(7, 'd').format('YYYY-MM-DD')
      // ha van minimális dátum akkor nem engedi annál tovább léptetni
      if (
        this.dateBoundaries.minDate &&
        moment(newDate).isBefore(moment(this.dateBoundaries.minDate))
      ) {
        return
      }
      this.searchDate(newDate)
      this.$emit('dateChanged', this.searchParameters.date)
    },
    unSelectTickets: function () {
      for (let i = 0; i < this.searchResultList.length; i++) {
        for (let j = 0; j < this.searchResultList[i].fares.length; j++) {
          // vue nem tudja követni, ha a tömb egy elemének új értéket adok. Ezért:
          let newFare = Object.assign({}, this.searchResultList[i].fares[j])
          newFare.selected = false
          this.$set(this.searchResultList[i].fares, j, newFare)
        }
      }
    },
    onTicketClick: function (selectedFlight, selectedFare) {
      for (let i = 0; i < this.searchResultList.length; i++) {
        for (let j = 0; j < this.searchResultList[i].fares.length; j++) {
          // ha megegyezik a kiválasztottal akkor átállítja a selested értékét, ellenkező esetben leveszi a kijelölést
          if (this.searchResultList[i].fares[j].fareSellKey === selectedFare.fareSellKey) {
            // vue nem tudja követni, ha a tömb egy elemének új értéket adok. Ezért:
            let newFare = Object.assign({}, this.searchResultList[i].fares[j])
            newFare.selected = !newFare.selected
            this.$set(this.searchResultList[i].fares, j, newFare)
            // ha kijelölés történt akkor kibocsátja, ha nem akkor nullal törli
            if (newFare.selected) {
              this.$emit(
                'ticketClicked',
                {
                  selectedFlight,
                  selectedFare,
                  airports: {
                    fromName: this.searchParameters.fromName,
                    toName: this.searchParameters.toName
                  }
                }
              )
            } else {
              this.$emit('ticketClicked', null)
            }
          } else {
            let newFare = Object.assign({}, this.searchResultList[i].fares[j])
            newFare.selected = false
            this.$set(this.searchResultList[i].fares, j, newFare)
          }
        }
      }
    }
  },
  computed: {
    flightDate: function () {
      return moment(this.searchParameters.date).format('dddd, DD MMMM YYYY')
    },
    previousWeek: function () {
      return moment(this.searchParameters.date).subtract(7, 'd').format('ddd DD MMMM')
    },
    nextWeek: function () {
      return moment(this.searchParameters.date).add(7, 'd').format('ddd DD MMMM')
    }
  },
  mounted () {
    this.searchDate(this.searchParameters.date)
  },
  created () {
    EventBus.$on('reset-cart', () => {
      this.unSelectTickets()
    })
  }
}
</script>

<style lang="sass" scoped>
.search-result-list
  background-color: white
  position: relative

.search-result-list__row
  display: flex

.search-result-list__col
  width: 25%
  padding: 1.5rem 0.3rem
  border-top: 1px solid #E5E5E5
  display: flex
  justify-content: center

.search-result-list__col:nth-child(3)
  background-color: #F2F2F2

.search-result-list__col--time
  font-size: 15px
  font-weight: lighter
  display: flex
  align-items: center
  justify-content: center

.search-results-bundles
  display: flex
  position: absolute
  top: 0
  left: 0
  width: 100%

.search-results-bundles__item
  width: 25%
  text-align: center
  font-size: 10px
  font-weight: bold
  text-transform: uppercase
  padding-top: 5px

.flight-price-btn
  border-radius: 2px
  border-color: #C6007E
  border-width: 2px
  font-size: 20px
  font-weight: bold
  cursor: pointer
  text-align: center
  width: 160px
  height: 50px
  background-color: white

.flight-price-btn__selected
  background-color: #C6007E !important
  color: white !important

.flight-price-btn:hover
  background-color: #ffe9f7

.search-result-time
  display: flex
  align-items: center
  flex-direction: column

.search-result-time__arrow
  padding: 0 3px

.search-results-date
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  background-color: white
  padding: 1rem

.search-results-date__flight-date
  font-size: 18px
  color: #343434
  text-align: center
  width: 100%
  order: -1

.step-week
  align-items: center
  display: flex
  font-size: 13px
  color: #919191
  font-weight: bold
  text-transform: uppercase
  cursor: pointer

.step-week__date
  padding: 0 0.5rem

.search-results-footer
  padding: 1rem
  height: 120px
  text-align: center

@media (min-width: 576px)
  .search-results-header-city__name
    width: auto

  .search-results-date__flight-date
    width: unset !important
    order: unset !important

@media (min-width: 768px)
  .search-results-header
    padding: 1.5rem !important
    flex-wrap: nowrap !important

  .search-results-header-city
    justify-content: flex-start !important

  .search-result-time
    flex-direction: row !important
</style>
