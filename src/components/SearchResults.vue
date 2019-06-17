<template>
  <div class="search-results" v-if="searchResultList">
    <div class="search-results-header">
      <div class="search-results-header__title">{{ title }}</div>
      <div class="search-results-header-city">
        <div class="search-results-header-city__name">{{ searchResultList.departureStationName }}</div>
        <img class="search-results-header-city__arrow" alt="From to" src="../assets/arrow_right.svg">
        <div class="search-results-header-city__name">{{ searchResultList.arrivalStationName }}</div>
      </div>
    </div>

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
          <button class="flight-price-btn">
            ${{ fare.price }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormatter } from '../util/formatter'

export default {
  name: 'SearchResults',
  props: {
    searchResultList: null,
    title: null
  },
  methods: {
    formatTime: function (dateStr) {
      return timeFormatter(dateStr)
    }
  }
}
</script>

<style lang="sass" scoped>
.search-results
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)

.search-results-header
  display: flex
  flex-wrap: wrap
  align-items: center
  background-color: #F2F2F2
  padding: 0.5rem

.search-results-header__title
  font-size: 18px
  color: #919191
  width: 150px

.search-results-header-city
  display: flex
  justify-content: space-between
  width: 100%

.search-results-header-city__name
  font-size: 20px
  font-weight: bolder
  color: #06038D
  white-space: nowrap
  width: 100px
  overflow-x: hidden
  text-overflow: ellipsis

.search-results-header-city__arrow
  padding: 0 20px

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

.flight-price-btn:hover
  background-color: #ffe9f7

.search-result-time
  display: flex
  align-items: center
  flex-direction: column

.search-result-time__arrow
  padding: 0 3px

@media (min-width: 576px)
  .search-results-header-city__name
    width: auto

@media (min-width: 768px)
  .search-results-header
    padding: 1.5rem !important
    flex-wrap: nowrap !important

  .search-results-header-city
    justify-content: flex-start !important

  .search-result-time
    flex-direction: row !important
</style>
